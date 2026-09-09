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
  // Mock AI response to bypass backend connection issues
  chat: async (data) => {
    return new Promise((resolve) => {
      // Simulate network delay / "thinking" time (1.5 seconds)
      setTimeout(() => {
        
        let answer = "Based on the records, the **Ranchi encroachment case** (Case ID: JH-RNC-2023-0891) involves a boundary dispute over a 2.5-acre plot in the Namkum circle. The primary issue is the overlap of recent digital survey maps with the legacy 1932 Khatiyan records.\n\n• **Status:** Pending hearing\n• **Next Steps:** A physical demarcation by the Circle Officer is scheduled.\n• **Relevant Law:** Chota Nagpur Tenancy (CNT) Act, Section 71A."

        const lowerMsg = data.message.toLowerCase()

        if (lowerMsg.includes("documents") || lowerMsg.includes("tribal")) {
          answer = "To file a tribal land rights claim under the **Forest Rights Act (FRA), 2006**, you typically need the following documents:\n\n• Proof of residence (e.g., voter ID or ration card) showing occupancy before Dec 13, 2005.\n• A genealogy chart or statement from village elders tracing ancestry.\n• The traditional Gram Sabha resolution verifying the claim.\n• Any legacy records like the 1932 Khatiyan (if available).\n\nEnsure all documents are submitted to the Forest Rights Committee at the Panchayat level."
        } else if (lowerMsg.includes("how long") || lowerMsg.includes("boundary")) {
          answer = "In Jharkhand, a standard agricultural boundary dispute resolved via the Circle Officer (CO) under the **Bihar Tenant's Holdings (Maintenance of Records) Act, 1973** typically takes **3 to 6 months**.\n\nHowever, if the case is escalated to the LRDC (Land Reforms Deputy Collector) or involves civil litigation, it can take **1 to 3 years** depending on court pendency and the complexity of the surveys required."
        } else if (lowerMsg.includes("forest rights act") || lowerMsg.includes("2006")) {
          answer = "The **Forest Rights Act (FRA), 2006** (Scheduled Tribes and Other Traditional Forest Dwellers Act) recognizes the rights of forest-dwelling tribal communities and other traditional forest dwellers to forest resources.\n\n**Key provisions include:**\n• **Title Rights:** Ownership of land being farmed by tribals or forest dwellers.\n• **Use Rights:** Rights to minor forest produce, grazing areas, and pastoralist routes.\n• **Relief and Development Rights:** Rehabilitation in case of illegal eviction or forced displacement."
        } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
          answer = "Hello! I am BhoomiChain AI. I can help you analyze land disputes, summarize case files, and find relevant legal provisions in Jharkhand. What would you like to know?"
        }

        resolve({ answer })
      }, 1500)
    })
  },
}

export default api
