import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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

export default api
