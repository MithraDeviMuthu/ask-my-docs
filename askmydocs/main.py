from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
import chromadb
import ollama
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer("all-MiniLM-L6-v2")
client_db = chromadb.PersistentClient(path="./chroma_store")
COLLECTION_NAME = "career_docs"


def chunk_text(text, chunk_size=400, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Please upload a PDF file.")

    contents = await file.read()
    reader = PdfReader(io.BytesIO(contents))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)

    if not text.strip():
        raise HTTPException(400, "Couldn't extract any readable text from this PDF.")

    chunks = chunk_text(text)
    embeddings = model.encode(chunks).tolist()

    collection = client_db.get_or_create_collection(COLLECTION_NAME)

    # upsert (not add) so re-uploading the same filename overwrites its old chunks
    # instead of erroring on duplicate IDs
    collection.upsert(
        documents=chunks,
        embeddings=embeddings,
        metadatas=[{"source": file.filename} for _ in chunks],
        ids=[f"{file.filename}_chunk_{i}" for i in range(len(chunks))],
    )

    return {"message": f"Processed {file.filename}", "chunks": len(chunks)}


@app.get("/documents")
def list_documents():
    try:
        collection = client_db.get_collection(COLLECTION_NAME)
        metadatas = collection.get()["metadatas"]
    except Exception:
        return {"documents": []}
    return {"documents": sorted({m["source"] for m in metadatas})}


@app.delete("/documents")
def clear_documents():
    try:
        client_db.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    return {"message": "All documents cleared."}


class Question(BaseModel):
    question: str


@app.post("/ask")
def ask(q: Question):
    try:
        collection = client_db.get_collection(COLLECTION_NAME)
        results = collection.query(
            query_embeddings=model.encode([q.question]).tolist(),
            n_results=6,
        )
    except Exception:
        raise HTTPException(400, "Please upload a PDF first.")

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    distances = results["distances"][0]

    if not docs:
        raise HTTPException(400, "Please upload a PDF first.")

    # keep only reasonably close matches (lower distance = more relevant);
    # tune THRESHOLD by printing `distances` and checking where relevant
    # chunks cluster vs irrelevant ones
    THRESHOLD = 1.0
    filtered = [(d, m) for d, m, dist in zip(docs, metas, distances) if dist < THRESHOLD]
    if not filtered:
        filtered = [(docs[0], metas[0])]  # always keep at least the best match

    context = "\n\n".join(d for d, _ in filtered)
    sources = list({m["source"] for _, m in filtered})

    prompt = f"""Answer the question using ONLY the context below, which comes from documents the user uploaded.
If the answer isn't in the context, say so politely.

Context:
{context}

Question: {q.question}
"""

    response = ollama.chat(model="llama3", messages=[{"role": "user", "content": prompt}])

    return {"answer": response["message"]["content"], "sources": sources}