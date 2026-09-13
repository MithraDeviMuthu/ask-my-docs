# Running this project locally

## Prerequisites

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com) installed and running

## 1. Clone the repo

```bash
git clone https://github.com/MithraDeviMuthu/ask-my-docs.git
cd ask-my-docs
```

## 2. Backend setup

```bash
cd askmydocs
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install fastapi uvicorn pypdf chromadb sentence-transformers ollama python-multipart
```

## 3. Pull the local model

```bash
ollama pull llama3
```

## 4. Start the backend

```bash
python -m uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`.

## 5. Frontend setup (in a new terminal)

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`.

## 6. Use it

Open the frontend in your browser, upload a PDF, and start asking questions.

## Troubleshooting

- **CORS errors**: make sure the backend's CORS middleware allows your frontend's origin.
- **Ollama crashes with a CUDA error**: force CPU mode by setting the environment variable `OLLAMA_LLM_LIBRARY=cpu` before starting Ollama.
- **Slow responses**: this is expected on CPU-only inference — expect 20-40 seconds per answer.