import axios from 'axios'

// In production (Vercel), VITE_API_URL points to the Render backend.
// In local dev, the Vite proxy forwards /api → localhost:5000.
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token here when ready
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('[API Error]', error?.response?.data || error.message)
    return Promise.reject(error?.response?.data || { message: error.message })
  }
)

// ── Cases API ───────────────────────────────────────────────────────────────
export const casesApi = {
  getAll: (params = {}) => api.get('/cases', { params }),
  getById: (id) => api.get(`/cases/${id}`),
  search: (q, params = {}) => api.get('/cases/search', { params: { q, ...params } }),
  getStats: () => api.get('/cases/stats'),
  create: (data) => api.post('/cases', data),
}

// ── Health API ──────────────────────────────────────────────────────────────
export const healthApi = {
  check: () => api.get('/health'),
}

// ── AI API ──────────────────────────────────────────────────────────────────
export const aiApi = {
  chat: (data) => api.post('/ai/chat', data, { timeout: 60000 }),
}

export default api
