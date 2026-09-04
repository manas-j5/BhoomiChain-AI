const express = require('express');
const router = express.Router();
const {
  getAllCases,
  getStats,
  searchCases,
  getCaseById,
  createCase,
} = require('../controllers/caseController');

// NOTE: /search and /stats MUST be before /:id or Express matches them as IDs
router.get('/stats', getStats);
router.get('/search', searchCases);
router.get('/', getAllCases);
router.get('/:id', getCaseById);
router.post('/', createCase);

module.exports = router;
