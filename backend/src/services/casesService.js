const repo = require('../repositories/casesRepository')

/**
 * Maps a raw Supabase cases_raw row into the DTO shape the frontend expects.
 */
const mapCase = (c) => {
  // Try to split case_name into plaintiff vs defendant on "v." or "vs"
  const nameParts = (c.case_name || '').split(/\s+v\.?\s+|\s+vs\.?\s+/i)
  const plaintiff = nameParts[0]?.trim() || 'Unknown'
  const defendant = nameParts[1]?.trim() || 'Unknown'

  return {
    // Identity
    id: c.case_id || c.parcel_id,
    caseNumber: c.case_number || c.case_id,
    parcelId: c.parcel_id,

    // Display
    title: c.case_name || 'Untitled Case',
    status: c.current_status || 'PENDING',
    priority: derivePriority(c),
    category: c.case_type || c.dispute_type || 'Land Dispute',
    description: c.remarks || c.conflict_description || c.dispute_type || 'No description available.',

    // Parties
    plaintiff,
    defendant,

    // Location
    district: c.district || 'Unknown',
    state: c.state || 'Unknown',
    village: c.village || c.disputed_village || '—',
    tehsil: c.tehsil || '—',

    // Land identifiers
    khasraNo: c.khasra_no || '—',
    surveyNumber: c.survey_no || '—',
    area: c.area || '—',
    landType: c.parcel_type || '—',
    taluka: c.tehsil || '—',
    ulpin: c.ulpin || '—',

    // Dates
    filedDate: c.dispute_start_year || null,
    hearingDate: c.last_verified_date || null,
    lastVerified: c.last_verified_date || null,

    // Court
    court: c.court || '—',

    // Evidence quality
    evidenceScore: c.evidence_score || 0,
    sourceCount: c.source_count || 0,
    verificationLevel: c.verification_level || 'UNVERIFIED',
    conflictFlag: c.conflict_flag || false,

    // Document availability flags
    documents: buildDocuments(c),

    // Timeline built from available data
    timeline: buildTimeline(c),
  }
}

const derivePriority = (c) => {
  if (c.conflict_flag === true || c.conflict_flag === 'true') return 'CRITICAL'
  if (c.verification_level === 'VERIFIED_GOVERNMENT') return 'HIGH'
  if (c.evidence_score >= 0.8) return 'HIGH'
  if (c.evidence_score >= 0.5) return 'MEDIUM'
  return 'LOW'
}

const buildDocuments = (c) => {
  const docs = []
  if (c.current_ror === 'YES') docs.push({ name: 'Record of Rights (RoR)', type: 'Land Record', verified: true })
  if (c.cadastral_map === 'YES') docs.push({ name: 'Cadastral Map', type: 'GIS/Survey', verified: true })
  if (c.registration_record === 'YES') docs.push({ name: 'Registration Record', type: 'Revenue', verified: true })
  if (c.court_documents === 'YES') docs.push({ name: 'Court Documents', type: 'Judicial', verified: true })
  if (c.satellite_data === 'YES') docs.push({ name: 'Satellite Data', type: 'Remote Sensing', verified: true })
  if (c.news_articles === 'YES') docs.push({ name: 'News Articles', type: 'Media', verified: false })
  if (c.research_papers === 'YES') docs.push({ name: 'Research Papers', type: 'Academic', verified: false })
  if (docs.length === 0) docs.push({ name: 'No documents on record', type: '—', verified: false })
  return docs
}

const buildTimeline = (c) => {
  const events = []
  if (c.dispute_start_year) {
    events.push({ event: 'Dispute Began', date: c.dispute_start_year, description: c.dispute_type || 'Land dispute recorded.' })
  }
  if (c.current_status) {
    events.push({ event: c.current_status, date: c.last_verified_date || null, description: `Status as per latest verified records.` })
  }
  return events
}

// ─────────────────────────────────────────────────────────────────────────────

const getAllCases = async ({ page = 1, limit = 10, status = '', priority = '', district = '' } = {}) => {
  let cases = (await repo.findAll()).map(mapCase)

  if (status) cases = cases.filter((c) => c.status && c.status.toLowerCase().includes(status.toLowerCase()))
  if (priority) cases = cases.filter((c) => c.priority === priority)
  if (district) cases = cases.filter((c) => c.district && c.district.toLowerCase() === district.toLowerCase())

  const totalCount = cases.length
  const totalPages = Math.max(1, Math.ceil(totalCount / Number(limit)))
  const pageNum = Math.max(1, Math.min(Number(page), totalPages))
  const offset = (pageNum - 1) * Number(limit)
  const data = cases.slice(offset, offset + Number(limit))

  return {
    data,
    pagination: {
      page: pageNum,
      limit: Number(limit),
      totalCount,
      totalPages,
      hasPrev: pageNum > 1,
      hasNext: pageNum < totalPages,
    },
  }
}

const getCaseById = async (id) => {
  const c = await repo.findById(id)
  if (!c) return null
  return { data: mapCase(c) }
}

const searchCases = async (q) => {
  if (!q || !q.trim()) return { data: [] }
  const results = (await repo.search(q)).map(mapCase)
  return { data: results }
}

const getStats = async () => {
  const cases = (await repo.findAll()).map(mapCase)
  const byCategory = {}
  const byDistrict = {}

  cases.forEach((c) => {
    const cat = c.category || 'Other'
    byCategory[cat] = (byCategory[cat] || 0) + 1
    const dist = c.district || 'Unknown'
    byDistrict[dist] = (byDistrict[dist] || 0) + 1
  })

  return {
    data: {
      totalCases: cases.length,
      activeCases: cases.filter((c) => c.status && c.status.toUpperCase().includes('ACTIVE')).length,
      pendingCases: cases.filter((c) => c.status && c.status.toUpperCase().includes('PENDING')).length,
      resolvedCases: cases.filter((c) =>
        c.status && (c.status.toUpperCase().includes('DECIDED') || c.status.toUpperCase().includes('RESOLVED'))
      ).length,
      criticalCases: cases.filter((c) => c.priority === 'CRITICAL').length,
      byCategory,
      byDistrict,
    },
  }
}

module.exports = { getAllCases, getCaseById, searchCases, getStats }
