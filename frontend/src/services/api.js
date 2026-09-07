import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  timeout: 20000,
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

// ── Cases API (maps to cases_raw + case_evidence) ────────────────────────────
export const casesApi = {
  getAll: (params = {}) => api.get('/cases', { params }),
  getById: (id) => api.get(`/cases/${id}`),
  search: (q, params = {}) => api.get('/cases/search', { params: { q, ...params } }),
  getStats: () => api.get('/cases/stats'),
  getEvidence: (caseId) => api.get(`/cases/${caseId}/evidence`),
}

// ── Land API (land_master, land_geospatial, land_history, land_evidence, land_characteristics, land_observations)
export const landApi = {
  getMaster: (params = {}) => api.get('/land/master', { params }),
  getGeospatial: (landId) => api.get(`/land/${landId}/geospatial`),
  getHistory: (landId) => api.get(`/land/${landId}/history`),
  getEvidence: (landId) => api.get(`/land/${landId}/evidence`),
  getCharacteristics: (landId) => api.get(`/land/${landId}/characteristics`),
  getObservations: (landId) => api.get(`/land/${landId}/observations`),
}

// ── Khata API (khata_records + khata_owners) ──────────────────────────────────
export const khataApi = {
  getRecords: (params = {}) => api.get('/khata', { params }),
  getOwners: (khataRecordId) => api.get(`/khata/${khataRecordId}/owners`),
}

// ── Acquisition API (land_acquisition_cases, evidence, parcels) ───────────────
export const acquisitionApi = {
  getAll: (params = {}) => api.get('/acquisition', { params }),
  getById: (acquisitionId) => api.get(`/acquisition/${acquisitionId}`),
  getEvidence: (acquisitionId) => api.get(`/acquisition/${acquisitionId}/evidence`),
  getParcels: (acquisitionId) => api.get(`/acquisition/${acquisitionId}/parcels`),
}

// ── Health API ────────────────────────────────────────────────────────────────
export const healthApi = {
  check: () => api.get('/health'),
}

export default api
