export function buildRiskMemoPrompt(input: {
  businessName: string
  merchantId: string
  riskScore: number
  riskLevel: string
  enrichmentData?: Record<string, unknown>
  graphData?: Record<string, unknown>
}): string {
  return `You are a compliance officer generating a risk memo.

Merchant: "${input.businessName}" (ID: ${input.merchantId})
Overall Risk Score: ${input.riskScore}/100
Risk Level: ${input.riskLevel}

${
  input.enrichmentData
    ? `Enrichment Findings:\n${JSON.stringify(input.enrichmentData, null, 2)}\n`
    : ''
}
${
  input.graphData
    ? `Graph Analysis:\n${JSON.stringify(input.graphData, null, 2)}`
    : ''
}

Generate a formal risk assessment memo covering:
1. Executive Summary
2. Key Risk Factors
3. Enrichment Findings
4. Graph/Network Analysis
5. Overall Assessment & Recommendation
`
}
