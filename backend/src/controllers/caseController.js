const caseService = require('../services/caseService');

/**
 * GET /api/cases
 * Returns paginated list of cases with optional filters.
 */
const getAllCases = (req, res, next) => {
  try {
    const { page, limit, status, priority, district, category } = req.query;
    const result = caseService.getAllCases({ page, limit, status, priority, district, category });
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/cases/stats
 * Returns dashboard statistics.
 */
const getStats = (req, res, next) => {
  try {
    const stats = caseService.getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/cases/search?q=
 * Full-text search across case fields.
 */
const searchCases = (req, res, next) => {
  try {
    const { q } = req.query;
    const results = caseService.searchCases(q);
    res.status(200).json({
      success: true,
      query: q,
      count: results.length,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/cases/:id
 * Returns single case by ID.
 */
const getCaseById = (req, res, next) => {
  try {
    const caseItem = caseService.getCaseById(req.params.id);
    res.status(200).json({
      success: true,
      data: caseItem,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/cases
 * Create a new case.
 */
const createCase = (req, res, next) => {
  try {
    const newCase = caseService.createCase(req.body);
    res.status(201).json({
      success: true,
      message: 'Case created successfully',
      data: newCase,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCases, getStats, searchCases, getCaseById, createCase };
