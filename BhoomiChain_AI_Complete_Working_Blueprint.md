# BhoomiChain AI — Complete Working Blueprint

**Two-Portal Product, User Flow & AI Development Guide**

> Architecture: 2 portals + 1 shared backend
> Stack: React + Tailwind | Node.js + Express | PostgreSQL + PostGIS
> AI: RAG + evidence-backed chatbot + analytics
> GIS: Parcel/case visualization + spatial analysis
> Trust: KYC/identity + RBAC + audit + optional blockchain provenance
> Dev goal: modular, readable, incremental code — avoid brittle/monolithic implementation

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Portal Model](#2-portal-model)
3. [User Portal — Flow & Functionality](#3-user-portal--flow--functionality)
4. [Government Portal — Flow & Functionality](#4-government-portal--flow--functionality)
5. [Shared Backend Architecture](#5-shared-backend-architecture)
6. [AI / RAG Scope](#6-ai--rag-scope)
7. [KYC / Identity / Access Scope](#7-kyc--identity--access-scope)
8. [Blockchain — Provenance, Not Ownership](#8-blockchain--provenance-not-ownership)
9. [Backend Design — Folder Structure & Rules](#9-backend-design--folder-structure--rules)
10. [API Surface](#10-api-surface)
11. [UI Specification](#11-ui-specification)
12. [Master AI Coding Prompt](#12-master-ai-coding-prompt)
13. [Feature-Specific AI Prompts](#13-feature-specific-ai-prompts)
14. [Development Roadmap](#14-development-roadmap)
15. [Team Boundaries](#15-team-boundaries)
16. [Final Product Definition](#16-final-product-definition)
17. [Quickstart Checklist](#17-quickstart-checklist)

---

## 1. Product Vision

Two main portals with different roles, dashboards, permissions and workflows, sharing a common backend and intelligence layer.

- **User Portal** — public/research oriented.
- **Government Portal** — secure, operational/decision-support oriented.

---

## 2. Portal Model

| Portal | Purpose | Users |
|---|---|---|
| **User Portal** | Discovery, search, GIS exploration, AI research and reports | Citizens, researchers, students, legal researchers, NGOs, academics |
| **Government Portal** | Secure case intelligence, land intelligence, analytics, policy simulation and administration | Revenue officers, land administrators, policy officials, authorized staff |

---

## 3. User Portal — Flow & Functionality

**Flow:**
Landing → Login/Register → User Dashboard → Case/Document Search or GIS → Case/Parcel Details → Timeline/Documents/Evidence → AI Assistant → Research Workspace → Report/Export.

**Functionality:**

| Module | Functions |
|---|---|
| Home | Project introduction, featured cases/research/datasets, public search, GIS entry |
| Authentication | Register/login, user category, role verification |
| Dashboard | Saved cases/documents/datasets, recent searches, GIS locations, AI conversations |
| Search | Case number, khasra number, village, district, state, parcel ID, ULPIN, court, case type, year |
| Case details | Metadata, parties, parcel identifiers, status, timeline, evidence and documents |
| Document repository | Authorized/public judgments, policies, research papers, reports, case studies, datasets |
| AI assistant | Evidence-backed Q&A with source, document, page/section and supporting evidence |
| GIS explorer | Parcel/case locations, boundaries, survey/contextual layers, land-use where available |
| Research workspace | Save cases/documents/datasets, notes, collections, comparisons, reports |
| Analytics | Research-oriented trends and public statistics |
| Reports | Executive summary, cases, evidence, GIS, timeline, trends, findings, sources |

---

## 4. Government Portal — Flow & Functionality

**Flow:**
Government Login → Identity/RBAC → Government Dashboard → Case Intelligence / Land Intelligence / GIS / Data Integration → AI Intelligence → Trends / Prediction / Simulation → Policy Insights → Reports/Decision Support.

**Functionality:**

| Module | Functions |
|---|---|
| Government login | Secure identity, role verification, permission-based navigation |
| Dashboard | Total/active/resolved cases, trends, high-priority queues, AI insights |
| Case intelligence | Land records, registration, revenue proceedings, court proceedings, documents, GIS, timeline |
| Evidence graph | Connect parcel + documents + proceedings + judgment; what happened, when, supporting evidence |
| GIS intelligence | Authorized parcel, dispute, court, revenue, survey, land-use, satellite-context, admin layers |
| Data integration | Authorized connections to government sources where available |
| Data upload | Records, case documents, reports, survey and GIS datasets; validate, extract, process, index |
| AI intelligence | Evidence search, government AI assistant, trend analysis, analytical insights |
| Predictive analytics | Non-legal risk/decision-support indicators |
| Policy Lab | Scenario builder, explicit assumptions, simulation, comparison, policy briefs |
| Research workspace | Collaborative projects, members, cases, documents, datasets, notes, AI analyses |
| Reports | District/state, trend, case, GIS, policy, evidence, research reports |
| Administration | Users, roles, permissions, audit logs, system settings |

---

## 5. Shared Backend Architecture

Use **one backend** and shared services rather than duplicating business logic. Authentication, PostgreSQL/PostGIS, document storage, AI/RAG, GIS, search, analytics, audit and integrations remain shared services.

```
   USER PORTAL          GOVERNMENT PORTAL
        │                       │
        └───────────┬───────────┘
                     ▼
           API + AUTH + RBAC
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
    CASES          USERS        DOCUMENTS
      │              │              │
      └──────────────┼──────────────┘
                     ▼
           PostgreSQL + PostGIS
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
    AI/RAG          GIS         Analytics
      │              │              │
      └──────────────┼──────────────┘
                     ▼
           Audit + Provenance
```

---

## 6. AI / RAG Scope

The AI layer is a **research and decision-support system, not an unrestricted chatbot**.

**Pipeline:**
```
Document → OCR/extraction → metadata → chunking
  → embeddings → index → retrieval
  → RAG → LLM → answer + citations + limitations
```

**Roadmap:**

| Stage | Feature | Output |
|---|---|---|
| MVP | Evidence-backed document Q&A | Answer + source + page/section |
| MVP | Case summarization | Structured summary + timeline |
| MVP | Evidence extraction | Dates, people, parcels, authorities, events |
| Phase 2 | Cross-case comparison | Patterns and differences |
| Phase 2 | Trend analysis | Observed patterns + supporting evidence |
| Phase 3 | Predictive indicators | Non-legal analytical risk signals |
| Phase 3 | Policy simulation assistant | Scenario setup + assumptions + estimated impact |

**AI rules:**
- Answer only from authorized evidence.
- Expose source/document/page/section for every answer.
- Show conflicts.
- Separate observed data, assumptions, simulations, and uncertainty.
- Never fabricate citations.
- Never claim AI determines legal title.

---

## 7. KYC / Identity / Access Scope

KYC is an **identity/access layer, not proof of land ownership**. Use role-based access and step-up authentication for sensitive actions. Keep the identity provider abstracted so an approved KYC or government identity integration can be added later.

| Layer | Function |
|---|---|
| Account | Email/mobile verification or strong authentication |
| Researcher/institution | Optional institutional verification and approval workflow |
| Government | Government SSO/identity provider where authorized |
| Sensitive actions | Step-up authentication for export/upload/admin |
| RBAC | Citizen, researcher, analyst, officer, policy-maker, administrator |
| Audit | Who viewed, uploaded, changed, exported or generated a report |

---

## 8. Blockchain — Provenance, Not Ownership

Optional trust/provenance layer. Keep documents and sensitive records **off-chain**. Anchor hashes, timestamps, version identifiers and selected audit batches. Never claim blockchain makes a land title legally valid. This is a later-phase feature.

```
Secure document/version
        │
   SHA-256 hash
        ↓
 Provenance service
        ↓
 Blockchain adapter
        ↓
 hash + timestamp + version
        ↓
   Verify on demand
```

---

## 9. Backend Design — Folder Structure & Rules

```
backend/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── dto/
│   ├── models/
│   ├── validators/
│   ├── integrations/
│   └── app.js
├── tests/
├── server.js
├── package.json
└── .env.example
```

**Request flow:**
`Request → Route → Auth/RBAC → Validation → Controller → Service → Repository → Database → Response`

**Coding rules:**
- Small modules; centralized error handling; boundary validation.
- No secrets in source — use environment variables.
- Consistent JSON responses; pagination; transactions; indexes; tests.
- Isolated AI/GIS/blockchain service interfaces.
- Do not put database queries or AI prompts inside route files.

---

## 10. API Surface

| Area | Example endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `/login`, `/verify` |
| Cases | `GET /api/cases`, `GET /api/cases/:id`, `GET /api/cases/search?q=` |
| Documents | `GET /api/documents`, `GET /api/documents/:id`, `POST /api/documents` |
| GIS | `GET /api/gis/parcels/:id`, `GET /api/gis/layers`, `POST /api/gis/query` |
| AI | `POST /api/ai/chat`, `/summarize`, `/analyze` |
| Research | `GET/POST /api/workspaces`, `/api/workspaces/:id/items` |
| Analytics | `GET /api/analytics/trends`, `POST /api/analytics/query` |
| Policy | `POST /api/policy/scenarios`, `/api/policy/simulate` |
| KYC | `POST /api/kyc/start`, `GET /api/kyc/status/:id` |
| Provenance | `POST /api/provenance/anchor`, `GET /api/provenance/verify/:id` |
| Admin | `GET /api/admin/users`, `PATCH /api/admin/users/:id/role`, `GET /api/admin/audit-logs` |

---

## 11. UI Specification

Build a modern **government/research intelligence interface**, not a generic admin template.

- Clear typography, restrained visual hierarchy, accessible contrast.
- Responsive layouts, progressive disclosure.
- Reusable components.
- Complete loading / empty / error / permission-denied states.
- Maps need layer controls and a detail drawer.
- AI chat must always show sources/evidence.

---

## 12. Master AI Coding Prompt

Use this as the project-level prompt for Cursor, Claude Code, GitHub Copilot Chat, or another coding assistant. Use the smaller feature prompts (Section 13) for individual features.

```
You are the senior full-stack architect and implementation engineer for BhoomiChain AI.

Build TWO separate experiences:
1. User Portal: discover, search, GIS exploration, evidence-backed AI, research and reports.
2. Government Portal: secure case intelligence, authorized land intelligence, GIS analytics,
   AI analytics, policy simulation and administration.

STACK:
React + Tailwind; Node.js + Express; PostgreSQL + PostGIS.
Keep AI/RAG, GIS, analytics, KYC/identity and blockchain provenance behind modular service interfaces.

UI:
Create a beautiful, modern, responsive government/research intelligence UI.
User Portal = discovery/research. Government Portal = operational/intelligence.
Use reusable components and design loading, empty, error and permission-denied states.
Maps need layer controls and a detail drawer.
AI chat must show sources/evidence.

BACKEND:
Use route -> middleware -> controller -> service -> repository -> database.
Never put business logic or SQL directly in route handlers.
Use validation, centralized errors, structured logging, pagination, transactions and tests.
Use .env.example; never hard-code secrets.
Preserve existing working code and change only required files.

SECURITY:
Authentication + RBAC + least privilege + audit logs + rate limiting + validation + secure file uploads.
KYC verifies identity/access eligibility; it does not establish land title.
Sensitive government data must not reach public users.

AI:
Use authorized documents only.
Pipeline: ingest -> OCR/extract -> metadata -> chunk -> embed -> index -> retrieve -> RAG -> LLM.
Every answer must expose source/document/page or section/evidence when available.
Show conflicts and uncertainty.
Separate observed data, assumptions, simulated estimates and uncertainty.
Never fabricate citations or determine legal title.

GIS:
Use PostGIS for spatial storage and safe spatial queries.
Keep GIS logic out of React components and route files.
Use mock GeoJSON first so UI can be built before live integrations.

BLOCKCHAIN:
Optional later-phase provenance service.
Keep documents/PII off-chain.
Hash document/version/audit payloads and anchor hashes.
Provide verify functionality and a mock/local adapter.
Blockchain does not make land title legally valid.

DEVELOPMENT:
Build incrementally.
First create module skeleton, then one end-to-end feature.
For each change give exact files, full code, run commands, tests, expected output and common fixes.
Do not rewrite unrelated working code.
Do not create giant files.
Prefer small interfaces and adapters so AI, GIS, KYC and blockchain can be replaced independently.

ORDER:
1. foundation/auth/RBAC
2. portal shells
3. case APIs + database
4. case search/details/timeline
5. GIS
6. documents/evidence
7. RAG chatbot
8. workspace
9. analytics
10. policy simulation
11. KYC/SSO adapter
12. blockchain provenance
13. testing/deployment hardening
```

---

## 13. Feature-Specific AI Prompts

### Frontend shell
```
Build the React + Tailwind BhoomiChain AI shell with separate /user and /gov route groups.
Create reusable AppLayout, Sidebar, Topbar, and role-aware navigation.
Include loading, empty, error and permission-denied states as reusable components.
Do not implement business logic yet — scaffold routes and layout only.
```

### Backend case module
```
Implement Node.js + Express case APIs: GET /api/cases, GET /api/cases/:id,
GET /api/cases/search?q=. Separate routes/controllers/services/repositories.
Add validation, pagination, centralized error handling and tests.
Use mock/seed data if the database is not yet connected.
```

### AI chatbot
```
Implement evidence-backed RAG. Separate ingestion, OCR, metadata extraction,
chunking, embeddings, retrieval and generation into isolated modules.
Return answer + source document + page/section + confidence + any conflicts.
Never fabricate a citation — if no supporting evidence is retrieved, say so explicitly.
```

### GIS
```
Implement a modular PostGIS GIS service with parcel/case endpoints and a React map
with layers and a detail drawer. Use mock GeoJSON first so the UI can be built
before live spatial data integrations. Keep spatial query logic in the service layer.
```

### KYC/RBAC
```
Implement authentication, RBAC and a KYC-ready provider interface.
Use mock mode in development. Add verification state, consent tracking,
and step-up authentication for sensitive actions (export/upload/admin).
```

### Blockchain
```
Implement optional provenance with an off-chain SHA-256 hash, PostgreSQL metadata,
a blockchain adapter, POST /api/provenance/anchor and GET /api/provenance/verify/:id.
Provide a mock/local adapter for development. Never store documents or PII on-chain.
```

### Policy simulation
```
Build a transparent simulation service. Inputs: baseline observed data,
explicit assumptions and scenario parameters. Outputs: projected impact,
assumptions list, and confidence/uncertainty notes. Never present a simulation
as a factual/legal outcome.
```

### Hardening
```
Audit the implemented module for brittle code, coupling, missing validation
and insecure defaults. Refactor only what is needed — do not rewrite unrelated
working code. Add/verify tests for edge cases and permission boundaries.
```

---

## 14. Development Roadmap

| Phase | Build | Demo value |
|---|---|---|
| 0 — Foundation | Repo, auth/RBAC, shared UI, contracts, DB schema | Stable team foundation |
| 1 — Core MVP | User search, case details, timeline, government dashboard, GIS | End-to-end product |
| 2 — Evidence | Documents, evidence graph, OCR, RAG chatbot | AI differentiator |
| 3 — Intelligence | Trends, analytics, cross-case comparison, policy lab | Decision-support story |
| 4 — Trust | KYC/SSO, advanced RBAC, audit, provenance/blockchain | Government readiness |
| 5 — Production | Tests, Docker, CI/CD, monitoring, backup, security hardening | Deployable system |

---

## 15. Team Boundaries

Keep team work aligned to separate feature branches/folders:

| Feature | Folder |
|---|---|
| `feature/frontend` | `frontend/` |
| `feature/backend` | `backend/` |
| `feature/ai` | `ai-engine/` |
| `feature/gis` | `gis-engine/` |
| `feature/blockchain` | `blockchain/` |
| `feature/devops` | `infra/` |

**Integration flow:** `feature → PR → develop → testing → PR → main`

---

## 16. Final Product Definition

- **User Portal** — helps people discover and research land-governance evidence.
- **Government Portal** — helps authorized officials analyse cases, land intelligence and policy scenarios.
- **Shared intelligence layer** — connects data, documents, GIS, AI and evidence.

**Build principle:** Do not implement every advanced capability at once. A working `case-search → case-details → GIS → evidence → AI` flow is a stronger demonstration than many unfinished integrations. AI, KYC and blockchain should be modular additions, not dependencies that block the core product.

---

## 17. Quickstart Checklist

- [ ] Init monorepo: `frontend/`, `backend/`, `ai-engine/`, `gis-engine/`, `blockchain/`, `infra/`
- [ ] Set up PostgreSQL + PostGIS locally (Docker recommended)
- [ ] Scaffold Express backend with `src/{config,middleware,routes,controllers,services,repositories,dto,models,validators,integrations}`
- [ ] Add `.env.example` (no real secrets committed)
- [ ] Build auth + RBAC middleware first (Phase 0)
- [ ] Scaffold `/user` and `/gov` route groups in React + Tailwind
- [ ] Seed mock case/document/GeoJSON data for early UI development
- [ ] Build case search → case details → timeline (Phase 1 MVP)
- [ ] Add GIS map with layer controls + detail drawer
- [ ] Wire up RAG pipeline (ingest → OCR → chunk → embed → retrieve → generate) with citation enforcement
- [ ] Add workspace (save/notes/collections/reports)
- [ ] Add analytics + trends
- [ ] Add Policy Lab (assumptions-explicit simulation)
- [ ] Add KYC-ready identity adapter (mock mode first)
- [ ] Add optional blockchain provenance (hash + anchor + verify, off-chain data)
- [ ] Add tests, CI/CD, Docker, monitoring, backups before production
