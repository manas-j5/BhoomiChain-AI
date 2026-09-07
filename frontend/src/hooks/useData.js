import { useState, useEffect, useCallback } from 'react'
import { casesApi, landApi, khataApi, acquisitionApi } from '../services/api'

/**
 * useEvidence — fetches case_evidence for a given caseId
 */
export const useEvidence = (caseId) => {
  const [evidence, setEvidence] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!caseId) return
    setLoading(true)
    casesApi.getEvidence(caseId)
      .then(res => setEvidence(res.data || []))
      .catch(err => setError(err.message || 'Failed to load evidence'))
      .finally(() => setLoading(false))
  }, [caseId])

  return { evidence, loading, error }
}

/**
 * useLandData — fetches all land-related data for a landId
 */
export const useLandData = (landId) => {
  const [master, setMaster] = useState(null)
  const [characteristics, setCharacteristics] = useState(null)
  const [observations, setObservations] = useState([])
  const [history, setHistory] = useState([])
  const [geospatial, setGeospatial] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!landId) return
    setLoading(true)
    setError(null)
    Promise.allSettled([
      landApi.getMaster({ khasraNo: landId }),
      landApi.getCharacteristics(landId),
      landApi.getObservations(landId),
      landApi.getHistory(landId),
      landApi.getGeospatial(landId),
    ]).then(([masterRes, charRes, obsRes, histRes, geoRes]) => {
      if (masterRes.status === 'fulfilled') setMaster(masterRes.value?.data?.[0] || null)
      if (charRes.status === 'fulfilled') setCharacteristics(charRes.value?.data || null)
      if (obsRes.status === 'fulfilled') setObservations(obsRes.value?.data || [])
      if (histRes.status === 'fulfilled') setHistory(histRes.value?.data || [])
      if (geoRes.status === 'fulfilled') setGeospatial(geoRes.value?.data || [])
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [landId])

  return { master, characteristics, observations, history, geospatial, loading, error }
}

/**
 * useKhata — fetches khata records with optional filters
 */
export const useKhata = (filters = {}) => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRecords = useCallback(async (params = filters) => {
    setLoading(true)
    setError(null)
    try {
      const res = await khataApi.getRecords(params)
      setRecords(res.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load khata records')
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => { fetchRecords() }, []) // eslint-disable-line

  return { records, loading, error, refetch: fetchRecords }
}

/**
 * useKhataOwners — fetches owners for a specific khata record
 */
export const useKhataOwners = (khataRecordId) => {
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!khataRecordId) return
    setLoading(true)
    khataApi.getOwners(khataRecordId)
      .then(res => setOwners(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [khataRecordId])

  return { owners, loading, error }
}

/**
 * useAcquisition — fetches land acquisition cases
 */
export const useAcquisition = (filters = {}) => {
  const [acquisitions, setAcquisitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    acquisitionApi.getAll(filters)
      .then(res => setAcquisitions(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  return { acquisitions, loading, error }
}

/**
 * useGeospatialAll — fetches all geospatial records for the map
 */
export const useGeospatialAll = () => {
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    import('../services/api').then(({ default: api }) => {
      api.get('/land/geospatial-all')
        .then(res => setPoints(res.data || []))
        .catch(() => setPoints([]))
        .finally(() => setLoading(false))
    })
  }, [])

  return { points, loading, error }
}
