export interface DashboardStats {
  totalMerchants: number
  activeAlerts: number
  fraudRingsDetected: number
  amountAtRisk: number
  merchantTrend: string
  alertTrend: string
  ringTrend: string
  riskTrend: string
}

export interface AlertTrendItem {
  date: string
  low: number
  medium: number
  high: number
}

export interface RiskDistributionItem {
  name: string
  value: number
  color: string
}
