const { Router } = require('express')
const ctrl = require('../controllers/casesController')
const landCtrl = require('../controllers/landController')
const db = require('../config/db')

const router = Router()

// GET /api/cases/stats
router.get('/stats', ctrl.getStats)

// GET /api/cases/search?q=...
router.get('/search', ctrl.search)

// GET /api/cases/evidence-all — all case_evidence records
router.get('/evidence-all', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM case_evidence ORDER BY retrieval_date DESC')
    res.json({ success: true, data: result.rows })
  } catch (err) { next(err) }
})

// GET /api/cases
router.get('/', ctrl.getAll)

// GET /api/cases/:id
router.get('/:id', ctrl.getById)

// GET /api/cases/:caseId/evidence
router.get('/:caseId/evidence', landCtrl.getCaseEvidence)

module.exports = router
