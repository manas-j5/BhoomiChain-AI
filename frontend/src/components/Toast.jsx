import { useState, useEffect, useCallback } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

// ── Toast Store (simple pub/sub, no external lib needed) ───────────────────
let _listeners = []
let _toasts = []
let _id = 0

export const toast = {
  _emit() {
    _listeners.forEach(fn => fn([..._toasts]))
  },
  show(message, type = 'error', duration = 5000) {
    const id = ++_id
    _toasts = [..._toasts, { id, message, type, duration }]
    this._emit()
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration)
    }
    return id
  },
  dismiss(id) {
    _toasts = _toasts.filter(t => t.id !== id)
    this._emit()
  },
  error(msg, duration) { return this.show(msg, 'error', duration) },
  success(msg, duration) { return this.show(msg, 'success', duration) },
  info(msg, duration) { return this.show(msg, 'info', duration) },
  warn(msg, duration) { return this.show(msg, 'warning', duration) },
}

const ICONS = {
  error: <AlertCircle size={16} className="shrink-0 mt-0.5" />,
  success: <CheckCircle size={16} className="shrink-0 mt-0.5" />,
  info: <Info size={16} className="shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={16} className="shrink-0 mt-0.5" />,
}

const STYLES = {
  error:   'bg-red-900/80 border-red-500/40 text-red-100',
  success: 'bg-emerald-900/80 border-emerald-500/40 text-emerald-100',
  info:    'bg-sky-900/80 border-sky-500/40 text-sky-100',
  warning: 'bg-amber-900/80 border-amber-500/40 text-amber-100',
}

function ToastItem({ toast: t, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Fade in
    const show = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(show)
  }, [])

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl
        transition-all duration-300 max-w-sm w-full
        ${STYLES[t.type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {ICONS[t.type]}
      <p className="text-sm flex-1 leading-relaxed">{t.message}</p>
      <button
        onClick={() => onDismiss(t.id)}
        className="opacity-60 hover:opacity-100 transition-opacity ml-1"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const subscribe = useCallback((fn) => {
    _listeners.push(fn)
    return () => { _listeners = _listeners.filter(l => l !== fn) }
  }, [])

  useEffect(() => subscribe(setToasts), [subscribe])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={(id) => toast.dismiss(id)} />
        </div>
      ))}
    </div>
  )
}
