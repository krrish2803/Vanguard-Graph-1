export function getAlertCountByRisk(alerts: { riskLevel: string }[]) {
  const high = alerts.filter((a) => a.riskLevel === "high").length
  const medium = alerts.filter((a) => a.riskLevel === "medium").length
  const low = alerts.filter((a) => a.riskLevel === "low").length
  return { high, medium, low }
}

export function getAlertCountByStatus(alerts: { status: string }[]) {
  const counts: Record<string, number> = {}
  for (const a of alerts) {
    counts[a.status] = (counts[a.status] || 0) + 1
  }
  return counts
}
