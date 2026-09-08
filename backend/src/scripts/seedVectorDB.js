const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
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

// A placeholder embedding function. In production, connect this to OpenAI, HuggingFace, or Gemini.
async function generateEmbedding(text) {
  // Returns a dummy 1536-dimensional vector
  return Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
}

async function seedVectorDB() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create pgvector extension if not exists
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');

    // Add embedding column to evidence table if not exists
    await client.query(`
      ALTER TABLE evidence 
      ADD COLUMN IF NOT EXISTS embedding vector(1536)
    `);

    console.log('Seeding Vector Database...');

    // Load evidence
    const caseEvidence = await parseCsv(path.join(DATA_DIR, 'case_evidence.csv'));
    const landEvidence = await parseCsv(path.join(DATA_DIR, 'land_evidence.csv'));
    const allEvidence = [...caseEvidence, ...landEvidence];

    for (const e of allEvidence) {
      // Create a rich text chunk representing the evidence
      const chunkText = `
        Source Name: ${e.source_name}
        Authority: ${e.source_authority || e.authority}
        Extracted Field: ${e.field_extracted}
        Value: ${e.extracted_value}
        Notes: ${e.notes || ''}
      `;

      const embedding = await generateEmbedding(chunkText);
      
      // We assume the evidence is already seeded in the DB by seedDatabase.js.
      // So we just update the embedding column.
      await client.query(
        `UPDATE evidence SET embedding = $1::vector WHERE evidence_id = $2`,
        ['[' + embedding.join(',') + ']', e.evidence_id]
      );
    }

    // Create an index for vector search (HNSW or IVFFlat)
    await client.query(`
      CREATE INDEX IF NOT EXISTS evidence_embedding_idx 
      ON evidence USING hnsw (embedding vector_cosine_ops)
    `);

    console.log(`Updated ${allEvidence.length} evidence records with embeddings.`);
    
    await client.query('COMMIT');
    console.log('Vector DB Seeding completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding vector DB:', error);
  } finally {
    client.release();
    pool.end();
  }
}

seedVectorDB();
