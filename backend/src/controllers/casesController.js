const casesService = require('../services/casesService')

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, district } = req.query
    const result = await casesService.getAllCases({ page, limit, status, priority, district })
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

const getById = async (req, res, next) => {
  try {
    const result = await casesService.getCaseById(req.params.id)
    if (!result) {
      const err = new Error(`Case not found: ${req.params.id}`)
      err.status = 404
      return next(err)
    }
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

const search = async (req, res, next) => {
  try {
    const { q = '' } = req.query
    const result = await casesService.searchCases(q)
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

const getStats = async (req, res, next) => {
  try {
    const result = await casesService.getStats()
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, search, getStats }
