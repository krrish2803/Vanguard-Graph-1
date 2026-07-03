import { describe, it, expect } from 'vitest'
import { RISK_LEVELS, MERCHANT_STATUS, ALERT_STATUS, PAGINATION, WORKFLOW_TYPES } from '../../../src/shared/constants'

describe('RISK_LEVELS', () => {
  it('has low, medium, high', () => {
    expect(RISK_LEVELS.LOW).toBe('low')
    expect(RISK_LEVELS.MEDIUM).toBe('medium')
    expect(RISK_LEVELS.HIGH).toBe('high')
  })
})

describe('MERCHANT_STATUS', () => {
  it('has all merchant statuses', () => {
    expect(MERCHANT_STATUS.PENDING).toBe('pending')
    expect(MERCHANT_STATUS.APPROVED).toBe('approved')
    expect(MERCHANT_STATUS.UNDER_REVIEW).toBe('under_review')
    expect(MERCHANT_STATUS.BLOCKED).toBe('blocked')
  })
})

describe('ALERT_STATUS', () => {
  it('has all alert statuses', () => {
    expect(ALERT_STATUS.OPEN).toBe('open')
    expect(ALERT_STATUS.UNDER_REVIEW).toBe('under_review')
    expect(ALERT_STATUS.RESOLVED).toBe('resolved')
    expect(ALERT_STATUS.ESCALATED).toBe('escalated')
  })
})

describe('PAGINATION', () => {
  it('has default and max values', () => {
    expect(PAGINATION.DEFAULT_PAGE).toBe(1)
    expect(PAGINATION.DEFAULT_LIMIT).toBe(20)
    expect(PAGINATION.MAX_LIMIT).toBe(100)
  })
})

describe('WORKFLOW_TYPES', () => {
  it('has merchant onboarding constant', () => {
    expect(WORKFLOW_TYPES.MERCHANT_ONBOARDING).toBe('merchant-onboarding')
  })
})
