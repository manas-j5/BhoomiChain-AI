import { useState, useEffect, useCallback } from 'react'
import { casesApi } from '../services/api'

/**
 * useCases — fetches paginated case list with filter support
 */
export const useCases = (initialParams = {}) => {
  const [cases, setCases] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [params, setParams] = useState({ page: 1, limit: 10, ...initialParams })

  const fetchCases = useCallback(async (newParams) => {
    setLoading(true)
    setError(null)
    try {
      const res = await casesApi.getAll(newParams || params)
      setCases(res.data || [])
      setPagination(res.pagination || null)
    } catch (err) {
      setError(err.message || 'Failed to load cases')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchCases()
  }, [fetchCases])

  const updateParams = (newParams) => {
    const updated = { ...params, ...newParams }
    setParams(updated)
    fetchCases(updated)
  }

  return { cases, pagination, loading, error, updateParams, refetch: fetchCases }
}

/**
 * useCaseById — fetches a single case by ID
 */
export const useCaseById = (id) => {
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchCase = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await casesApi.getById(id)
        setCaseData(res.data)
      } catch (err) {
        setError(err.message || 'Case not found')
      } finally {
        setLoading(false)
      }
    }
    fetchCase()
  }, [id])

  return { caseData, loading, error }
}

/**
 * useCaseStats — fetches dashboard statistics
 */
export const useCaseStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const res = await casesApi.getStats()
        setStats(res.data)
      } catch (err) {
        setError(err.message || 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return { stats, loading, error }
}

/**
 * useSearch — full-text case search
 */
export const useSearch = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const search = useCallback(async (q) => {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    setError(null)
    try {
      const res = await casesApi.search(q)
      setResults(res.data || [])
    } catch (err) {
      setError(err.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, query, search }
}
