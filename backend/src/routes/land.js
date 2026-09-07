const { Router } = require('express')
const ctrl = require('../controllers/landController')
const router = Router()

// GET /api/land/master
router.get('/master', ctrl.getLandMaster)

// GET /api/land/evidence-all
router.get('/evidence-all', ctrl.getAllLandEvidence)

// GET /api/land/geospatial-all
router.get('/geospatial-all', ctrl.getAllGeospatial)

// GET /api/land/:landId/geospatial
router.get('/:landId/geospatial', ctrl.getGeospatial)

// GET /api/land/:landId/history
router.get('/:landId/history', ctrl.getHistory)

// GET /api/land/:landId/evidence
router.get('/:landId/evidence', ctrl.getLandEvidence)

// GET /api/land/:landId/characteristics
router.get('/:landId/characteristics', ctrl.getCharacteristics)

// GET /api/land/:landId/observations
router.get('/:landId/observations', ctrl.getObservations)

module.exports = router
