/**
 * Case model shape definition.
 * Use this as a reference for Prisma schema creation.
 *
 * @typedef {Object} Case
 * @property {string} id - Unique case identifier
 * @property {string} title - Case title
 * @property {string} caseNumber - Official court case number
 * @property {'ACTIVE'|'PENDING'|'RESOLVED'|'DISMISSED'} status - Case status
 * @property {'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'} priority - Case priority
 * @property {string} category - Dispute category
 * @property {string} district - District name
 * @property {string} state - State name
 * @property {string} taluka - Taluka/Tehsil name
 * @property {string} village - Village name
 * @property {string} surveyNumber - Land survey number
 * @property {string} area - Land area
 * @property {string} landType - Type of land
 * @property {string} plaintiff - Plaintiff name
 * @property {string} defendant - Defendant name
 * @property {string} filedDate - ISO date string
 * @property {string} hearingDate - ISO date string
 * @property {string} court - Court name
 * @property {string} judge - Presiding judge
 * @property {string} description - Case description
 * @property {Array} documents - Attached documents
 * @property {Array} timeline - Case timeline events
 * @property {string|null} aiSummary - AI-generated summary
 * @property {{lat: number, lng: number}} coordinates - GIS coordinates
 * @property {string} createdAt - ISO datetime
 * @property {string} updatedAt - ISO datetime
 */

module.exports = {};
