# Vanguard Graph — Architecture

This document describes the system architecture using mermaid diagrams for the Vanguard Graph fraud coordination intelligence engine.

---

## 1. System Architecture (High-Level)

```mermaid
graph TB
    subgraph Browser["Browser"]
        NextApp["Next.js App (frontend/)"]
        LoginPage["/login"]
        Dashboard["/(dashboard)/*"]
        Marketing["/(marketing)/*"]
    end

    subgraph NextJS["Next.js Layer"]
        Middleware["proxy.ts (Auth Guard)"]
        APIRoutes["/api/auth/*"]
    end

    subgraph Express["Express Backend (:3001)"]
        AuthMiddleware["auth.middleware.ts"]
        RateLimiter["rate-limit.middleware.ts"]
        Routes["/api/v1/*"]
        Modules["Merchants / Alerts / Workflows / Graph / Risk"]
    end

    subgraph Data["Data Layer"]
        PG[("PostgreSQL<br/>(Prisma ORM)")]
        Redis[("Redis<br/>(Cache + Rate Limit)")]
        Neo4j[("Neo4j AuraDB<br/>(Knowledge Graph)")]
    end

    subgraph External["External Services"]
        Render["Render Workflows"]
        AI[("NVIDIA NIM / Mock AI")]
    end

    Browser --> NextApp
    NextApp --> Middleware
    Middleware -->|"cookie check"| APIRoutes
    Middleware -->|"auth ok"| Dashboard
    Middleware -->|"public"| Marketing

    NextApp -->|"REST API"| Express
    Express --> AuthMiddleware
    Express --> RateLimiter
    Express --> Routes
    Routes --> Modules

    Modules --> PG
    Modules --> Redis
    Modules --> Neo4j
    Modules --> Render
    Modules --> AI
```

---

## 2. Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Middleware as proxy.ts
    participant NextAPI as /api/auth
    participant Express as Backend (:3001)

    User->>Browser: Navigate to /dashboard
    Browser->>Middleware: GET /dashboard
    Middleware->>Middleware: Check vg_auth_token cookie
    alt No Cookie
        Middleware->>Browser: 302 Redirect → /login?redirect=%2Fdashboard
        Browser->>User: Show login form
        User->>Browser: Enter credentials & submit
        Browser->>NextAPI: POST /api/auth/login { email, password }
        NextAPI->>NextAPI: Validate against hardcoded creds
        NextAPI->>Browser: 200 { token, user } + Set-Cookie (httpOnly)
        Browser->>Browser: Store token in localStorage
        Browser->>Browser: Set document.cookie (non-httpOnly fallback)
        Browser->>Middleware: Full page navigation → /dashboard
        Middleware->>Middleware: Check vg_auth_token cookie
        alt Cookie Present
            Middleware->>Browser: Allow → Render dashboard
            Browser->>Express: GET /api/v1/merchants + /alerts + /workflows
            Express->>Express: Verify JWT (public routes exempt)
            Express->>Browser: Return data
        end
    else Cookie Present
        Middleware->>Browser: Allow → Render dashboard
    end
```

---

## 3. Merchant Onboarding Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Next.js Frontend
    participant Express as Express API (:3001)
    participant PG as PostgreSQL
    participant Neo4j as Neo4j AuraDB
    participant Render as Render Workflows
    participant AI as AI Service

    User->>Frontend: Fill merchant form
    Frontend->>Express: POST /api/v1/merchants
    Express->>PG: INSERT merchant
    Express->>Neo4j: CREATE merchant node
    Express->>Neo4j: CREATE edges to device/IP/bank nodes
    Express->>Express: Run fraud detection rules

    par Detection Rule
        Express->>Neo4j: Query shared devices
        Express->>Neo4j: Query shared bank accounts
        Express->>Neo4j: Query IP proximity
        Express->>Neo4j: Query velocity
    end

    Express->>Express: Calculate risk score
    Express->>PG: INSERT alert (if threshold exceeded)
    Express->>Render: Trigger investigation workflow

    Render->>AI: Generate ring summary
    AI->>Render: Plain-language memo
    Render->>Neo4j: Update investigation status

    Express->>Frontend: 200 { merchant, alerts, risk_score }
    Frontend->>User: Show success + investigation status
```

---

## 4. Fraud Detection Pipeline

```mermaid
flowchart LR
    Merchant[("New Merchant")] --> Entities["Extract Entities<br/>Device, IP, Bank, Phone, Email"]
    Entities --> Graph["Build Neo4j Edges"]

    Graph --> Rules{"Fraud Detection Rules"}

    Rules -->|"1. Shared Device"| DeviceCheck["Detect other merchants<br/>using same device"]
    Rules -->|"2. Shared Bank"| BankCheck["Detect other merchants<br/>using same bank account"]
    Rules -->|"3. IP Proximity"| IPCheck["Detect IPs sharing<br/>/24 subnet"]
    Rules -->|"4. Velocity"| VelCheck["Check unusual activity<br/>frequency"]

    DeviceCheck --> Scoring["Risk Score Calculator"]
    BankCheck --> Scoring
    IPCheck --> Scoring
    VelCheck --> Scoring

    Scoring -->|"score ≥ threshold"| Alert["Create Alert"]
    Scoring -->|"score < threshold"| Pass["No Action"]

    Alert --> Investigation["Render Workflow Investigation"]
    Investigation --> AI["AI Risk Memo Generation"]
    AI --> Result["Investigation Result<br/>(Escalate / Flag / Clear)"]
```

---

## 5. Data Model (Neo4j Graph)

```mermaid
erDiagram
    MERCHANT ||--o{ DEVICE : "uses"
    MERCHANT ||--o{ BANK_ACCOUNT : "routes_to"
    MERCHANT ||--o{ IP_ADDRESS : "originates_from"
    MERCHANT ||--o{ EMAIL : "has"
    MERCHANT ||--o{ PHONE : "has"
    MERCHANT ||--o{ FRAUD_CASE : "implicated_in"

    DEVICE ||--o{ MERCHANT : "used_by"
    BANK_ACCOUNT ||--o{ MERCHANT : "used_by"
    IP_ADDRESS ||--o{ MERCHANT : "used_by"
```

---

## 6. Frontend Component Tree

```mermaid
graph TB
    Root["RootLayout<br/>(AuthProvider)"] --> Marketing["(marketing)/layout"]
    Root --> Login["/login"]
    Root --> Dashboard["(dashboard)/layout<br/>(QueryClientProvider)"]

    Marketing --> Landing["/ (Landing Page)"]
    Marketing --> Docs["/docs"]
    Marketing --> Pricing["/pricing"]

    Dashboard --> Sidebar["_components/sidebar.tsx"]
    Dashboard --> Topbar["_components/topbar.tsx"]
    Dashboard --> CmdMenu["_components/command-menu.tsx"]

    Dashboard --> DB["/dashboard"]
    Dashboard --> Alerts["/alerts"]
    Dashboard --> Investigations["/investigations"]
    Dashboard --> Merchants["/merchants"]
    Dashboard --> Graph["/graph"]
    Dashboard --> Workflows["/workflows"]
    Dashboard --> Settings["/settings"]

    DB --> StatCards["StatCard × 4"]
    DB --> AlertChart["AlertTrendChart"]
    DB --> RiskChart["RiskDistributionChart"]
    DB --> RecentAlerts["Recent Alerts Table"]
    DB --> ActiveWorkflows["Active Workflows Table"]

    Alerts --> AlertFilters["AlertFilters"]
    Alerts --> AlertsTable["AlertsTable"]

    Merchants --> MerchantsTable["MerchantsTable"]
    Merchants --> MerchantForm["MerchantForm"]
    Merchants --> MerchantProfile["MerchantProfile"]
    Merchants --> LinkedEntities["LinkedEntities"]
    Merchants --> MerchantTimeline["MerchantTimeline"]

    Investigations --> InvTable["InvestigationsTable"]
    Investigations --> RingReplay["RingReplay"]
    Investigations --> RiskMemoCard["RiskMemoCard"]
    Investigations --> EvidencePanel["EvidencePanel"]

    Graph --> GraphCanvas["GraphCanvas"]
    Graph --> NodeDrawer["NodeDrawer"]
    Graph --> GraphLegend["GraphLegend"]

    Workflows --> WorkflowTable["WorkflowRunsTable"]
```

---

## 7. Request Lifecycle

```mermaid
sequenceDiagram
    participant C as Client Browser
    participant N as Next.js (frontend/:3002)
    participant M as proxy.ts (Middleware)
    participant A as Express API (:3001)
    participant D as PostgreSQL / Neo4j

    C->>N: HTTP Request
    N->>M: Run middleware
    alt Public Route
        M->>N: NextResponse.next()
    else Protected Route + No Cookie
        M->>C: 302 Redirect → /login
    else Protected Route + Valid Cookie
        M->>N: NextResponse.next()
    end

    N->>N: React Server Components / Client Components
    C->>A: REST API call (Axios with JWT)
    A->>A: auth.middleware (verify token)
    A->>A: rate-limit check
    A->>D: Query database
    D->>A: Return data
    A->>C: JSON response

    alt Backend Unavailable
        C->>C: Fall back to mock-data.ts
    end
```
