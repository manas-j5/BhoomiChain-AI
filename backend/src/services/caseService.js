const { mockCases, getStatistics } = require('../repositories/caseRepository');

/**
 * getAllCases — paginated list with optional filters
 */
const getAllCases = ({ page = 1, limit = 10, status, priority, district, category }) => {
  let cases = [...mockCases];

  // Apply filters
  if (status) cases = cases.filter(c => c.status.toLowerCase() === status.toLowerCase());
  if (priority) cases = cases.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
  if (district) cases = cases.filter(c => c.district.toLowerCase().includes(district.toLowerCase()));
  if (category) cases = cases.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedCases = cases.slice(startIndex, endIndex);

  return {
    data: paginatedCases,
    pagination: {
      total: cases.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(cases.length / limitNum),
      hasNext: endIndex < cases.length,
      hasPrev: pageNum > 1,
    },
  };
};

/**
 * getCaseById — fetch single case by ID or case number
 */
const getCaseById = (id) => {
  const caseItem = mockCases.find(
    c => c.id === id || c.caseNumber === id
  );
  if (!caseItem) {
    const error = new Error(`Case not found: ${id}`);
    error.statusCode = 404;
    throw error;
  }
  return caseItem;
};

/**
 * searchCases — full-text search across key fields
 */
const searchCases = (query) => {
  if (!query || query.trim() === '') {
    return mockCases;
  }
  const q = query.toLowerCase();
  return mockCases.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.caseNumber.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.district.toLowerCase().includes(q) ||
    c.village.toLowerCase().includes(q) ||
    c.plaintiff.toLowerCase().includes(q) ||
    c.defendant.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q)
  );
};

/**
 * createCase — add a new case (mock: in-memory push)
 */
const createCase = (caseData) => {
  const { v4: uuidv4 } = require('uuid');
  const newCase = {
    id: `CASE-2024-${String(mockCases.length + 1).padStart(3, '0')}`,
    ...caseData,
    status: caseData.status || 'PENDING',
    priority: caseData.priority || 'MEDIUM',
    documents: caseData.documents || [],
    timeline: caseData.timeline || [],
    aiSummary: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockCases.push(newCase);
  return newCase;
};

/**
 * getDashboardStats — statistics for the dashboard
 */
const getDashboardStats = () => getStatistics();

module.exports = { getAllCases, getCaseById, searchCases, createCase, getDashboardStats };
