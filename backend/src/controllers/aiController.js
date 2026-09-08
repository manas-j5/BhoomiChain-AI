const aiService = require('../services/aiService')

const chatHandler = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' })
    }
    const result = await aiService.chat(message.trim(), history)
    res.json({ success: true, ...result })
  } catch (err) {
    next(err)
  }
}

module.exports = { chatHandler }
