const { Router } = require('express')
const ctrl = require('../controllers/landController')
const router = Router()

// GET /api/acquisition?district=&village=&purpose=
router.get('/', ctrl.getAcquisitionCases)

// GET /api/acquisition/:acquisitionId
router.get('/:acquisitionId', ctrl.getAcquisitionCaseById)

// GET /api/acquisition/:acquisitionId/evidence
router.get('/:acquisitionId/evidence', ctrl.getAcquisitionEvidence)

// GET /api/acquisition/:acquisitionId/parcels
router.get('/:acquisitionId/parcels', ctrl.getAcquisitionParcels)

module.exports = router
