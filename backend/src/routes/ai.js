const { Router } = require('express')
const { chatHandler } = require('../controllers/aiController')

const router = Router()

// POST /api/ai/chat
router.post('/chat', chatHandler)

module.exports = router
