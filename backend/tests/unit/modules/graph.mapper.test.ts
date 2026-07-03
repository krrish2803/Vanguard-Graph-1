import { describe, it, expect } from 'vitest'
import { mapNode, mapRelationship } from '../../../src/modules/graph/graph.mapper'
import { NodeType } from '../../../src/modules/graph/graph.types'

describe('mapNode', () => {
  it('maps a basic Neo4j node to GraphNode', () => {
    const neo4jNode = {
      labels: ['Account'],
      properties: { id: 'acc-1', email: 'test@example.com' },
    }

    const result = mapNode(neo4jNode)

    expect(result.id).toBe('acc-1')
    expect(result.type).toBe(NodeType.ACCOUNT)
    expect(result.label).toBe('test@example.com')
    expect(result.properties).toEqual(neo4jNode.properties)
  })

  it('maps Merchant node using merchantId', () => {
    const neo4jNode = {
      labels: ['Merchant'],
      properties: { id: 'm-1', merchantId: 'M-001', name: 'Test Merchant' },
    }

    const result = mapNode(neo4jNode)

    expect(result.type).toBe(NodeType.MERCHANT)
    expect(result.label).toBe('M-001')
  })

  it('uses fallback for unknown node type', () => {
    const neo4jNode = {
      labels: ['UnknownType'],
      properties: { id: 'x-1' },
    }

    const result = mapNode(neo4jNode)

    expect(result.type).toBe('UnknownType' as NodeType)
    expect(result.label).toBe('x-1')
  })

  it('handles empty labels array', () => {
    const neo4jNode = {
      labels: [],
      properties: { id: 'no-label' },
    }

    const result = mapNode(neo4jNode)

    expect(result.type).toBe('Unknown' as NodeType)
  })
})

describe('mapRelationship', () => {
  it('maps a Neo4j relationship to GraphRelationship', () => {
    const neo4jRel = {
      type: 'USED_DEVICE',
      identity: { toString: () => 'rel-1' },
      start: { toString: () => 'node-a' },
      end: { toString: () => 'node-b' },
    }

    const result = mapRelationship(neo4jRel as any)

    expect(result.id).toBe('rel-1')
    expect(result.type).toBe('USED_DEVICE')
    expect(result.source).toBe('node-a')
    expect(result.target).toBe('node-b')
  })
})
