import { describe, it, expect } from 'vitest'
import { CreateMerchantSchema, UpdateMerchantSchema, MerchantQuerySchema, PayoutChangeSchema } from '../../../src/modules/merchants/merchants.schemas'

const validMerchant = {
  name: 'Test Merchant',
  email: 'test@example.com',
  phone: '1234567890',
  deviceFingerprint: 'FP-ABC-123',
  ipAddress: '192.168.1.1',
  bankAccountNumber: '1234567890',
  bankAccountIfsc: 'HDFC0001234',
}

describe('CreateMerchantSchema', () => {
  it('accepts valid input', () => {
    const result = CreateMerchantSchema.safeParse(validMerchant)
    expect(result.success).toBe(true)
  })

  it('rejects missing name', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects name exceeding 200 chars', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, name: 'x'.repeat(201) })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects phone not 10 digits', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, phone: '12345' })
    expect(result.success).toBe(false)
  })

  it('rejects non-numeric phone', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, phone: 'abcdefghij' })
    expect(result.success).toBe(false)
  })

  it('rejects missing device fingerprint', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, deviceFingerprint: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid IPv4 address', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, ipAddress: '999.999.999.999' })
    expect(result.success).toBe(false)
  })

  it('rejects non-IP string', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, ipAddress: 'not-an-ip' })
    expect(result.success).toBe(false)
  })

  it('rejects missing bank account number', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, bankAccountNumber: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid IFSC code format', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, bankAccountIfsc: 'INVALID' })
    expect(result.success).toBe(false)
  })

  it('rejects IFSC without leading letters', () => {
    const result = CreateMerchantSchema.safeParse({ ...validMerchant, bankAccountIfsc: '1234001234' })
    expect(result.success).toBe(false)
  })
})

describe('UpdateMerchantSchema', () => {
  it('accepts partial update with name only', () => {
    const result = UpdateMerchantSchema.safeParse({ name: 'New Name' })
    expect(result.success).toBe(true)
  })

  it('accepts empty object (no fields required)', () => {
    const result = UpdateMerchantSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts full valid update', () => {
    const result = UpdateMerchantSchema.safeParse({
      name: 'Updated',
      email: 'updated@example.com',
      phone: '9876543210',
      status: 'approved',
      riskScore: 85,
      riskLevel: 'high',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid status', () => {
    const result = UpdateMerchantSchema.safeParse({ status: 'invalid_status' })
    expect(result.success).toBe(false)
  })

  it('rejects riskScore out of range', () => {
    const result = UpdateMerchantSchema.safeParse({ riskScore: 150 })
    expect(result.success).toBe(false)
  })

  it('rejects negative riskScore', () => {
    const result = UpdateMerchantSchema.safeParse({ riskScore: -5 })
    expect(result.success).toBe(false)
  })
})

describe('MerchantQuerySchema', () => {
  it('provides defaults for empty query', () => {
    const result = MerchantQuerySchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.limit).toBe(20)
    }
  })

  it('accepts valid query params', () => {
    const result = MerchantQuerySchema.safeParse({ page: '2', limit: '10', status: 'pending', riskLevel: 'high', search: 'test' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(2)
      expect(result.data.limit).toBe(10)
    }
  })

  it('rejects limit exceeding max', () => {
    const result = MerchantQuerySchema.safeParse({ limit: '200' })
    expect(result.success).toBe(false)
  })

  it('rejects page 0', () => {
    const result = MerchantQuerySchema.safeParse({ page: '0' })
    expect(result.success).toBe(false)
  })
})

describe('PayoutChangeSchema', () => {
  it('accepts valid payout change', () => {
    const result = PayoutChangeSchema.safeParse({
      newBankAccountNumber: '9988776655',
      newBankAccountIfsc: 'ICIC0001234',
      reason: 'Upgraded to business account',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing reason', () => {
    const result = PayoutChangeSchema.safeParse({
      newBankAccountNumber: '9988776655',
      newBankAccountIfsc: 'ICIC0001234',
      reason: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects reason exceeding 500 chars', () => {
    const result = PayoutChangeSchema.safeParse({
      newBankAccountNumber: '9988776655',
      newBankAccountIfsc: 'ICIC0001234',
      reason: 'x'.repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid IFSC in payout change', () => {
    const result = PayoutChangeSchema.safeParse({
      newBankAccountNumber: '9988776655',
      newBankAccountIfsc: 'bad-ifsc',
      reason: 'Test reason',
    })
    expect(result.success).toBe(false)
  })
})
