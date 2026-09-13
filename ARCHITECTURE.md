# Architecture

## Data flow diagrams

### Upload pipeline

```mermaid
flowchart TD
    A[User selects file .pdf] --> B[Frontend: UploadPage.jsx<br/>POST /upload<br/>FormData]
    B --> C[Backend: main.py<br/>upload_pdf route]
    C --> D[Text extraction<br/>pypdf.PdfReader]
    D --> E[Chunking<br/>~400 words, 50-word overlap]
    E --> F[Embedding<br/>sentence-transformers<br/>all-MiniLM-L6-v2]
    F --> G[Vector store<br/>ChromaDB collection<br/>tagged with source filename]
    G --> H[Response: message, chunk count]
```

### Query pipeline

```mermaid
flowchart TD
    A[User types question] --> B[Frontend: chat panel<br/>POST /ask]
    B --> C[Backend: main.py<br/>ask route]
    C --> D[Embed question<br/>same MiniLM model]
    D --> E[ChromaDB similarity search<br/>top-k relevant chunks]
    E --> F[Build grounding prompt<br/>context + question]
    F --> G[Ollama: llama3<br/>local inference]
    G --> H[Response: answer, sources]
    H --> I[Frontend renders<br/>chat bubble + source tag]
```

## Module dependency graph

```mermaid
flowchart TD
    subgraph Frontend
        AppJS[App.js]
        AppCSS[App.css]
        AppJS --> AppCSS
    end

    subgraph Backend
        MainPY[main.py]
        IngestPY[ingest.py]
        MainPY --> Chroma[chromadb]
        MainPY --> ST[sentence_transformers]
        MainPY --> Ollama[ollama]
        MainPY --> PyPDF[pypdf]
        IngestPY --> Chroma
        IngestPY --> ST
        IngestPY --> PyPDF
    end

    AppJS -- HTTP requests --> MainPY
```

## Why these choices

- **ChromaDB** — lightweight, file-based, no separate server to run; ideal for a local, single-user tool.
- **sentence-transformers (MiniLM)** — small, fast, runs on CPU with no API cost, good enough quality for short documents like resumes.
- **Ollama + Llama 3** — avoids API keys and per-request cost entirely, at the expense of slower CPU-bound inference.
- **Chunk size (400 words, 50 overlap)** — balances context completeness against retrieval precision.

## Directory structure

```
ask-my-docs/
├── askmydocs/            # FastAPI backend
│   ├── main.py           # API routes: /upload, /ask
│   └── ingest.py         # Standalone ingestion script
├── frontend/             # React frontend
│   └── src/
│       ├── App.js
│       └── App.css
├── README.md
├── RUN.md
├── ARCHITECTURE.md
└── INTERVIEW.md
```

## Known limitations

- Single active document at a time (uploading a new PDF replaces the previous one)
- No conversation memory between questions yet
- CPU-only inference is slow (20-40s per answer)

## Possible extensions

- Multi-document support with per-source filtering
- Conversation memory for follow-up questions
- Re-ranking retrieved chunks before generation