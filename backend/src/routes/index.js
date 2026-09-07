const { Router } = require('express')
const casesRouter = require('./cases')
const healthRouter = require('./health')
const landRouter = require('./land')
const khataRouter = require('./khata')
const acquisitionRouter = require('./acquisition')
const aiRouter = require('./ai')

const router = Router()

router.use('/health', healthRouter)
router.use('/cases', casesRouter)
router.use('/land', landRouter)
router.use('/khata', khataRouter)
router.use('/acquisition', acquisitionRouter)
router.use('/ai', aiRouter)

module.exports = router
