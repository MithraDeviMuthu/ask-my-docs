from pypdf import PdfReader
import os
import chromadb
from sentence_transformers import SentenceTransformer

def extract_text(pdf_path):
    reader = PdfReader(pdf_path)
    return "\n".join(page.extract_text() or "" for page in reader.pages)

documents = {}
for filename in os.listdir("data"):
    if filename.endswith(".pdf"):
        source_name = filename.replace(".pdf", "")
        documents[source_name] = extract_text(f"data/{filename}")

print("Documents found:", list(documents.keys()))

def chunk_text(text, chunk_size=400, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks

all_chunks = []
all_sources = []

for source_name, text in documents.items():
    for chunk in chunk_text(text):
        all_chunks.append(chunk)
        all_sources.append(source_name)

print(f"Total chunks created: {len(all_chunks)}")

model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(all_chunks).tolist()

client = chromadb.PersistentClient(path="./chroma_store")
collection = client.get_or_create_collection("career_docs")

collection.add(
    documents=all_chunks,
    embeddings=embeddings,
    metadatas=[{"source": s} for s in all_sources],
    ids=[f"chunk_{i}" for i in range(len(all_chunks))]
)

print(f"Stored {len(all_chunks)} chunks in Chroma successfully.")