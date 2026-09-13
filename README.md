<div align="center">

# 🤖 Ask My Docs

**Chat with your documents like they're sitting across the table.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=20232A)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white&labelColor=1a1a1a)
![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorStore-FF6F00?labelColor=1a1a1a)
![Ollama](https://img.shields.io/badge/Ollama-Llama%203-000000?labelColor=1a1a1a)

📄 Upload documents. ❓ Ask questions. 💡 Get instant, context-aware answers — all running **locally** on your machine.

</div>

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🔍 | **RAG-based QA** | Retrieves contextually relevant answers using Retrieval-Augmented Generation |
| 🧠 | **Local LLM integration** | Uses Ollama (Llama 3) for private, on-device inference — no API key, no cost |
| 📌 | **Vector search** | ChromaDB embeddings-based similarity search over document chunks |
| 💬 | **Interactive chat UI** | Clean React conversational interface with example question chips |
| 📎 | **Source-aware answers** | Every answer notes which uploaded document it came from |
| 🔒 | **Fully private** | Documents and answers never leave your machine |

---

## 🖼️ Screenshots

### 🏠 Home
![Home page](./docs/images/home-page.png)

### ⚙️ How it works
![How it works](./docs/images/how-it-works.png)

### 💬 Chat demo
![Chat demo](./docs/images/chat-demo.png)

### ℹ️ About
![About page](./docs/images/about-page.png)

---

## 🛠️ Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com) installed and running

### 1. Clone the repository

```bash
git clone https://github.com/MithraDeviMuthu/ask-my-docs.git
cd ask-my-docs
```

### 2. Set up the backend

```bash
cd askmydocs
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install fastapi uvicorn pypdf chromadb sentence-transformers ollama python-multipart
```

### 3. Pull the local model

```bash
ollama pull llama3
```

### 4. Start the backend

```bash
python -m uvicorn main:app --reload
```

Runs at `http://localhost:8000`

### 5. Set up the frontend (new terminal)

```bash
cd frontend
npm install
npm start
```

Runs at `http://localhost:3000`

### 6. Use it

Open the frontend in your browser, upload a PDF, and start asking questions. 🎉

📖 Full setup details, troubleshooting, and environment notes are in [RUN.md](./RUN.md).

---

## 🧩 How it works

1. 📤 A PDF is uploaded and its text is extracted
2. ✂️ The text is split into overlapping chunks
3. 🔢 Each chunk is converted into a vector embedding
4. 🗄️ Embeddings are stored in a local ChromaDB vector database
5. ❓ When a question is asked, it's embedded and matched against the most relevant chunks
6. 🤖 The matched chunks + question are sent to Llama 3 (via Ollama), which generates a grounded answer

📖 See [ARCHITECTURE.md](./ARCHITECTURE.md) for diagrams and a deeper breakdown.

---

## 📂 Project Structure

```
ask-my-docs/
├── 📁 askmydocs/              # FastAPI backend
│   ├── 📄 main.py             # API routes (/upload, /ask) + CORS + startup
│   ├── 📄 ingest.py           # Standalone PDF ingestion script
│   └── 📁 chroma_store/       # Local vector database (generated, gitignored)
│
├── 📁 frontend/                # React frontend
│   ├── 📁 src/
│   │   ├── 📄 App.js          # Main app logic, chat + upload flow
│   │   └── 📄 App.css         # Styling
│   └── 📄 package.json        # Node dependencies
│
├── 📁 docs/
│   └── 📁 images/              # README screenshots
│
├── 📄 README.md                # You are here
├── 📄 RUN.md                   # Setup and run instructions
├── 📄 ARCHITECTURE.md          # System design, diagrams, decisions
├── 📄 INTERVIEW.md             # Talking points for discussing this project
└── 📄 .gitignore
```

---

