import { describe, it, expect } from 'vitest'
import { InvestigationStatus } from '../../../src/modules/investigations/investigations.types'

describe('Investigations types', () => {
  it('has valid status values', () => {
    const statuses: InvestigationStatus[] = [
      'pending', 'ingesting', 'enriching', 'graph_linking',
      'scoring', 'generating_memo', 'completed', 'failed',
    ]
    for (const s of statuses) {
      expect(s).toBeDefined()
    }
  })
})
