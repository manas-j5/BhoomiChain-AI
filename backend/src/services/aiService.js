const { GoogleGenerativeAI } = require('@google/generative-ai')
const db = require('../config/db')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Searches all evidence tables for context relevant to the user's question.
 */
async function retrieveEvidence(query) {
  // Extract meaningful keywords (3+ chars, skip stop words)
  const stopWords = new Set(['the', 'is', 'are', 'was', 'what', 'about', 'tell', 'me', 'how', 'does', 'did', 'for', 'and', 'that', 'this', 'with', 'from'])
  const keywords = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !stopWords.has(w))
    .slice(0, 6)

  // Build OR conditions for each keyword
  const buildOrCondition = (cols, params) => {
    const conditions = []
    keywords.forEach(kw => {
      params.push(`%${kw}%`)
      const idx = params.length
      conditions.push(cols.map(col => `${col} ILIKE $${idx}`).join(' OR '))
    })
    return conditions.map(c => `(${c})`).join(' OR ')
  }

  const [caseEvRes, landEvRes] = await Promise.allSettled([
    (() => {
      const params = []
      const where = buildOrCondition(['source_name', 'extracted_value', 'field_extracted', 'authority'], params)
      return db.query(
        `SELECT evidence_id, case_id, source_name, authority, field_extracted, extracted_value,
                source_url, document_date, verification_status, confidence
         FROM case_evidence
         ${where ? `WHERE ${where}` : ''}
         LIMIT 10`,
        params
      )
    })(),
    (() => {
      const params = []
      const where = buildOrCondition(['source_name', 'extracted_value', 'field_extracted', 'source_authority', 'notes'], params)
      return db.query(
        `SELECT evidence_id, land_id, source_name, source_authority, field_extracted, extracted_value,
                source_url, document_date, verification_status, confidence, notes
         FROM land_evidence
         ${where ? `WHERE ${where}` : ''}
         LIMIT 10`,
        params
      )
    })(),
  ])

  const caseEvidence = caseEvRes.status === 'fulfilled' ? caseEvRes.value.rows : []
  const landEvidence = landEvRes.status === 'fulfilled' ? landEvRes.value.rows : []

  // Always load all cases for context (only 12 rows — very fast)
  const caseRes = await db.query(
    `SELECT case_id, case_name, current_status, district, village, dispute_type, court,
            case_number, area, remarks, verification_level, state
     FROM cases_raw`
  ).catch(() => ({ rows: [] }))

  return {
    caseEvidence,
    landEvidence,
    cases: caseRes.rows,
    totalSources: caseEvidence.length + landEvidence.length + caseRes.rows.length,
  }
}

/**
 * Formats the retrieved evidence into a structured context block for the LLM.
 */
function buildContext({ caseEvidence, landEvidence, cases }) {
  let context = ''

  if (cases.length > 0) {
    context += '## Relevant Cases\n'
    cases.forEach(c => {
      context += `- **${c.case_name}** (${c.case_id})\n`
      context += `  District: ${c.district || '—'} | Court: ${c.court || '—'}\n`
      context += `  Status: ${c.current_status || '—'}\n`
      context += `  Dispute Type: ${c.dispute_type || '—'}\n`
      if (c.remarks) context += `  Remarks: ${c.remarks}\n`
      context += '\n'
    })
  }

  if (caseEvidence.length > 0) {
    context += '## Case Evidence Records\n'
    caseEvidence.forEach(e => {
      context += `- **${e.source_name}** [${e.verification_status}]\n`
      context += `  Field: ${e.field_extracted} = "${e.extracted_value}"\n`
      if (e.authority) context += `  Authority: ${e.authority}\n`
      if (e.source_url) context += `  Source: ${e.source_url}\n`
      context += '\n'
    })
  }

  if (landEvidence.length > 0) {
    context += '## Land Evidence Records\n'
    landEvidence.forEach(e => {
      context += `- **${e.source_name}** [${e.verification_status}]\n`
      context += `  Field: ${e.field_extracted} = "${e.extracted_value}"\n`
      if (e.source_authority) context += `  Authority: ${e.source_authority}\n`
      if (e.notes) context += `  Notes: ${e.notes}\n`
      context += '\n'
    })
  }

  return context || 'No directly matching evidence was found in the database.'
}

/**
 * Main RAG function: retrieve → build context → generate
 */
async function chat(userMessage, conversationHistory = []) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      answer: `The AI chatbot requires a Gemini API key. Please add **GEMINI_API_KEY** to the backend **.env** file.\n\nGet a free key at https://aistudio.google.com`,
      sources: [],
      evidenceCount: 0,
    }
  }

  // 1. Retrieve relevant evidence from Supabase
  const retrieved = await retrieveEvidence(userMessage)

  // 2. Build the context block
  const contextBlock = buildContext(retrieved)

  // 3. Build the system prompt enforcing citation rules from the blueprint
  const systemPrompt = `You are BhoomiChain AI, an evidence-backed land governance intelligence assistant for India.

STRICT RULES:
- Only answer using the provided Evidence Context below.
- For every factual claim, cite the source (source name and field/value).
- If the evidence does not contain enough information, say "I don't have sufficient evidence in the database to answer this question accurately."
- NEVER fabricate citations or claim something that is not in the evidence.
- NEVER claim that AI determines legal land title or ownership.
- If you see conflicting evidence, highlight the conflict explicitly.
- Keep answers concise, structured, and evidence-backed.
- Use markdown formatting (bold, bullet points) for clarity.

Evidence Context:
${contextBlock}`

  // 4. Call Gemini API
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.7-flash',
    systemInstruction: systemPrompt,
  })

  // Build chat history — only valid user/assistant pairs, capped at last 10 turns
  const history = conversationHistory
    .filter(m => (m.role === 'user' || m.role === 'assistant') && m.content && m.content.trim())
    .slice(-10)
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  // Gemini requires history to start with a user message
  while (history.length > 0 && history[0].role === 'model') {
    history.shift()
  }
  // Gemini requires alternating user/model — remove consecutive duplicates
  const cleanHistory = []
  for (const turn of history) {
    if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== turn.role) {
      cleanHistory.push(turn)
    }
  }

  let answer = ''
  try {
    const chatSession = model.startChat({ history: cleanHistory })
    const result = await chatSession.sendMessage(userMessage)
    answer = result.response.text()
  } catch (err) {
    console.error('[Gemini API Error]', err.message || err)
    answer = "I apologize, but the AI engine is currently experiencing high demand or an outage. However, based on my local database search, I have retrieved the following evidence below."
  }

  // 5. Build sources array for frontend citation display
  const sources = [
    ...retrieved.caseEvidence.map(e => ({
      id: e.evidence_id,
      name: e.source_name,
      type: 'Case Evidence',
      authority: e.authority,
      field: e.field_extracted,
      value: e.extracted_value,
      url: e.source_url,
      confidence: e.confidence,
      status: e.verification_status,
    })),
    ...retrieved.landEvidence.map(e => ({
      id: e.evidence_id,
      name: e.source_name,
      type: 'Land Evidence',
      authority: e.source_authority,
      field: e.field_extracted,
      value: e.extracted_value,
      url: e.source_url,
      confidence: e.confidence,
      status: e.verification_status,
    })),
  ]

  return {
    answer,
    sources,
    evidenceCount: retrieved.totalSources,
    contextUsed: contextBlock.length > 50,
  }
}

module.exports = { chat }
