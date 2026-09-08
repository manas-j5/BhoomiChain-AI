const repo = require('../repositories/casesRepository')
const db = require('../config/db')

// GET /api/land/master?district=&village=&khasraNo=
const getLandMaster = async (req, res, next) => {
  try {
    const { district, village, khasraNo } = req.query
    const data = await repo.findLandMaster({ district, village, khasraNo })
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/land/:landId/geospatial
const getGeospatial = async (req, res, next) => {
  try {
    const data = await repo.findGeospatialByLandId(req.params.landId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/land/:landId/history
const getHistory = async (req, res, next) => {
  try {
    const data = await repo.findHistoryByLandId(req.params.landId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/land/:landId/evidence
const getLandEvidence = async (req, res, next) => {
  try {
    const data = await repo.findLandEvidence(req.params.landId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/khata?district=&village=&khataNo=
const getKhataRecords = async (req, res, next) => {
  try {
    const { district, village, khataNo } = req.query
    const data = await repo.findKhataRecords({ district, village, khataNo })
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/khata/:khataRecordId/owners
const getKhataOwners = async (req, res, next) => {
  try {
    const data = await repo.findOwnersByKhataRecordId(req.params.khataRecordId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/cases/:caseId/evidence
const getCaseEvidence = async (req, res, next) => {
  try {
    const data = await repo.findEvidenceByCaseId(req.params.caseId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/acquisition?district=&village=&purpose=
const getAcquisitionCases = async (req, res, next) => {
  try {
    const { district, village, purpose } = req.query
    const data = await repo.findAcquisitionCases({ district, village, purpose })
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/acquisition/:acquisitionId
const getAcquisitionCaseById = async (req, res, next) => {
  try {
    const data = await repo.findAcquisitionCaseById(req.params.acquisitionId)
    if (!data) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/acquisition/:acquisitionId/evidence
const getAcquisitionEvidence = async (req, res, next) => {
  try {
    const data = await repo.findAcquisitionEvidence(req.params.acquisitionId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/acquisition/:acquisitionId/parcels
const getAcquisitionParcels = async (req, res, next) => {
  try {
    const data = await repo.findAcquisitionParcels(req.params.acquisitionId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/land/:landId/characteristics
const getCharacteristics = async (req, res, next) => {
  try {
    const data = await repo.findCharacteristicsByLandId(req.params.landId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/land/:landId/observations
const getObservations = async (req, res, next) => {
  try {
    const data = await repo.findObservationsByLandId(req.params.landId)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// GET /api/land/evidence-all — all land_evidence records
const getAllLandEvidence = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM land_evidence ORDER BY retrieval_date DESC')
    res.json({ success: true, data: result.rows })
  } catch (err) { next(err) }
}

// GET /api/land/geospatial-all — all geospatial points for the map
const getAllGeospatial = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM land_geospatial WHERE latitude IS NOT NULL AND longitude IS NOT NULL')
    res.json({ success: true, data: result.rows })
  } catch (err) { next(err) }
}

module.exports = {
  getLandMaster, getGeospatial, getHistory, getLandEvidence,
  getKhataRecords, getKhataOwners, getCaseEvidence,
  getAcquisitionCases, getAcquisitionCaseById, getAcquisitionEvidence, getAcquisitionParcels,
  getCharacteristics, getObservations,
  getAllLandEvidence, getAllGeospatial,
}
