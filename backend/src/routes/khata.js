const { Router } = require('express')
const ctrl = require('../controllers/landController')
const router = Router()

// GET /api/khata?district=&village=&khataNo=
router.get('/', ctrl.getKhataRecords)

// GET /api/khata/:khataRecordId/owners
router.get('/:khataRecordId/owners', ctrl.getKhataOwners)

module.exports = router
