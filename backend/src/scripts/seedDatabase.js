const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bhoomichain',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const DATA_DIR = path.join(__dirname, '../data');

async function parseCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return resolve([]);
    }
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Seeding Database...');

    // 1. Seed Cases
    const cases = await parseCsv(path.join(DATA_DIR, 'cases.csv'));
    for (const c of cases) {
      await client.query(
        `INSERT INTO cases (
          case_id, case_name, state, district, tehsil, village, khasra_no, survey_no, parcel_type, area,
          dispute_type, dispute_start_year, current_status, court, case_number, ulpin, current_ror,
          cadastral_map, registration_record, court_documents, satellite_data, news_articles, research_papers,
          evidence_score, source_count, case_type, verification_level, conflict_flag, conflict_description,
          last_verified_date, data_version, remarks
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)
        ON CONFLICT (case_id) DO NOTHING`,
        [
          c.case_id, c.case_name, c.state, c.district, c.tehsil, c.village, c.khasra_no, c.survey_no, c.parcel_type, c.area,
          c.dispute_type, c.dispute_start_year, c.current_status, c.court, c.case_number, c.ulpin, c.current_ror,
          c.cadastral_map, c.registration_record, c.court_documents, c.satellite_data, c.news_articles, c.research_papers,
          c.evidence_score ? parseFloat(c.evidence_score) : null, c.source_count ? parseInt(c.source_count) : null, c.case_type, c.verification_level,
          c.conflict_flag === 'True', c.conflict_description, c.last_verified_date || null, c.data_version ? parseFloat(c.data_version) : null, c.remarks
        ]
      );
    }
    console.log(`Inserted ${cases.length} cases.`);

    // 2. Seed Parcels
    for (const c of cases) {
      if (c.parcel_id) {
         await client.query(
            `INSERT INTO parcels (parcel_id, case_id, geometry_source, survey_map, joint_verification_status, settlement_status) 
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (parcel_id) DO NOTHING`,
            [c.parcel_id, c.case_id, c.geometry_source, c.survey_map, c.joint_verification_status, c.settlement_status]
         );
      }
    }
    console.log(`Inserted parcels derived from cases.`);

    // 3. Seed Khata Records
    const khataRecords = await parseCsv(path.join(DATA_DIR, 'khata_records.csv'));
    for (const k of khataRecords) {
        await client.query(
          `INSERT INTO khata_records (khata_record_id, holding_id, land_id, rect_no, khasra_no, area_raw, area_unit, remarks, data_status, verification_status, source_name, source_url, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (khata_record_id) DO NOTHING`,
          [k.khata_record_id, k.holding_id, k.land_id, k.rect_no, k.khasra_no, k.area_raw ? parseFloat(k.area_raw) : null, k.area_unit, k.remarks, k.data_status, k.verification_status, k.source_name, k.source_url, k.created_at || null]
        );
    }
    console.log(`Inserted ${khataRecords.length} khata records.`);

    // 4. Seed Khata Owners
    const owners = await parseCsv(path.join(DATA_DIR, 'khata_owners.csv'));
    for (const o of owners) {
        await client.query(
           `INSERT INTO khata_owners (khata_owner_id, khata_record_id, owner_name, owner_share, data_status, verification_status, source_name, source_url, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (khata_owner_id) DO NOTHING`,
           [o.khata_owner_id, o.khata_record_id, o.owner_name, o.owner_share, o.data_status, o.verification_status, o.source_name, o.source_url, o.created_at || null]
        );
    }
    console.log(`Inserted ${owners.length} khata owners.`);

    // 5. Seed Evidence
    const caseEvidence = await parseCsv(path.join(DATA_DIR, 'case_evidence.csv'));
    const landEvidence = await parseCsv(path.join(DATA_DIR, 'land_evidence.csv'));
    const allEvidence = [...caseEvidence, ...landEvidence];
    
    for (const e of allEvidence) {
      await client.query(
        `INSERT INTO evidence (evidence_id, case_id, parcel_id, land_id, source_type, source_name, source_authority, source_url, document_date, retrieval_date, field_extracted, extracted_value, page_number, verification_status, confidence, notes, data_status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) ON CONFLICT (evidence_id) DO NOTHING`,
        [
           e.evidence_id, e.case_id || null, e.parcel_id || null, e.land_id || null, e.source_type, e.source_name, e.source_authority || e.authority, e.source_url,
           e.document_date || null, e.retrieval_date || null, e.field_extracted, e.extracted_value, e.page_number, e.verification_status,
           e.confidence ? parseFloat(e.confidence) : null, e.notes || null, e.data_status || null, e.created_at || null
        ]
      );
    }
    console.log(`Inserted ${allEvidence.length} evidence records.`);

    await client.query('COMMIT');
    console.log('Seeding completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    pool.end();
  }
}

seedDatabase();
