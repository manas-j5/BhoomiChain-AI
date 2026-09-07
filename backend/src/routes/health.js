const { Router } = require('express')
const config = require('../config')

const router = Router()

// GET /api/health
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      environment: config.NODE_ENV,
      timestamp: new Date().toISOString(),
      services: {
        api: true,
        database: false,        // Phase 2: PostgreSQL + PostGIS
        aiEngine: false,        // Phase 2: Python RAG pipeline
        gisEngine: false,       // Phase 2: PostGIS GIS service
        blockchain: false,      // Phase 4: Provenance layer
      },
    },
  })
})

module.exports = router
