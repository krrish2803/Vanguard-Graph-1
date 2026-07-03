import { describe, it, expect } from 'vitest'
import { analyzeDeviceFingerprint } from '../../../src/services/enrichment/device-fingerprint.service'
import { analyzeIPRisk } from '../../../src/services/enrichment/ip-risk.service'
import { analyzeEmailPattern } from '../../../src/services/enrichment/email-pattern.service'
import { runMockKYC } from '../../../src/services/enrichment/mock-kyc.service'

describe('analyzeDeviceFingerprint', () => {
  it('returns low risk for unknown fingerprint', async () => {
    const result = await analyzeDeviceFingerprint('FP-UNKNOWN')

    expect(result.fingerprint).toBe('FP-UNKNOWN')
    expect(result.seenCount).toBe(0)
    expect(result.linkedMerchantIds).toHaveLength(0)
    expect(result.riskFlags).toHaveLength(0)
  })

  it('flags fingerprint linked to multiple merchants', async () => {
    const result = await analyzeDeviceFingerprint('FP-DEMO-001')

    expect(result.seenCount).toBe(3)
    expect(result.linkedMerchantIds).toEqual(['M-001', 'M-002', 'M-003'])
    expect(result.riskFlags).toContain('DEVICE_SHARED_MULTIPLE_MERCHANTS')
    expect(result.riskFlags).toContain('DEVICE_REUSE_DETECTED')
  })

  it('flags fingerprint linked to 2 merchants', async () => {
    const result = await analyzeDeviceFingerprint('FP-DEMO-002')

    expect(result.seenCount).toBe(2)
    expect(result.riskFlags).toContain('DEVICE_REUSE_DETECTED')
    expect(result.riskFlags).not.toContain('DEVICE_SHARED_MULTIPLE_MERCHANTS')
  })
})

describe('analyzeIPRisk', () => {
  it('returns low risk for normal IP', async () => {
    const result = await analyzeIPRisk('8.8.8.8')

    expect(result.ip).toBe('8.8.8.8')
    expect(result.isProxy).toBe(false)
    expect(result.isVPN).toBe(false)
    expect(result.riskScore).toBe(10)
    expect(result.linkedFraudCases).toBe(0)
  })

  it('flags known proxy IP', async () => {
    const result = await analyzeIPRisk('10.0.0.DEMO-BAD')

    expect(result.isProxy).toBe(true)
    expect(result.riskScore).toBe(80)
    expect(result.linkedFraudCases).toBe(2)
  })

  it('flags known VPN IP', async () => {
    const result = await analyzeIPRisk('192.168.DEMO-VPN')

    expect(result.isVPN).toBe(true)
    expect(result.riskScore).toBe(60)
    expect(result.linkedFraudCases).toBe(1)
  })
})

describe('analyzeEmailPattern', () => {
  it('returns normal for regular email', async () => {
    const result = await analyzeEmailPattern('john@gmail.com')

    expect(result.domain).toBe('gmail.com')
    expect(result.isDisposable).toBe(false)
    expect(result.isFreemail).toBe(true)
    expect(result.patternFlags).toHaveLength(0)
  })

  it('detects disposable email domain', async () => {
    const result = await analyzeEmailPattern('test@mailinator.com')

    expect(result.isDisposable).toBe(true)
    expect(result.patternFlags).toContain('DISPOSABLE_EMAIL')
  })

  it('detects sequential number pattern', async () => {
    const result = await analyzeEmailPattern('merchant12345@outlook.com')

    expect(result.patternFlags).toContain('SEQUENTIAL_NUMBER_PATTERN')
  })

  it('detects both disposable and sequential pattern', async () => {
    const result = await analyzeEmailPattern('fraud123@guerrillamail.com')

    expect(result.isDisposable).toBe(true)
    expect(result.patternFlags).toContain('DISPOSABLE_EMAIL')
    expect(result.patternFlags).toContain('SEQUENTIAL_NUMBER_PATTERN')
  })

  it('handles email without @ symbol', async () => {
    const result = await analyzeEmailPattern('noatsign')

    expect(result.domain).toBe('')
    expect(result.isDisposable).toBe(false)
  })
})

describe('runMockKYC', () => {
  it('passes KYC for clean business name', async () => {
    const result = await runMockKYC('M-001', 'Clean Business Inc')

    expect(result.kycStatus).toBe('PASSED')
    expect(result.idVerified).toBe(true)
    expect(result.watchlistHit).toBe(false)
    expect(result.adverseMedia).toBe(false)
  })

  it('fails KYC for demo-fraud business name', async () => {
    const result = await runMockKYC('M-999', 'demo-fraud enterprises')

    expect(result.kycStatus).toBe('FAILED')
    expect(result.idVerified).toBe(false)
    expect(result.watchlistHit).toBe(true)
    expect(result.adverseMedia).toBe(true)
  })
})
