const db = require('../config/db');

// ── cases_raw ─────────────────────────────────────────────────────────────────
const findAll = async () => {
  const result = await db.query('SELECT * FROM cases_raw ORDER BY case_id');
  return result.rows;
};

const findById = async (id) => {
  // Try case_id first, then parcel_id
  const result = await db.query(
    'SELECT * FROM cases_raw WHERE case_id = $1 OR parcel_id = $1 LIMIT 1',
    [id]
  );
  return result.rows[0] || null;
};

const search = async (q) => {
  const result = await db.query(
    `SELECT * FROM cases_raw 
     WHERE case_name ILIKE $1 
     OR case_number ILIKE $1 
     OR district ILIKE $1 
     OR village ILIKE $1 
     OR dispute_type ILIKE $1
     OR case_type ILIKE $1
     OR tehsil ILIKE $1
     OR state ILIKE $1`,
    [`%${q}%`]
  );
  return result.rows;
};

// ── case_evidence ─────────────────────────────────────────────────────────────
const findEvidenceByCaseId = async (caseId) => {
  const result = await db.query(
    'SELECT * FROM case_evidence WHERE case_id = $1 ORDER BY document_date DESC',
    [caseId]
  );
  return result.rows;
};

// ── land_evidence ─────────────────────────────────────────────────────────────
const findLandEvidence = async (landId) => {
  const result = await db.query(
    'SELECT * FROM land_evidence WHERE land_id = $1',
    [landId]
  );
  return result.rows;
};

// ── khata_records ─────────────────────────────────────────────────────────────
const findKhataRecords = async ({ district, village, khataNo } = {}) => {
  let query = 'SELECT * FROM khata_records WHERE 1=1';
  const params = [];
  if (district) { params.push(district); query += ` AND district ILIKE $${params.length}`; }
  if (village)  { params.push(village);  query += ` AND village ILIKE $${params.length}`; }
  if (khataNo)  { params.push(khataNo);  query += ` AND khata_no = $${params.length}`; }
  const result = await db.query(query, params.map(p => p.includes ? `%${p}%` : p));
  return result.rows;
};

// ── khata_owners ──────────────────────────────────────────────────────────────
const findOwnersByKhataRecordId = async (khataRecordId) => {
  const result = await db.query(
    'SELECT * FROM khata_owners WHERE khata_record_id = $1',
    [khataRecordId]
  );
  return result.rows;
};

// ── land_master ───────────────────────────────────────────────────────────────
const findLandMaster = async ({ district, village, khasraNo } = {}) => {
  let query = 'SELECT * FROM land_master WHERE 1=1';
  const params = [];
  if (district) { params.push(`%${district}%`); query += ` AND district ILIKE $${params.length}`; }
  if (village)  { params.push(`%${village}%`);  query += ` AND village ILIKE $${params.length}`; }
  if (khasraNo) { params.push(khasraNo);         query += ` AND khasra_no = $${params.length}`; }
  const result = await db.query(query, params);
  return result.rows;
};

// ── land_geospatial ───────────────────────────────────────────────────────────
const findGeospatialByLandId = async (landId) => {
  const result = await db.query(
    'SELECT * FROM land_geospatial WHERE land_id = $1',
    [landId]
  );
  return result.rows;
};

// ── land_history ──────────────────────────────────────────────────────────────
const findHistoryByLandId = async (landId) => {
  const result = await db.query(
    'SELECT * FROM land_history WHERE land_id = $1 ORDER BY event_date DESC',
    [landId]
  );
  return result.rows;
};

// ── land_acquisition_cases ────────────────────────────────────────────────────
const findAcquisitionCases = async ({ district, village, purpose } = {}) => {
  let query = 'SELECT * FROM land_acquisition_cases WHERE 1=1';
  const params = [];
  if (district) { params.push(`%${district}%`); query += ` AND district ILIKE $${params.length}`; }
  if (village)  { params.push(`%${village}%`);  query += ` AND village ILIKE $${params.length}`; }
  if (purpose)  { params.push(`%${purpose}%`);  query += ` AND purpose ILIKE $${params.length}`; }
  const result = await db.query(query, params);
  return result.rows;
};

const findAcquisitionCaseById = async (acquisitionId) => {
  const result = await db.query(
    'SELECT * FROM land_acquisition_cases WHERE acquisition_id = $1',
    [acquisitionId]
  );
  return result.rows[0] || null;
};

// ── land_acquisition_evidence ─────────────────────────────────────────────────
const findAcquisitionEvidence = async (acquisitionId) => {
  const result = await db.query(
    'SELECT * FROM land_acquisition_evidence WHERE acquisition_id = $1',
    [acquisitionId]
  );
  return result.rows;
};

// ── land_acquisition_parcels ──────────────────────────────────────────────────
const findAcquisitionParcels = async (acquisitionId) => {
  const result = await db.query(
    'SELECT * FROM land_acquisition_parcels WHERE acquisition_id = $1',
    [acquisitionId]
  );
  return result.rows;
};

// ── land_characteristics ──────────────────────────────────────────────────────
const findCharacteristicsByLandId = async (landId) => {
  const result = await db.query(
    'SELECT * FROM land_characteristics WHERE land_id = $1',
    [landId]
  );
  return result.rows[0] || null;
};

// ── land_observations ─────────────────────────────────────────────────────────
const findObservationsByLandId = async (landId) => {
  const result = await db.query(
    'SELECT * FROM land_observations WHERE land_id = $1 ORDER BY observation_date DESC',
    [landId]
  );
  return result.rows;
};

module.exports = {
  findAll,
  findById,
  search,
  findEvidenceByCaseId,
  findLandEvidence,
  findKhataRecords,
  findOwnersByKhataRecordId,
  findLandMaster,
  findGeospatialByLandId,
  findHistoryByLandId,
  findAcquisitionCases,
  findAcquisitionCaseById,
  findAcquisitionEvidence,
  findAcquisitionParcels,
  findCharacteristicsByLandId,
  findObservationsByLandId,
};
