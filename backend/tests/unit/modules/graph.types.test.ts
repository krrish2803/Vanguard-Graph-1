import { describe, it, expect } from 'vitest'
import { NodeType } from '../../../src/modules/graph/graph.types'

describe('NodeType', () => {
  it('has all entity types', () => {
    expect(NodeType.TRANSACTION).toBe('Transaction')
    expect(NodeType.ACCOUNT).toBe('Account')
    expect(NodeType.DEVICE).toBe('Device')
    expect(NodeType.IP).toBe('IpAddress')
    expect(NodeType.MERCHANT).toBe('Merchant')
    expect(NodeType.BANK_ACCOUNT).toBe('BankAccount')
  })
})
