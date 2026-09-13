import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const API_BASE = "http://localhost:8000";

const PAGE_ORDER = ["home", "how", "about", "chat"];

const TABS = [
  { id: "chat", label: "Chat" },
  { id: "upload", label: "Upload" },
  { id: "examples", label: "Examples" },
];

const TOPICS = [
  "Key facts",
  "Summary",
  "Numbers & data",
  "People & names",
  "Dates & timeline",
  "Anything else",
];

const EXAMPLE_QUESTIONS = [
  "Summarize this document",
  "What are the key points?",
  "Are there any numbers or statistics mentioned?",
  "List any names or people mentioned",
  "What dates are important here?",
  "What is this document about overall?",
];

/* ---------------- Robot mascot & icons ---------------- */

function RobotFace({ size = 48, floating = false, blink = false }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={floating ? "robot-float" : ""}
      role="img"
      aria-label="AskMyDocs"
    >
      <defs>
        <linearGradient id="botGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <line x1="100" y1="18" x2="100" y2="40" stroke="url(#botGrad)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="14" r="8" fill="url(#botGrad)" />
      <rect x="24" y="72" width="12" height="34" rx="6" fill="url(#botGrad)" opacity="0.55" />
      <rect x="164" y="72" width="12" height="34" rx="6" fill="url(#botGrad)" opacity="0.55" />
      <rect x="38" y="40" width="124" height="106" rx="30" fill="rgba(255,255,255,0.06)" stroke="url(#botGrad)" strokeWidth="3" />
      <circle cx="80" cy={blink ? 95 : 92} r={blink ? 2 : 13} fill="url(#botGrad)" />
      <circle cx="120" cy={blink ? 95 : 92} r={blink ? 2 : 13} fill="url(#botGrad)" />
      <rect x="78" y="116" width="44" height="7" rx="3.5" fill="url(#botGrad)" opacity="0.7" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 16V4M12 4l-5 5M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 5h16v11H8l-4 4V5z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" strokeLinejoin="round" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12l16-7-6.5 16-2.5-7-7-2z" strokeLinejoin="round" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------- Pages ---------------- */

function HomePage({ goTo }) {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow-pill">
            <IconSpark /> AI-powered document assistant
          </span>
          <h2>Chat with your documents like they're sitting across the table.</h2>
          <p>
            Upload one or more PDFs and ask anything — AskMyDocs reads them and
            answers in plain language, instantly, citing which file it came from.
          </p>
          <div className="hero-actions">
            <button className="cta" onClick={() => goTo("chat")}>
              Open the chat
            </button>
            <button className="cta ghost" onClick={() => goTo("how")}>
              See how it works
            </button>
          </div>
        </div>
        <div className="hero-art">
          <div className="glow-blob glow-a" />
          <div className="glow-blob glow-b" />
          <div className="orbit-ring" />
          <RobotFace size={220} floating />
        </div>
      </section>

      <section className="feature-grid">
        {TOPICS.slice(0, 3).map((t, i) => (
          <div className="feature-card" key={t}>
            <div className="feature-badge">{["🧠", "🎓", "🛠"][i]}</div>
            <h3>{t}</h3>
            <p>Answered straight from your uploaded documents, in plain language.</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function HowItWorksPage({ goTo }) {
  const steps = [
    { title: "Upload your PDFs", body: "Drop in one or more files from the Chat page — they're indexed for search.", icon: "📄" },
    { title: "Ask a question", body: "Type it yourself or tap one of the example questions to get started.", icon: "💬" },
    { title: "Get a plain-language answer", body: "Pulled straight from the documents, with sources cited.", icon: "✅" },
  ];
  return (
    <div className="page">
      <h2>How it works</h2>
      <p className="lede">Three steps, no setup.</p>
      <div className="timeline">
        {steps.map((s, i) => (
          <React.Fragment key={s.title}>
            <div className="timeline-node">
              <div className="node-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
            {i < steps.length - 1 && <div className="timeline-connector" />}
          </React.Fragment>
        ))}
      </div>
      <button className="cta" onClick={() => goTo("chat")}>
        Try it now
      </button>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="page about-page">
      <div className="about-art">
        <div className="glow-blob glow-a small" />
        <RobotFace size={180} floating />
      </div>
      <div className="glass-card about-copy">
        <h2>About AskMyDocs</h2>
        <p>
          AskMyDocs reads uploaded PDFs and answers questions about them in plain
          language, so a reader can get to the relevant part of a document without
          scanning the whole thing.
        </p>
        <p>Uploaded documents are indexed on the server until you clear them.</p>
      </div>
    </div>
  );
}

function ChatPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hi. Upload one or more PDFs and I'll be ready to answer questions about them." },
  ]);
  const threadEndRef = useRef(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch(`${API_BASE}/documents`)
      .then((r) => r.json())
      .then((data) => setUploadedFiles(data.documents || []))
      .catch(() => {});
  }, []);

  function addBotMessage(text) {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), from: "bot", text }]);
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isReading) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "user", text: trimmed }]);
    setInput("");

    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      const sourceNote = data.sources?.length ? `\n\nfrom: ${data.sources.join(", ")}` : "";
      addBotMessage(data.answer + sourceNote);
    } catch (err) {
      addBotMessage(`Couldn't reach the server — check it's still running. (${err.message})`);
    }
  }

  async function handleFile(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setActiveTab("chat");
    setIsReading(true);

    for (const file of files) {
      addBotMessage(`Reading "${file.name}"…`);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Upload failed");
        setUploadedFiles((prev) => (prev.includes(file.name) ? prev : [...prev, file.name]));
        addBotMessage(`Done — indexed "${file.name}" (${data.chunks} chunks). Ask me anything.`);
      } catch (err) {
        addBotMessage(`Couldn't process "${file.name}": ${err.message}`);
      }
    }
    setIsReading(false);
    e.target.value = "";
  }

  async function clearDocuments() {
    try {
      await fetch(`${API_BASE}/documents`, { method: "DELETE" });
      setUploadedFiles([]);
      addBotMessage("Cleared all uploaded documents.");
    } catch {
      addBotMessage("Couldn't clear documents — is the server running?");
    }
  }

  const tabIcons = { chat: <IconChat />, upload: <IconUpload />, examples: <IconSpark /> };

  return (
    <div className="chat-shell glass-card">
      <aside className="rail">
        {TABS.map((tab) => (
          <button key={tab.id} className={`rail-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            {tabIcons[tab.id]}
            <span>{tab.label}</span>
          </button>
        ))}
      </aside>

      <div className="chat-main">
        {activeTab === "chat" && (
          <>
            <header className="chat-header">
              <RobotFace size={40} />
              <div>
                <h3>AskMyDocs</h3>
                <span className="status">
                  <i className="dot" /> online
                </span>
              </div>
            </header>

            <div className="topics-strip">
              {TOPICS.map((t) => (
                <span className="topic-pill" key={t}>
                  {t}
                </span>
              ))}
            </div>

            <label className="dropzone">
              <IconUpload />
              <div>
                <strong>{uploadedFiles.length ? `${uploadedFiles.length} document(s) indexed` : "Upload PDFs"}</strong>
                <span>Drag & drop, or click to browse — multiple files allowed</span>
              </div>
              <input type="file" accept="application/pdf" multiple onChange={handleFile} hidden />
            </label>

            {uploadedFiles.length > 0 && (
              <div className="uploaded-list">
                {uploadedFiles.map((name) => (
                  <span className="topic-pill" key={name}>
                    {name}
                  </span>
                ))}
                <button className="chip" onClick={clearDocuments} title="Clear all documents">
                  <IconTrash /> Clear all
                </button>
              </div>
            )}

            <div className="chips">
              {EXAMPLE_QUESTIONS.slice(0, 4).map((q) => (
                <button key={q} className="chip" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>

            <section className="thread">
              {messages.map((m, i) => (
                <div key={m.id} className={`bubble-row ${m.from} ${i === messages.length - 1 ? "enter" : ""}`}>
                  {m.from === "bot" && <RobotFace size={28} />}
                  <div className={`bubble ${m.from}`}>{m.text}</div>
                </div>
              ))}
              <div ref={threadEndRef} />
            </section>

            <form
              className="composer"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isReading ? "Reading document(s)…" : "Ask about skills, education, projects…"}
                disabled={isReading}
              />
              <button type="submit" className="send-btn" aria-label="Send" disabled={isReading}>
                <IconSend />
              </button>
            </form>
          </>
        )}

        {activeTab === "upload" && (
          <section className="panel">
            <h2>Upload documents</h2>
            <p>Drop in one or more PDFs and the chat will answer questions across all of them.</p>
            <label className="dropzone large">
              <IconUpload />
              <div>
                <strong>{uploadedFiles.length ? `${uploadedFiles.length} document(s) indexed` : "Choose PDF files"}</strong>
                <span>Drag & drop, or click to browse — multiple files allowed</span>
              </div>
              <input type="file" accept="application/pdf" multiple onChange={handleFile} hidden />
            </label>
            {uploadedFiles.length > 0 && (
              <div className="uploaded-list">
                {uploadedFiles.map((name) => (
                  <span className="topic-pill" key={name}>
                    {name}
                  </span>
                ))}
                <button className="chip" onClick={clearDocuments}>
                  <IconTrash /> Clear all
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "examples" && (
          <section className="panel">
            <h2>Example questions</h2>
            <p>Tap any question to send it straight to the chat.</p>
            <ul className="example-list">
              {EXAMPLE_QUESTIONS.map((q) => (
                <li key={q}>
                  <button
                    onClick={() => {
                      setActiveTab("chat");
                      sendMessage(q);
                    }}
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------------- App shell ---------------- */

export default function App() {
  const [page, setPage] = useState("home");
  const [direction, setDirection] = useState("initial");
  const [menuOpen, setMenuOpen] = useState(false);

  function goTo(next) {
    if (next === page) return;
    const from = PAGE_ORDER.indexOf(page);
    const to = PAGE_ORDER.indexOf(next);
    setDirection(to > from ? "from-right" : "from-left");
    setPage(next);
    setMenuOpen(false);
  }

  const NAV_ITEMS = [
    { id: "home", label: "Home" },
    { id: "how", label: "How it works" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="app">
      <div className="bg-gradient" />
      <header className="topbar">
        <button className="brand" onClick={() => goTo("home")}>
          <RobotFace size={38} />
          <div>
            <h1>AskMyDocs</h1>
            <p className="tagline">Your documents, smarter conversations</p>
          </div>
        </button>

        <nav className="topnav">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} className={`navlink ${page === item.id ? "active" : ""}`} onClick={() => goTo(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="cta small" onClick={() => goTo("chat")}>
          Open chat
        </button>

        <button className="hamburger" aria-label="Toggle menu" onClick={() => setMenuOpen((v) => !v)}>
          <IconMenu />
        </button>
      </header>

      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}
      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {[...NAV_ITEMS, { id: "chat", label: "Chat" }].map((item) => (
          <button key={item.id} className={`navlink ${page === item.id ? "active" : ""}`} onClick={() => goTo(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="page-viewport">
        <div className={`page-slide ${direction}`} key={page}>
          {page === "home" && <HomePage goTo={goTo} />}
          {page === "how" && <HowItWorksPage goTo={goTo} />}
          {page === "about" && <AboutPage />}
          {page === "chat" && <ChatPage />}
        </div>
      </div>
    </div>
  );
}