import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockRepo = vi.hoisted(() => ({
  getTransactionSubgraph: vi.fn(),
  findFraudRingsBySharedDevice: vi.fn(),
  findConnectionPath: vi.fn(),
}))

vi.mock('../../../src/modules/graph/graph.repository', () => ({
  GraphRepository: vi.fn().mockImplementation(function () { return mockRepo }),
}))

vi.mock('../../../src/config/neo4j', () => ({
  default: vi.fn(),
  getDriver: vi.fn(),
  verifyNeo4jConnection: vi.fn(),
  closeDriver: vi.fn(),
}))

import { GraphService } from '../../../src/modules/graph/graph.service'

function makePathRecord(startId: string, endId: string, relType: string) {
  return {
    get: (key: string) => {
      if (key === 'path') {
        return {
          segments: [
            {
              start: { labels: ['Account'], properties: { id: startId, email: `${startId}@test.com` } },
              end: { labels: ['Device'], properties: { id: endId, deviceId: endId } },
              relationship: {
                type: relType,
                identity: { toString: () => `${startId}-${endId}` },
                start: { toString: () => startId },
                end: { toString: () => endId },
              },
            },
          ],
        }
      }
      return undefined
    },
  }
}

describe('GraphService', () => {
  let service: GraphService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new GraphService(mockRepo)
  })

  describe('getTransactionSubgraph', () => {
    it('returns deduplicated nodes and relationships', async () => {
      mockRepo.getTransactionSubgraph.mockResolvedValue({
        records: [
          makePathRecord('acc-1', 'dev-1', 'USED_DEVICE'),
          makePathRecord('acc-1', 'dev-1', 'USED_DEVICE'),
        ],
      })

      const result = await service.getTransactionSubgraph('txn-1')

      expect(result.nodes).toHaveLength(2)
      expect(result.relationships).toHaveLength(1)
      expect(result.nodes.find(n => n.id === 'acc-1')).toBeDefined()
      expect(result.nodes.find(n => n.id === 'dev-1')).toBeDefined()
      expect(result.relationships[0].type).toBe('USED_DEVICE')
    })

    it('returns empty graph when no records', async () => {
      mockRepo.getTransactionSubgraph.mockResolvedValue({ records: [] })

      const result = await service.getTransactionSubgraph('txn-empty')

      expect(result.nodes).toHaveLength(0)
      expect(result.relationships).toHaveLength(0)
    })
  })

  describe('findFraudRings', () => {
    it('maps fraud ring records to FraudRing array', async () => {
      mockRepo.findFraudRingsBySharedDevice.mockResolvedValue({
        records: [
          {
            get: (key: string) => {
              const map: Record<string, any> = {
                sharedEntityId: 'dev-risky',
                connectedAccounts: ['acc-1', 'acc-2', 'acc-3'],
                accountCount: 3,
              }
              return map[key]
            },
          },
        ],
      })

      const result = await service.findFraudRings(2)

      expect(result).toHaveLength(1)
      expect(result[0].sharedEntityId).toBe('dev-risky')
      expect(result[0].connectedAccounts).toHaveLength(3)
      expect(result[0].accountCount).toBe(3)
    })
  })

  describe('findConnectionPath', () => {
    it('returns graph result for connection path', async () => {
      mockRepo.findConnectionPath.mockResolvedValue({
        records: [makePathRecord('acc-1', 'acc-2', 'PAID_TO')],
      })

      const result = await service.findConnectionPath('acc-1', 'acc-2')

      expect(result.nodes).toHaveLength(2)
      expect(result.relationships).toHaveLength(1)
      expect(result.relationships[0].type).toBe('PAID_TO')
    })
  })
})
