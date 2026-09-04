import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, RefreshCw, Copy, Check } from 'lucide-react'

const SAMPLE_QUESTIONS = [
  'Summarize the Ranchi encroachment case',
  'What documents are required for a tribal land rights claim?',
  'How long does a boundary dispute typically take in Jharkhand?',
  'What is the Forest Rights Act 2006?',
]

// Simulated AI responses (connects to Python AI Engine later)
const AI_RESPONSES = {
  default: `I'm BhoomiChain AI, your land governance intelligence assistant. I can help you with:

• **Case summaries** — AI-powered analysis of dispute evidence
• **Legal context** — relevant laws, acts, and precedents
• **Document analysis** — PDF extraction and citation
• **GIS insights** — spatial analysis of land parcels

*Note: Full AI capabilities will be available when the AI Engine (Python RAG pipeline on \`feature/ai\` branch) is connected.*`,
  ranchi: `**Case: Agricultural Land Encroachment — Ranchi District (CASE-2024-001)**

**Summary:** Plaintiff Ramesh Kumar Mahto claims ancestral ownership of 2.5 acres in Nagri village, Survey No. 45/A. Unauthorized construction by defendant Suresh Singh is alleged.

**Key Evidence:**
- Sale Deed (1952) — verified on blockchain ✓
- Revenue record — verified ✓
- Survey map — pending verification

**Legal Basis:** Plaintiff has strong documentary evidence with verified historical records dating to 1952.

**Status:** Active · Next hearing Aug 20, 2024 at Ranchi District Court.`,
}

const MessageBubble = ({ msg }) => {
  const [copied, setCopied] = useState(false)

  const copyText = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
        msg.role === 'user'
          ? 'bg-gradient-to-br from-brand-500 to-cyan-500'
          : 'bg-gradient-to-br from-violet-500 to-purple-700'
      }`}>
        {msg.role === 'user'
          ? <User size={14} className="text-white" />
          : <Bot size={14} className="text-white" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          msg.role === 'user'
            ? 'bg-brand-600/30 border border-brand-500/30 text-white rounded-tr-sm'
            : 'glass border border-white/10 text-dark-200 rounded-tl-sm'
        }`}>
          {/* Render markdown-like bold */}
          {msg.content.split('\n').map((line, i) => (
            <p key={i} className={line === '' ? 'h-2' : 'mb-0.5'}>
              {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                  : part
              )}
            </p>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-600">{msg.time}</span>
          {msg.role === 'assistant' && (
            <button onClick={copyText} className="text-dark-600 hover:text-dark-300 transition-colors">
              {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: AI_RESPONSES.default,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return
    const userMsg = {
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Simulate AI delay (replace with real API call to AI Engine)
    await new Promise(r => setTimeout(r, 1200))
    const responseText = text.toLowerCase().includes('ranchi')
      ? AI_RESPONSES.ranchi
      : `I've received your query: **"${text}"**\n\nFull AI-powered responses will be available once the Python RAG pipeline (on the \`feature/ai\` branch) is deployed and connected. The pipeline processes:\n\n• PDF extraction → chunking → embeddings\n• ChromaDB vector search\n• LLM response with citations`
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: responseText,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }])
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Sparkles size={22} className="text-brand-400" />
            AI Legal Assistant
          </h1>
          <p className="page-subtitle">Evidence-based land dispute analysis powered by RAG + LLM</p>
        </div>
        <button
          id="clear-chat-btn"
          onClick={() => setMessages([{
            role: 'assistant',
            content: AI_RESPONSES.default,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          }])}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <RefreshCw size={14} /> Clear Chat
        </button>
      </div>

      {/* Sample questions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SAMPLE_QUESTIONS.map(q => (
          <button
            key={q}
            id={`sample-q-${q.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => sendMessage(q)}
            className="text-xs glass glass-hover px-3 py-1.5 rounded-full text-dark-300 hover:text-white transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto card space-y-5 mb-4 scroll-smooth">
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0 mt-1">
              <Bot size={14} className="text-white" />
            </div>
            <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-2 h-2 rounded-full bg-dark-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-3">
        <div className="flex-1 glass rounded-2xl px-4 py-3 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
          <textarea
            id="chat-input"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a case, legal provision, or land record…"
            className="w-full bg-transparent outline-none text-sm text-dark-200 placeholder-dark-500 resize-none"
            style={{ maxHeight: '100px', overflowY: 'auto' }}
          />
        </div>
        <button
          id="send-message-btn"
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="p-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

export default AIChat
