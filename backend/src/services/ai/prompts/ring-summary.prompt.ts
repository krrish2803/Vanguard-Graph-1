export function buildRingSummaryPrompt(input: {
  businessName: string
  merchantId: string
  fraudRingData: { sharedEntityId: string; connectedAccounts: string[]; accountCount: number }
  enrichment?: Record<string, unknown>
}): string {
  return `You are a fraud analyst reviewing a potential fraud ring.

Merchant: "${input.businessName}" (ID: ${input.merchantId})
Shared Entity: ${input.fraudRingData.sharedEntityId}
Connected Accounts: ${input.fraudRingData.connectedAccounts.join(', ')}
Account Count: ${input.fraudRingData.accountCount}

${
  input.enrichment
    ? `Additional Enrichment Data:\n${JSON.stringify(input.enrichment, null, 2)}`
    : ''
}

Please provide a concise fraud ring summary including:
1. The nature of the connection between accounts
2. Risk assessment of the ring
3. Recommended actions
`
}
