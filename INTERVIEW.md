# Interview notes

Talking points and likely questions for discussing this project.

## One-line summary

"A local, cost-free RAG chatbot that lets you upload any PDF and ask questions grounded in its actual content, using ChromaDB for retrieval and Ollama for generation."

## Likely questions and answers

**Q: Why RAG instead of just asking the LLM directly?**
A: Directly asking an LLM risks hallucination — it might answer confidently but incorrectly. RAG grounds every answer in retrieved, real content from the document, and can cite which part it came from.

**Q: Why ChromaDB over a traditional database?**
A: Questions are matched by *meaning*, not exact keywords. ChromaDB stores vector embeddings and supports similarity search, which a traditional SQL/NoSQL database doesn't do natively.

**Q: Why chunk the document instead of sending the whole thing?**
A: LLM context windows are limited, and sending irrelevant content dilutes answer quality. Chunking lets retrieval find just the relevant section(s) instead.

**Q: What are the trade-offs of running the LLM locally via Ollama?**
A: No API cost and full data privacy, but slower inference (CPU-bound) and lower quality compared to large hosted models like GPT-4 or Claude.

**Q: What would you improve given more time?**
A: Add conversation memory for follow-up questions, support multiple documents simultaneously, and add a re-ranking step to improve retrieval precision before generation.

**Q: What was the hardest part to build?**
A: Environment and integration issues — CORS between frontend and backend, GPU/CUDA crashes in Ollama on Windows, and making sure `.gitignore` actually excluded generated files from version control.