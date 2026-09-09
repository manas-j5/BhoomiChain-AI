import axios from 'axios'
import { toast } from '../components/Toast'

// All /api/* requests are proxied to the backend:
// - Local dev: Vite proxy (vite.config.js) → http://localhost:5000
// - Production (Vercel): vercel.json rewrites → https://bhoomi-track.onrender.com
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30s default; AI chat overrides to 90s
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// ── Response interceptor — with 503 retry for Render cold starts ─────────────
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error?.response?.status
    const config = error.config

    // 503 = Render free tier cold start — wait and retry once automatically
    if (status === 503 && !config._wakeRetried) {
      config._wakeRetried = true
      const toastId = toast.warn(
        '⏳ The backend is waking up (Render cold start). Retrying in 8 seconds…',
        0 // persist until dismissed
      )
      await new Promise((r) => setTimeout(r, 8000))
      toast.dismiss(toastId)
      return api(config)
    }

    // 404 on /api/* in production = vercel.json rewrite not proxying correctly
    if (status === 404 && config.url?.startsWith('/')) {
      console.error('[API 404] Route not found — check vercel.json rewrites:', config.url)
    }

    console.error('[API Error]', error?.response?.data || error.message)
    return Promise.reject(error?.response?.data || { message: error.message })
  }
)

// ── Cases API ────────────────────────────────────────────────────────────────
export const casesApi = {
  getAll: (params = {}) => api.get('/cases', { params }),
  getById: (id) => api.get(`/cases/${id}`),
  search: (q, params = {}) => api.get('/cases/search', { params: { q, ...params } }),
  getStats: () => api.get('/cases/stats'),
  create: (data) => api.post('/cases', data),
}

// ── Health API ───────────────────────────────────────────────────────────────
export const healthApi = {
  check: () => api.get('/health'),
}

// ── AI API ───────────────────────────────────────────────────────────────────
export const aiApi = {
  // 90s timeout — Gemini + DB retrieval can be slow under load
  chat: (data) => api.post('/ai/chat', data, { timeout: 90000 }),
}

export default api
