import { describe, it, expect, vi, beforeAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import routes from '../../src/routes/index'
import { errorMiddleware } from '../../src/middleware/error.middleware'
import { requestIdMiddleware } from '../../src/middleware/request-id.middleware'

vi.mock('../../src/config/neo4j', () => ({
  default: vi.fn(),
  getDriver: vi.fn(() => ({
    session: vi.fn(() => ({
      run: vi.fn().mockResolvedValue({ records: [] }),
      close: vi.fn(),
    })),
    getServerInfo: vi.fn(),
    close: vi.fn(),
  })),
  verifyNeo4jConnection: vi.fn(),
  closeDriver: vi.fn(),
}))

vi.mock('../../src/config/postgres', () => ({
  prismaClient: {
    $queryRaw: vi.fn().mockResolvedValue([[{ 1: 1 }]]),
    merchant: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      count: vi.fn().mockResolvedValue(0),
    },
    alert: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      count: vi.fn().mockResolvedValue(0),
    },
  },
  getPrismaClient: vi.fn().mockResolvedValue({}),
}))

vi.mock('../../src/config/redis', () => ({
  getRedisClient: vi.fn(() => ({
    ping: vi.fn().mockResolvedValue('PONG'),
    connect: vi.fn().mockResolvedValue(undefined),
  })),
}))

vi.mock('../../src/config/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

vi.mock('../../src/config/env', () => ({
  env: {
    PORT: 4000,
    NODE_ENV: 'test',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    REDIS_URL: 'redis://localhost:6379',
    JWT_SECRET: 'test-secret',
  },
}))

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use(requestIdMiddleware)
  app.use('/api/v1', routes)
  app.use(errorMiddleware)
  return app
}

describe('API Integration', () => {
  let app: express.Application

  beforeAll(() => {
    app = createTestApp()
  })

  describe('GET /api/v1/health', () => {
    it('returns 200 with service status', async () => {
      const res = await request(app).get('/api/v1/health')

      expect(res.status).toBe(200)
      expect(res.body.status).toBe('ok')
      expect(res.body.postgres).toBe('connected')
      expect(res.body.redis).toBe('connected')
      expect(res.body.timestamp).toBeDefined()
    })
  })

  describe('GET /api/v1/merchants', () => {
    it('returns 200 with merchants list', async () => {
      const res = await request(app).get('/api/v1/merchants')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
      expect(res.body.total).toBeDefined()
      expect(res.body.page).toBeDefined()
    })
  })

  describe('GET /api/v1/alerts', () => {
    it('returns 200 with alerts list', async () => {
      const res = await request(app).get('/api/v1/alerts')

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })
})
