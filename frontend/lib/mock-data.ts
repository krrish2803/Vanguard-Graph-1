export type RiskLevel = "low" | "medium" | "high"
export type MerchantStatus = "pending" | "approved" | "under_review" | "blocked"
export type AlertStatus = "open" | "under_review" | "resolved" | "escalated"
export type WorkflowStatus = "queued" | "running" | "scoring" | "generating_memo" | "completed" | "failed"
export type WorkflowType = "kyc_review" | "payout_change" | "periodic_review"

export interface Merchant {
  id: string
  name: string
  email: string
  phone: string
  deviceFingerprint: string
  ipAddress: string
  bankAccountNumber: string
  bankAccountIfsc: string
  status: MerchantStatus
  riskScore: number
  riskLevel: RiskLevel
  createdAt: string
}

export interface Alert {
  id: string
  merchantId: string
  merchantName: string
  riskScore: number
  riskLevel: RiskLevel
  status: AlertStatus
  summary: string
  createdAt: string
}

export interface Investigation {
  id: string
  merchantId: string
  merchantName: string
  riskScore: number
  riskLevel: RiskLevel
  status: string
  memo: string
  evidence: EvidenceItem[]
  timeline: TimelineEvent[]
  createdAt: string
}

export interface EvidenceItem {
  type: string
  value: string
  sharedWith: number
  suspicious: boolean
}

export interface TimelineEvent {
  step: number
  title: string
  detail: string
  severity: "info" | "warning" | "danger"
}

export interface GraphNode {
  id: string
  label: string
  type: "Merchant" | "Device" | "BankAccount" | "IPAddress" | "Email" | "FraudCase"
  riskScore?: number
  riskLevel?: RiskLevel
}

export interface GraphLink {
  source: string
  target: string
  label: string
  suspicious: boolean
}

export interface WorkflowRun {
  id: string
  merchantId: string
  merchantName: string
  workflowType: WorkflowType
  status: WorkflowStatus
  duration: string
  createdAt: string
}

const now = new Date()

function daysAgo(days: number): string {
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export const mockMerchants: Merchant[] = [
  { id: "M-001", name: "Rajesh Kumar Traders", email: "rajesh@rktraders.com", phone: "9876543210", deviceFingerprint: "D-773", ipAddress: "192.168.1.45", bankAccountNumber: "****4421", bankAccountIfsc: "HDFC0001234", status: "under_review", riskScore: 87, riskLevel: "high", createdAt: daysAgo(2) },
  { id: "M-002", name: "Singh Electronics", email: "singh@elec.in", phone: "9876543211", deviceFingerprint: "D-773", ipAddress: "192.168.1.46", bankAccountNumber: "****4421", bankAccountIfsc: "HDFC0001234", status: "under_review", riskScore: 92, riskLevel: "high", createdAt: daysAgo(3) },
  { id: "M-003", name: "Patel General Store", email: "patel@gs.com", phone: "9876543212", deviceFingerprint: "D-773", ipAddress: "10.0.0.1", bankAccountNumber: "****7832", bankAccountIfsc: "ICIC0005678", status: "blocked", riskScore: 95, riskLevel: "high", createdAt: daysAgo(4) },
  { id: "M-004", name: "Verma Enterprises", email: "verma@ent.com", phone: "9876543213", deviceFingerprint: "D-773", ipAddress: "192.168.1.47", bankAccountNumber: "****4421", bankAccountIfsc: "HDFC0001234", status: "blocked", riskScore: 88, riskLevel: "high", createdAt: daysAgo(5) },
  { id: "M-005", name: "Gupta Furnishings", email: "gupta@furnish.com", phone: "9876543214", deviceFingerprint: "D-773", ipAddress: "10.0.0.2", bankAccountNumber: "****1156", bankAccountIfsc: "AXIS0009012", status: "under_review", riskScore: 76, riskLevel: "high", createdAt: daysAgo(1) },
  { id: "M-006", name: "Joshi Textiles", email: "joshi@textiles.in", phone: "9876543215", deviceFingerprint: "D-441", ipAddress: "172.16.0.1", bankAccountNumber: "****4421", bankAccountIfsc: "HDFC0001234", status: "under_review", riskScore: 65, riskLevel: "medium", createdAt: daysAgo(6) },
  { id: "M-007", name: "Desai Provisions", email: "desai@prov.com", phone: "9876543216", deviceFingerprint: "D-441", ipAddress: "172.16.0.2", bankAccountNumber: "****3398", bankAccountIfsc: "SBIN0004455", status: "pending", riskScore: 54, riskLevel: "medium", createdAt: daysAgo(7) },
  { id: "M-008", name: "Mehta Distributors", email: "mehta@dist.com", phone: "9876543217", deviceFingerprint: "D-889", ipAddress: "192.168.2.1", bankAccountNumber: "****7724", bankAccountIfsc: "KOTK0007788", status: "approved", riskScore: 42, riskLevel: "medium", createdAt: daysAgo(8) },
  { id: "M-009", name: "Sharma Book Depot", email: "sharma@books.in", phone: "9876543218", deviceFingerprint: "D-889", ipAddress: "192.168.2.2", bankAccountNumber: "****5512", bankAccountIfsc: "KOTK0007788", status: "pending", riskScore: 48, riskLevel: "medium", createdAt: daysAgo(3) },
  { id: "M-010", name: "Khan Auto Parts", email: "khan@autoparts.com", phone: "9876543219", deviceFingerprint: "D-554", ipAddress: "10.10.10.1", bankAccountNumber: "****2233", bankAccountIfsc: "HDFC0009876", status: "approved", riskScore: 25, riskLevel: "low", createdAt: daysAgo(10) },
  { id: "M-011", name: "Reddy Pharma", email: "reddy@pharma.in", phone: "9876543220", deviceFingerprint: "D-554", ipAddress: "10.10.10.2", bankAccountNumber: "****2233", bankAccountIfsc: "HDFC0009876", status: "approved", riskScore: 18, riskLevel: "low", createdAt: daysAgo(12) },
  { id: "M-012", name: "Agarwal Sweets", email: "agarwal@sweets.com", phone: "9876543221", deviceFingerprint: "D-331", ipAddress: "192.168.3.1", bankAccountNumber: "****9988", bankAccountIfsc: "ICIC0003344", status: "approved", riskScore: 12, riskLevel: "low", createdAt: daysAgo(15) },
  { id: "M-013", name: "Iyer IT Solutions", email: "iyer@itsol.com", phone: "9876543222", deviceFingerprint: "D-331", ipAddress: "192.168.3.2", bankAccountNumber: "****9988", bankAccountIfsc: "ICIC0003344", status: "approved", riskScore: 8, riskLevel: "low", createdAt: daysAgo(20) },
  { id: "M-014", name: "Nair Exports", email: "nair@exports.co", phone: "9876543223", deviceFingerprint: "D-221", ipAddress: "172.20.0.1", bankAccountNumber: "****6654", bankAccountIfsc: "SBIN0001122", status: "pending", riskScore: 5, riskLevel: "low", createdAt: daysAgo(1) },
  { id: "M-015", name: "Das Trading Co", email: "das@trading.com", phone: "9876543224", deviceFingerprint: "D-221", ipAddress: "172.20.0.2", bankAccountNumber: "****6654", bankAccountIfsc: "SBIN0001122", status: "pending", riskScore: 3, riskLevel: "low", createdAt: daysAgo(0) },
  { id: "M-016", name: "Bose Agro Farms", email: "bose@agro.in", phone: "9876543225", deviceFingerprint: "D-101", ipAddress: "10.20.30.1", bankAccountNumber: "****4477", bankAccountIfsc: "AXIS0005566", status: "pending", riskScore: 72, riskLevel: "high", createdAt: daysAgo(0) },
  { id: "M-017", name: "Chopra Mart", email: "chopra@mart.com", phone: "9876543226", deviceFingerprint: "D-101", ipAddress: "10.20.30.2", bankAccountNumber: "****4477", bankAccountIfsc: "AXIS0005566", status: "approved", riskScore: 35, riskLevel: "medium", createdAt: daysAgo(14) },
  { id: "M-018", name: "Malik Stationers", email: "malik@stationers.in", phone: "9876543227", deviceFingerprint: "D-664", ipAddress: "192.168.4.1", bankAccountNumber: "****3322", bankAccountIfsc: "HDFC0005544", status: "approved", riskScore: 15, riskLevel: "low", createdAt: daysAgo(30) },
  { id: "M-019", name: "Tiwari Garments", email: "tiwari@garments.com", phone: "9876543228", deviceFingerprint: "D-664", ipAddress: "192.168.4.2", bankAccountNumber: "****3322", bankAccountIfsc: "HDFC0005544", status: "approved", riskScore: 10, riskLevel: "low", createdAt: daysAgo(25) },
  { id: "M-020", name: "Pandey Wholesale", email: "pandey@wholesale.in", phone: "9876543229", deviceFingerprint: "D-999", ipAddress: "10.30.40.1", bankAccountNumber: "****1199", bankAccountIfsc: "ICIC0009988", status: "pending", riskScore: 0, riskLevel: "low", createdAt: daysAgo(0) },
]

export const mockAlerts: Alert[] = [
  { id: "A-001", merchantId: "M-001", merchantName: "Rajesh Kumar Traders", riskScore: 87, riskLevel: "high", status: "open", summary: "Shared device D-773 with 4 known fraudulent merchants. Bank account matches 2 prior chargeback entities.", createdAt: daysAgo(2) },
  { id: "A-002", merchantId: "M-003", merchantName: "Patel General Store", riskScore: 95, riskLevel: "high", status: "escalated", summary: "Device D-773 linked to 5 merchants with chargeback rate >40%. Bank account flagged in previous ring.", createdAt: daysAgo(4) },
  { id: "A-003", merchantId: "M-005", merchantName: "Gupta Furnishings", riskScore: 76, riskLevel: "high", status: "open", summary: "New merchant with shared device D-773. Email pattern matches known fraud template.", createdAt: daysAgo(1) },
  { id: "A-004", merchantId: "M-006", merchantName: "Joshi Textiles", riskScore: 65, riskLevel: "medium", status: "under_review", summary: "Bank account ****4421 shared with 3 high-risk merchants. Device D-441 seen once before.", createdAt: daysAgo(6) },
  { id: "A-005", merchantId: "M-007", merchantName: "Desai Provisions", riskScore: 54, riskLevel: "medium", status: "under_review", summary: "Device D-441 linked to medium-risk merchant Joshi Textiles. Unusual onboarding pattern detected.", createdAt: daysAgo(7) },
  { id: "A-006", merchantId: "M-008", merchantName: "Mehta Distributors", riskScore: 42, riskLevel: "medium", status: "open", summary: "Moderate risk score. Device D-889 shared with one other merchant. No direct fraud link.", createdAt: daysAgo(8) },
  { id: "A-007", merchantId: "M-009", merchantName: "Sharma Book Depot", riskScore: 48, riskLevel: "medium", status: "open", summary: "Shares device D-889 with Mehta Distributors. IP geolocation mismatch with business address.", createdAt: daysAgo(3) },
  { id: "A-008", merchantId: "M-016", merchantName: "Bose Agro Farms", riskScore: 72, riskLevel: "high", status: "open", summary: "Device D-101 linked to Chopra Mart (approved). High-risk due to rapid merchant creation velocity.", createdAt: daysAgo(0) },
  { id: "A-009", merchantId: "M-010", merchantName: "Khan Auto Parts", riskScore: 25, riskLevel: "low", status: "resolved", summary: "Minor risk flags. Device D-554 shared with one trusted merchant. No action needed.", createdAt: daysAgo(10) },
  { id: "A-010", merchantId: "M-012", merchantName: "Agarwal Sweets", riskScore: 12, riskLevel: "low", status: "resolved", summary: "Clean onboarding. Device D-331 shared with established merchant. Routine pass.", createdAt: daysAgo(15) },
]

export const mockInvestigations: Investigation[] = [
  {
    id: "INV-001",
    merchantId: "M-001",
    merchantName: "Rajesh Kumar Traders",
    riskScore: 87,
    riskLevel: "high",
    status: "in_progress",
    memo: "EMERGENCY: This merchant is part of an active fraud ring. Device D-773 has been used by 4 other merchants (M-002, M-003, M-004, M-005), all with risk scores above 75. Bank account ****4421 (HDFC) is shared with 3 of these merchants. The pattern suggests a coordinated device farm operation. Recommended action: IMMEDIATE BLOCK. All merchants sharing D-773 should be flagged for simultaneous investigation.",
    evidence: [
      { type: "Device", value: "D-773", sharedWith: 4, suspicious: true },
      { type: "Bank Account", value: "****4421 (HDFC)", sharedWith: 3, suspicious: true },
      { type: "IP Address", value: "192.168.1.45", sharedWith: 2, suspicious: true },
      { type: "Email Domain", value: "@rktraders.com", sharedWith: 0, suspicious: false },
    ],
    timeline: [
      { step: 1, title: "Merchant M-001 created", detail: "Signals collected: device, IP, bank, email", severity: "info" },
      { step: 2, title: "Device D-773 linked — shared with 4 prior merchants", detail: "3 of 4 merchants have risk >75 and active alerts", severity: "warning" },
      { step: 3, title: "Bank account ****4421 linked — shared with 3 prior merchants", detail: "2 of 3 merchants flagged for high chargeback rate", severity: "danger" },
      { step: 4, title: "IP 192.168.1.x subnet — matches 2 flagged merchants", detail: "Same /24 subnet as M-002 and M-004", severity: "warning" },
      { step: 5, title: "Risk escalated: Medium → High", detail: "Threshold exceeded: 3+ shared suspicious entities", severity: "danger" },
    ],
    createdAt: daysAgo(2),
  },
  {
    id: "INV-002",
    merchantId: "M-006",
    merchantName: "Joshi Textiles",
    riskScore: 65,
    riskLevel: "medium",
    status: "in_progress",
    memo: "RISK REVIEW NEEDED: This merchant shares bank account ****4421 with 3 high-risk merchants (M-001, M-002, M-004). However, their device D-441 is unique with only one connection to a medium-risk merchant. The bank account connection is concerning but device fingerprint is clean. Recommended action: Send to manual review. Investigate relationship with bank account holders.",
    evidence: [
      { type: "Bank Account", value: "****4421 (HDFC)", sharedWith: 3, suspicious: true },
      { type: "Device", value: "D-441", sharedWith: 1, suspicious: false },
      { type: "IP Address", value: "172.16.0.1", sharedWith: 1, suspicious: false },
    ],
    timeline: [
      { step: 1, title: "Merchant M-006 created", detail: "Signals collected for investigation", severity: "info" },
      { step: 2, title: "Bank account ****4421 flagged", detail: "Same account used by 3 high-risk merchants", severity: "warning" },
      { step: 3, title: "Device D-441 — clean (1 connection)", detail: "Low risk device fingerprint", severity: "info" },
      { step: 4, title: "Medium risk score assigned", detail: "Mixed signals — bank suspicious, device clean", severity: "warning" },
    ],
    createdAt: daysAgo(6),
  },
]

export const mockGraphData: { nodes: GraphNode[]; links: GraphLink[] } = {
  nodes: [
    { id: "M-001", label: "Rajesh Kumar", type: "Merchant", riskScore: 87, riskLevel: "high" },
    { id: "M-002", label: "Singh Electronics", type: "Merchant", riskScore: 92, riskLevel: "high" },
    { id: "M-003", label: "Patel General Store", type: "Merchant", riskScore: 95, riskLevel: "high" },
    { id: "M-004", label: "Verma Enterprises", type: "Merchant", riskScore: 88, riskLevel: "high" },
    { id: "M-005", label: "Gupta Furnishings", type: "Merchant", riskScore: 76, riskLevel: "high" },
    { id: "M-006", label: "Joshi Textiles", type: "Merchant", riskScore: 65, riskLevel: "medium" },
    { id: "M-007", label: "Desai Provisions", type: "Merchant", riskScore: 54, riskLevel: "medium" },
    { id: "M-016", label: "Bose Agro Farms", type: "Merchant", riskScore: 72, riskLevel: "high" },
    { id: "M-010", label: "Khan Auto Parts", type: "Merchant", riskScore: 25, riskLevel: "low" },
    { id: "M-012", label: "Agarwal Sweets", type: "Merchant", riskScore: 12, riskLevel: "low" },
    { id: "D-773", label: "Device D-773", type: "Device" },
    { id: "D-441", label: "Device D-441", type: "Device" },
    { id: "D-554", label: "Device D-554", type: "Device" },
    { id: "BA-4421", label: "Bank ****4421", type: "BankAccount" },
    { id: "BA-7832", label: "Bank ****7832", type: "BankAccount" },
    { id: "BA-2233", label: "Bank ****2233", type: "BankAccount" },
    { id: "IP-1", label: "192.168.1.x", type: "IPAddress" },
    { id: "IP-2", label: "10.0.0.x", type: "IPAddress" },
    { id: "IP-3", label: "172.16.0.x", type: "IPAddress" },
    { id: "FC-1", label: "Fraud Ring Alpha", type: "FraudCase" },
  ],
  links: [
    { source: "M-001", target: "D-773", label: "uses_device", suspicious: false },
    { source: "M-002", target: "D-773", label: "uses_device", suspicious: false },
    { source: "M-003", target: "D-773", label: "uses_device", suspicious: false },
    { source: "M-004", target: "D-773", label: "uses_device", suspicious: false },
    { source: "M-005", target: "D-773", label: "uses_device", suspicious: false },
    { source: "M-001", target: "BA-4421", label: "has_bank", suspicious: false },
    { source: "M-002", target: "BA-4421", label: "has_bank", suspicious: false },
    { source: "M-004", target: "BA-4421", label: "has_bank", suspicious: false },
    { source: "M-006", target: "BA-4421", label: "has_bank", suspicious: true },
    { source: "M-001", target: "IP-1", label: "connects_from", suspicious: false },
    { source: "M-002", target: "IP-1", label: "connects_from", suspicious: false },
    { source: "M-004", target: "IP-1", label: "connects_from", suspicious: false },
    { source: "M-003", target: "IP-2", label: "connects_from", suspicious: false },
    { source: "M-005", target: "IP-2", label: "connects_from", suspicious: false },
    { source: "M-006", target: "IP-3", label: "connects_from", suspicious: false },
    { source: "M-007", target: "IP-3", label: "connects_from", suspicious: false },
    { source: "M-016", target: "D-441", label: "uses_device", suspicious: false },
    { source: "M-010", target: "D-554", label: "uses_device", suspicious: false },
    { source: "M-010", target: "BA-2233", label: "has_bank", suspicious: false },
    { source: "D-773", target: "FC-1", label: "part_of_ring", suspicious: true },
    { source: "BA-4421", target: "FC-1", label: "part_of_ring", suspicious: true },
  ],
}

export const mockWorkflowRuns: WorkflowRun[] = [
  { id: "WR-001", merchantId: "M-001", merchantName: "Rajesh Kumar Traders", workflowType: "kyc_review", status: "scoring", duration: "1m 23s", createdAt: daysAgo(0) },
  { id: "WR-002", merchantId: "M-016", merchantName: "Bose Agro Farms", workflowType: "kyc_review", status: "running", duration: "45s", createdAt: daysAgo(0) },
  { id: "WR-003", merchantId: "M-005", merchantName: "Gupta Furnishings", workflowType: "payout_change", status: "generating_memo", duration: "2m 10s", createdAt: daysAgo(1) },
  { id: "WR-004", merchantId: "M-006", merchantName: "Joshi Textiles", workflowType: "periodic_review", status: "completed", duration: "4m 32s", createdAt: daysAgo(6) },
  { id: "WR-005", merchantId: "M-003", merchantName: "Patel General Store", workflowType: "kyc_review", status: "completed", duration: "3m 15s", createdAt: daysAgo(4) },
  { id: "WR-006", merchantId: "M-007", merchantName: "Desai Provisions", workflowType: "kyc_review", status: "queued", duration: "—", createdAt: daysAgo(0) },
  { id: "WR-007", merchantId: "M-009", merchantName: "Sharma Book Depot", workflowType: "periodic_review", status: "failed", duration: "1m 05s", createdAt: daysAgo(3) },
]

export const mockDashboardStats = {
  totalMerchants: 247,
  activeAlerts: 23,
  fraudRingsDetected: 8,
  amountAtRisk: 42000000,
  merchantTrend: "+12",
  alertTrend: "+8",
  ringTrend: "+2",
  riskTrend: "+15",
}

export const mockAlertTrendData = [
  { date: "Mon", low: 2, medium: 4, high: 1 },
  { date: "Tue", low: 1, medium: 3, high: 2 },
  { date: "Wed", low: 3, medium: 5, high: 3 },
  { date: "Thu", low: 2, medium: 2, high: 4 },
  { date: "Fri", low: 1, medium: 4, high: 2 },
  { date: "Sat", low: 0, medium: 3, high: 1 },
  { date: "Sun", low: 2, medium: 4, high: 3 },
]

export const mockRiskDistribution = [
  { name: "Low", value: 45, color: "#10B981" },
  { name: "Medium", value: 32, color: "#F59E0B" },
  { name: "High", value: 23, color: "#EF4444" },
]
