import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('neo4j-driver', () => {
  const mockDriver = {
    getServerInfo: vi.fn(),
    close: vi.fn(),
  }
  const mockAuth = { basic: vi.fn((u, p) => ({ user: u, password: p })) }
  return {
    default: {
      driver: vi.fn(() => mockDriver),
      auth: mockAuth,
    },
    auth: mockAuth,
  }
})

describe('Neo4j config', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('creates driver with correct credentials', async () => {
    const neo4jDriver = await import('neo4j-driver')
    const { getDriver } = await import('../../../src/config/neo4j')

    const driver = getDriver()

    expect(neo4jDriver.default.driver).toHaveBeenCalled()
    expect(neo4jDriver.auth.basic).toHaveBeenCalled()
  })

  it('returns same driver instance on repeated calls', async () => {
    const { getDriver } = await import('../../../src/config/neo4j')

    const driver1 = getDriver()
    const driver2 = getDriver()

    expect(driver1).toBe(driver2)
  })

  it('verifyNeo4jConnection returns true on success', async () => {
    const neo4jDriver = await import('neo4j-driver')
    const mockDriver = (neo4jDriver.default.driver as any)()

    const { verifyNeo4jConnection } = await import('../../../src/config/neo4j')

    mockDriver.getServerInfo.mockResolvedValue({
      agent: 'Neo4j/5.0.0',
      protocolVersion: '3.5',
    })

    const result = await verifyNeo4jConnection()

    expect(result).toBe(true)
    expect(mockDriver.getServerInfo).toHaveBeenCalledOnce()
  })

  it('verifyNeo4jConnection returns false on failure', async () => {
    const neo4jDriver = await import('neo4j-driver')
    const mockDriver = (neo4jDriver.default.driver as any)()

    mockDriver.getServerInfo.mockRejectedValue(new Error('Connection refused'))

    const { verifyNeo4jConnection } = await import('../../../src/config/neo4j')

    const result = await verifyNeo4jConnection()

    expect(result).toBe(false)
  })

  it('closeDriver closes the Neo4j connection', async () => {
    const neo4jDriver = await import('neo4j-driver')
    const mockDriver = (neo4jDriver.default.driver as any)()

    const { closeDriver, getDriver } = await import('../../../src/config/neo4j')
    getDriver()

    await closeDriver()

    expect(mockDriver.close).toHaveBeenCalledOnce()
  })
})
