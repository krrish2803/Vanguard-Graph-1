export function buildNextActionPrompt(input: {
  businessName: string
  merchantId: string
  riskScore: number
  riskLevel: string
  graphLinks?: Record<string, unknown>[]
  enrichment?: Record<string, unknown>
}): string {
  return `You are a fraud operations specialist reviewing a merchant onboarding.

Merchant: "${input.businessName}" (ID: ${input.merchantId})
Risk Score: ${input.riskScore}/${100}
Risk Level: ${input.riskLevel}

${input.graphLinks ? `Graph Connections:\n${JSON.stringify(input.graphLinks, null, 2)}\n` : ''}
${input.enrichment ? `Enrichment Data:\n${JSON.stringify(input.enrichment, null, 2)}\n` : ''}

Based on the above, what is the recommended next action?
Choose one: APPROVE | REVIEW | BLOCK
Provide a brief rationale (2-3 sentences).
`
}
