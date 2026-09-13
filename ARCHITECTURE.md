# Architecture

## Overview

This project follows a standard Retrieval-Augmented Generation (RAG) pipeline, split into an ingestion path and a query path.

## Ingestion path (when a PDF is uploaded)

PDF upload
→ text extraction (pypdf)
→ chunking (~400 words, 50-word overlap)
→ embedding (sentence-transformers: all-MiniLM-L6-v2)
→ stored in ChromaDB, tagged with the source filename

## Query path (when a question is asked)
User question
→ embedded with the same model
→ ChromaDB similarity search (top-k chunks)
→ chunks + question assembled into a grounding prompt
→ sent to Llama 3 via Ollama
→ answer returned, along with the source filename(s)

## Why these choices

- **ChromaDB**: lightweight, file-based, no separate server to run — ideal for a local, single-user tool.
- **sentence-transformers (MiniLM)**: small, fast, runs on CPU with no API cost, good enough quality for short documents like resumes.
- **Ollama + Llama 3**: avoids API keys and per-request cost entirely, at the expense of slower CPU-bound inference.
- **Chunk size (400 words, 50 overlap)**: balances context completeness against retrieval precision — small enough that irrelevant sections don't dilute a match, with enough overlap to avoid losing meaning at chunk boundaries.

## Known limitations

- Single active document at a time (uploading a new PDF replaces the previous one)
- No conversation memory between questions yet
- CPU-only inference is slow (20-40s per answer)

## Possible extensions

- Multi-document support with per-source filtering
- Conversation memory for follow-up questions
- Re-ranking retrieved chunks before generation