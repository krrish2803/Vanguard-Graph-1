# Vanguard Graph

**Fraud Coordination Intelligence Engine — Catch fraud rings before money moves.**

> Built for Namespace Hackathon AH6926 • Neo4j Track • Render Workflows Track

---

## The Problem

Platforms verify individual merchants at onboarding. They check if *this* email is valid, if *this* bank account is real. But they miss the pattern: **Merchant A shares a device with Merchant B, who routes payouts to the same bank account as flagged Merchant C.** Flat SQL checks can't see the graph.

## The Solution

Vanguard Graph connects every signal into a Neo4j knowledge graph — devices, IPs, bank accounts, emails, phones — then traverses second-degree connections to detect coordinated fraud rings that individual checks would miss. An AI investigator translates graph findings into plain-language risk memos. Render Workflows powers the durable investigation pipeline.

---

## Features

- **Ring Replay** — Visual timeline of how a fraud ring assembled. See each merchant join, each shared device appear, each bank account link.
- **Explainable AI Risk Memo** — Converts raw Cypher output into readable investigator notes: *"Merchant shares device D-773 with 4 others. Two route to bank account #4421, already linked to a confirmed fraud case."*
- **Path Explorer** — Click any merchant node. Graph highlights direct and second-degree connections.
- **Interactive Graph Visualization** — Canvas-based graph renderer for exploring fraud networks.
- **Automated Workflows** — Render Workflows for merchant onboarding investigation and payout-change re-evaluation.
- **Real-time Alerts Dashboard** — Monitor active alerts, risk distribution, and alert trends.
- **Offline-First Demo** — Every page falls back to comprehensive mock data when the backend is unavailable.

---

## Demo Credentials

| Email | Password | Role | User ID |
|-------|----------|------|---------|
| `admin@vanguard.com` | `admin123` | `admin` | `usr-001` |
| `analyst@vanguard.com` | `analyst123` | `analyst` | `usr-002` |

The login page pre-fills `admin@vanguard.com` / `admin123` by default.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16.2.9, React 19.2.4, TypeScript 5, Tailwind CSS v4 |
| **Backend** | Node.js, Express 4.21, TypeScript, Prisma ORM |
| **Graph DB** | Neo4j AuraDB |
| **Relational DB** | PostgreSQL (via Prisma) |
| **Cache / Rate Limiting** | Redis (ioredis + rate-limit-redis) |
| **Workflow Engine** | Render Workflows |
| **AI** | NVIDIA NIM (Llama 3.1 Nemotron 70B) / Mock AI |
| **State Management** | TanStack React Query |
| **UI** | Framer Motion, Lucide React, Radix UI, class-variance-authority |

---

## Quick Start

### Prerequisites

- Node.js v20+
- PostgreSQL (local or Neon)
- Redis (local or Upstash)
- Neo4j AuraDB instance
- NVIDIA NIM API key (optional — mock AI works out of the box)

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd vanguard-graph-

# ─── Backend ───────────────────────────────────────────
cd backend
cp .env.example .env   # fill in your database/redis/neo4j credentials
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed           # seeds 25 merchants, 10 alerts, fraud rings
npm run dev            # starts on :3001

# ─── Frontend (new terminal) ──────────────────────────
cd ../frontend
npm install
npm run dev            # starts on :3002
```

### Access the App

1. Open **http://localhost:3002** in your browser
2. You'll see the marketing landing page
3. Click **"View Dashboard"** or navigate to **/dashboard**
4. You'll be redirected to **/login**
5. Sign in with the demo credentials above
6. Explore the dashboard, alerts, merchants, graph, investigations, and workflows

> **Note**: The frontend can run fully offline using mock data. If the backend is not running, all pages gracefully degrade to realistic simulated data.

---

## How to Use

### 1. Onboard a Merchant

Navigate to **Merchants → Add Merchant** and fill in:
- Business name, email, phone
- Device fingerprint (entered or generated)
- IP address
- Bank account number and IFSC code

On submission, the backend:
- Creates the merchant in PostgreSQL
- Creates entities in Neo4j (merchant → device, IP, bank account edges)
- Runs fraud detection rules (shared device, shared bank, velocity, IP proximity)
- Triggers a Render Workflow for investigation

### 2. Investigate Alerts

Go to **Alerts** to view all triggered alerts. Filter by risk level (low / medium / high) or status (open / under_review / escalated / resolved). Click any alert to investigate.

### 3. Explore the Graph

Navigate to **Graph** to see the interactive knowledge graph. Click any node to inspect its connections. The graph visualizes shared devices, bank accounts, and IPs across merchants.

### 4. Review Investigations

Go to **Investigations** to see active investigations. Each investigation includes:
- **Ring Replay** — Step-by-step timeline of how the fraud ring assembled
- **Risk Memo** — AI-generated plain-language summary of findings
- **Evidence Panel** — Key evidence items with risk scores

### 5. Monitor Workflows

Go to **Workflows** to see durable async pipelines. Each workflow tracks the investigation lifecycle: queued → running → scoring → generating_memo → completed / failed.

---

## Project Structure

```
vanguard-graph/
├── frontend/                    # Next.js Frontend (v2 — full-featured)
│   ├── app/                     # App Router pages
│   │   ├── (marketing)/         # Public pages (landing, docs, pricing)
│   │   ├── (dashboard)/         # Protected pages (dashboard, alerts, etc.)
│   │   ├── api/                 # Next.js API routes (auth, health)
│   │   ├── login/               # Login page
│   │   ├── layout.tsx           # Root layout with AuthProvider
│   │   ├── tailwind.css         # Tailwind v4 CSS
│   │   ├── globals.css          # Global styles
│   │   ├── error.tsx            # Error boundary
│   │   ├── loading.tsx          # Loading state
│   │   └── not-found.tsx        # 404 page
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # card, table, badge, button, skeleton
│   │   ├── shared/              # stat-card, page-header
│   │   └── charts/              # alert-trend-chart, risk-distribution-chart
│   ├── features/                # Feature-based modules
│   │   ├── dashboard/           # api, hooks, types
│   │   ├── alerts/              # api, hooks, types, utils
│   │   └── workflows/           # api, hooks, types
│   ├── hooks/                   # Shared hooks
│   ├── lib/                     # Utilities
│   │   ├── auth-context.tsx     # Auth provider (login/logout/token)
│   │   ├── api-client.ts        # Axios instance with JWT interceptor
│   │   └── mock-data.ts        # Comprehensive demo data (20 merchants,
│   │                           #   10 alerts, 2 investigations, graph data)
│   ├── proxy.ts                 # Next.js middleware (auth guard)
│   └── next.config.ts
│
├── backend/                     # Express Backend
│   ├── src/
│   │   ├── server.ts            # Entry point
│   │   ├── app.ts               # Express app (middleware, routes)
│   │   ├── config/              # Env, logger, Prisma, Redis
│   │   ├── middleware/          # auth, rate-limit, error, request-id
│   │   ├── routes/              # merchants, alerts, workflows, graph, health
│   │   ├── modules/             # Feature modules (controller, service, repo)
│   │   │   ├── merchants/
│   │   │   ├── alerts/
│   │   │   ├── workflows/
│   │   │   ├── graph/
│   │   │   └── risk/
│   │   ├── services/            # AI, Neo4j, Enrichment, Notifications, Render
│   │   ├── fraud-core/          # Detection rules + scoring engine
│   │   │   ├── detection/       # shared-device, shared-bank, velocity, etc.
│   │   │   └── scoring/         # calculate-risk-score, explain-score, weights
│   │   ├── workflows/           # Render Workflows (onboarding, payout-change)
│   │   ├── seeds/               # Seed data (merchants, fraud cases, graph)
│   │   └── shared/              # Errors, constants, types
│   └── tests/
│
├── docs/                        # Project documentation
│   ├── api-reference.md
│   ├── graph-model.md
│   ├── workflow-design.md
│   ├── ai-integration.md
│   └── deployment.md
│
├── README.md
├── ARCHITECTURE.md
├── LICENSE
├── .gitignore
└── package.json                  # (legacy v1 frontend — see note below)
```

> **Note**: The root directory also includes a simpler v1 Next.js app (`app/`, `lib/`). The primary frontend is the one in `frontend/`. The v1 version has minimal pages without auth or the full feature set.

---

## Architecture

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for detailed architecture diagrams (authentication flow, data flow, fraud detection pipeline, system architecture).

---

## Authentication Flow

1. **Login** — User submits credentials at `/login`
2. **API Route** — `POST /api/auth/login` validates against hardcoded credentials, returns a mock JWT, and sets an httpOnly `vg_auth_token` cookie
3. **Client Storage** — The token is stored in `localStorage` and a non-httpOnly cookie is set for middleware checks
4. **Middleware Guard** — `proxy.ts` checks for the cookie on every protected route request; redirects to `/login` if absent
5. **Backend Auth** — The Express API also requires `Authorization: Bearer <token>` for non-public routes
6. **Logout** — Clears localStorage, cookie, and redirects to `/`

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/merchants` | — | Create a merchant |
| `GET` | `/api/v1/merchants` | — | List merchants |
| `GET` | `/api/v1/merchants/:id` | — | Get merchant by ID |
| `PATCH` | `/api/v1/merchants/:id` | — | Update merchant |
| `POST` | `/api/v1/merchants/:id/payout-change` | — | Trigger payout change workflow |
| `GET` | `/api/v1/alerts` | — | List alerts |
| `GET` | `/api/v1/alerts/:id` | — | Get alert by ID |
| `PATCH` | `/api/v1/alerts/:id/status` | — | Update alert status |
| `GET` | `/api/v1/workflows` | ✓ | List workflow runs |
| `POST` | `/api/v1/workflows/trigger` | ✓ | Trigger a workflow |
| `GET` | `/api/v1/graph/fraud-rings` | ✓ | Find fraud rings |
| `GET` | `/api/v1/graph/path` | ✓ | Find connection path |
| `GET` | `/api/v1/health` | — | System health check |

Full docs at [`docs/api-reference.md`](docs/api-reference.md).

---

## License

MIT — see [`LICENSE`](LICENSE).

---

## Team

| Name | Role |
|------|------|
| Krrish | Frontend + Core Backend (Server, Merchants, Alerts) + Docs |
| Anurag | Neo4j Graph Schema + Fraud Detection Rules + Risk Scoring + Backend APIs |
| Naitik | Render Workflows + AI Layer + Enrichment Services |
| Shreya | Full Frontend (all pages, components, features) |

---

## Hackathon Tracks

| Track | How We Use It |
|-------|---------------|
| ✅ **Neo4j AuraDB** | Knowledge graph of merchants, devices, bank accounts, IPs — Cypher queries detect shared entities and multihop fraud patterns |
| ✅ **Render Workflows** | Durable async pipelines for merchant onboarding investigation and payout-change re-evaluation — retry-safe, checkpoint-recoverable |
