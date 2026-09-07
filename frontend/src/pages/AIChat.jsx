import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, RefreshCw, Copy, Check, ExternalLink, Shield, AlertCircle } from 'lucide-react'
import api from '../services/api'

const SAMPLE_QUESTIONS = [
  'What is the status of the Sarafat Ali case?',
  'Tell me about the Assam Arunachal border dispute',
  'What land was involved in the Supreme Court case 8705?',
  'What evidence exists for the Gyanvapi case?',
]

const SourceBadge = ({ source }) => (
  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-dark-800/60 border border-white/5 text-xs">
    <Shield size={11} className={`shrink-0 mt-0.5 ${
      source.status === 'VERIFIED_PRIMARY' ? 'text-green-400' :
      source.status === 'VERIFIED_GOVERNMENT' ? 'text-blue-400' :
      source.status === 'SECONDARY_CROSS_CHECKED' ? 'text-yellow-400' :
      'text-dark-500'
    }`} />
    <div className="flex-1 min-w-0">
      <p className="text-dark-300 font-medium line-clamp-1">{source.name}</p>
      <p className="text-dark-600 mt-0.5">{source.field}: <span className="text-dark-400">{source.value?.slice(0, 60)}{source.value?.length > 60 ? '…' : ''}</span></p>
      <div className="flex items-center gap-2 mt-1">
        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
          source.status === 'VERIFIED_PRIMARY' ? 'bg-green-900/30 text-green-400' :
          source.status === 'VERIFIED_GOVERNMENT' ? 'bg-blue-900/30 text-blue-400' :
          'bg-dark-700 text-dark-500'
        }`}>{source.status?.replace(/_/g, ' ')}</span>
        {source.url && (
          <a href={source.url} target="_blank" rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 flex items-center gap-0.5">
            Source <ExternalLink size={9} />
          </a>
        )}
      </div>
    </div>
  </div>
)

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
        {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          msg.role === 'user'
            ? 'bg-brand-600/30 border border-brand-500/30 text-white rounded-tr-sm'
            : 'glass border border-white/10 text-dark-200 rounded-tl-sm'
        }`}>
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

        {/* Evidence sources */}
        {msg.sources && msg.sources.length > 0 && (
          <div className="w-full mt-1 space-y-1.5">
            <p className="text-[10px] text-dark-600 flex items-center gap-1">
              <Shield size={10} /> {msg.sources.length} evidence source{msg.sources.length > 1 ? 's' : ''} used
            </p>
            {msg.sources.slice(0, 3).map((s, i) => <SourceBadge key={i} source={s} />)}
            {msg.sources.length > 3 && (
              <p className="text-[10px] text-dark-600">+{msg.sources.length - 3} more sources</p>
            )}
          </div>
        )}

        {/* No evidence warning */}
        {msg.role === 'assistant' && msg.evidenceCount === 0 && (
          <div className="flex items-center gap-1.5 text-[10px] text-yellow-500/70 mt-1">
            <AlertCircle size={10} />
            <span>No evidence found in database for this query</span>
          </div>
        )}

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

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: `I'm BhoomiChain AI — an evidence-backed land governance intelligence assistant.

I can answer questions about:

• **Specific cases** — Sarafat Ali, Assam-Arunachal border dispute, Gyanvapi case
• **Land records** — khata records, khasra numbers, ownership history
• **Evidence** — court documents, land records, satellite data
• **Land acquisition** — compensation, award details, parcel records

Every answer I give is grounded in our verified evidence database with full source citations.`,
  time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  sources: [],
  evidenceCount: 0,
}

const AIChat = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    const userMsg = { role: 'user', content: text, time }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      // Build history (exclude initial welcome message)
      const history = updatedMessages.slice(1).map(m => ({ role: m.role, content: m.content }))
      const res = await api.post('/ai/chat', { message: text, history })
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.answer,
        sources: res.sources || [],
        evidenceCount: res.evidenceCount || 0,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message || 'Unknown error'}. Please check that the backend is running and GEMINI_API_KEY is set in .env`,
        sources: [],
        evidenceCount: 0,
        time,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
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
          <p className="page-subtitle">Evidence-based land dispute analysis — powered by Gemini + RAG</p>
        </div>
        <button
          id="clear-chat-btn"
          onClick={() => setMessages([{ ...INITIAL_MESSAGE, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }])}
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
            placeholder="Ask about a case, land record, or evidence…"
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
