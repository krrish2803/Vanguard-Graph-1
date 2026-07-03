import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'path'
import { PrismaClient } from '../../node_modules/.prisma/test-client'
import { MerchantsRepository } from '../../src/modules/merchants/merchants.repository'
import { InvestigationsRepository } from '../../src/modules/investigations/investigations.repository'
import { WorkflowsRepository } from '../../src/modules/workflows/workflows.repository'
import { AlertsRepository } from '../../src/modules/alerts/alerts.repository'

const dbPath = path.resolve(process.cwd(), 'prisma/test.db')
const prisma = new PrismaClient({
  datasources: { db: { url: `file:${dbPath}` } },
})

const ts = () => Date.now()

function clean() {
  return prisma.$transaction([
    prisma.alert.deleteMany(),
    prisma.investigation.deleteMany(),
    prisma.workflowRun.deleteMany(),
    prisma.merchant.deleteMany(),
  ])
}

describe('SQLite Repo Integration', () => {
  beforeAll(async () => {
    await prisma.$connect()
    await clean()
  })

  afterAll(async () => {
    await clean()
    await prisma.$disconnect()
  })

  /* ---- MerchantsRepository ---- */
  describe('MerchantsRepository', () => {
    const repo = new MerchantsRepository(prisma)

    it('creates a merchant', async () => {
      const data = {
        name: `Test ${ts()}`,
        email: `m${ts()}@t.com`,
        phone: '1234567890',
        deviceFingerprint: `FP-${ts()}`,
        ipAddress: '1.1.1.1',
        bankAccountNumber: '1234567890',
        bankAccountIfsc: 'HDFC0001234',
      }
      const m = await repo.create(data)
      expect(m.id).toBeDefined()
      expect(m.name).toBe(data.name)
    })

    it('finds by id', async () => {
      const data = {
        name: `Find ${ts()}`,
        email: `find${ts()}@t.com`,
        phone: '1234567890',
        deviceFingerprint: `FP-${ts()}`,
        ipAddress: '1.1.1.1',
        bankAccountNumber: '1234567890',
        bankAccountIfsc: 'HDFC0001234',
      }
      const created = await repo.create(data)
      const found = await repo.findById(created.id)
      expect(found).not.toBeNull()
      expect(found!.id).toBe(created.id)
    })

    it('finds by email', async () => {
      const email = `byemail${ts()}@t.com`
      await repo.create({
        name: 'ByEmail',
        email,
        phone: '1234567890',
        deviceFingerprint: `FP-${ts()}`,
        ipAddress: '1.1.1.1',
        bankAccountNumber: '1234567890',
        bankAccountIfsc: 'HDFC0001234',
      })
      const found = await repo.findByEmail(email)
      expect(found).not.toBeNull()
      expect(found!.email).toBe(email)
    })

    it('finds all with pagination', async () => {
      await clean()
      for (let i = 0; i < 3; i++) {
        await repo.create({
          name: `Paginate ${i} ${ts()}`,
          email: `pag${i}${ts()}@t.com`,
          phone: '1234567890',
          deviceFingerprint: `FP-${i}-${ts()}`,
          ipAddress: '1.1.1.1',
          bankAccountNumber: '1234567890',
          bankAccountIfsc: 'HDFC0001234',
        })
      }
      const result = await repo.findAll({ page: 1, limit: 10 })
      expect(result.data.length).toBeGreaterThanOrEqual(3)
      expect(result.total).toBeGreaterThanOrEqual(3)
    })

    it('updates a merchant', async () => {
      const data = {
        name: `Update ${ts()}`,
        email: `upd${ts()}@t.com`,
        phone: '1234567890',
        deviceFingerprint: `FP-${ts()}`,
        ipAddress: '1.1.1.1',
        bankAccountNumber: '1234567890',
        bankAccountIfsc: 'HDFC0001234',
      }
      const created = await repo.create(data)
      const updated = await repo.update(created.id, { name: 'UpdatedName' })
      expect(updated.name).toBe('UpdatedName')
    })
  })

  /* ---- InvestigationsRepository ---- */
  describe('InvestigationsRepository', () => {
    const merchantRepo = new MerchantsRepository(prisma)
    const repo = new InvestigationsRepository(prisma)
    let merchantId: string

    beforeAll(async () => {
      const m = await merchantRepo.create({
        name: `Invest ${ts()}`,
        email: `inv${ts()}@t.com`,
        phone: '1234567890',
        deviceFingerprint: `FP-${ts()}`,
        ipAddress: '1.1.1.1',
        bankAccountNumber: '1234567890',
        bankAccountIfsc: 'HDFC0001234',
      })
      merchantId = m.id
    })

    it('creates an investigation', async () => {
      const inv = await repo.create({ merchantId })
      expect(inv.id).toBeDefined()
      expect(inv.merchantId).toBe(merchantId)
      expect(inv.status).toBe('pending')
    })

    it('finds by merchant id', async () => {
      const inv = await repo.create({ merchantId })
      const found = await repo.findByMerchantId(merchantId)
      expect(found).not.toBeNull()
      expect(found!.merchantId).toBe(merchantId)
    })

    it('finds by id', async () => {
      const created = await repo.create({ merchantId })
      const found = await repo.findById(created.id)
      expect(found).not.toBeNull()
      expect(found!.id).toBe(created.id)
    })

    it('finds all with pagination', async () => {
      const result = await repo.findAll({ page: 1, limit: 10 })
      expect(result.data.length).toBeGreaterThanOrEqual(1)
      expect(result.total).toBeGreaterThanOrEqual(1)
    })

    it('updates an investigation', async () => {
      const created = await repo.create({ merchantId })
      const updated = await repo.update(created.id, { status: 'completed', riskScore: 85 })
      expect(updated.status).toBe('completed')
      expect(updated.riskScore).toBe(85)
    })
  })

  /* ---- WorkflowsRepository ---- */
  describe('WorkflowsRepository', () => {
    const merchantRepo = new MerchantsRepository(prisma)
    const repo = new WorkflowsRepository(prisma)
    let merchantId: string

    beforeAll(async () => {
      const m = await merchantRepo.create({
        name: `WF ${ts()}`,
        email: `wf${ts()}@t.com`,
        phone: '1234567890',
        deviceFingerprint: `FP-${ts()}`,
        ipAddress: '1.1.1.1',
        bankAccountNumber: '1234567890',
        bankAccountIfsc: 'HDFC0001234',
      })
      merchantId = m.id
    })

    it('creates a workflow run', async () => {
      const run = await repo.create({ merchantId, workflowType: 'ONBOARDING' })
      expect(run.id).toBeDefined()
      expect(run.status).toBe('running')
    })

    it('finds by id', async () => {
      const created = await repo.create({ merchantId, workflowType: 'ONBOARDING' })
      const found = await repo.findById(created.id)
      expect(found).not.toBeNull()
      expect(found!.id).toBe(created.id)
    })

    it('finds all with pagination', async () => {
      const result = await repo.findAll({ page: 1, limit: 10 })
      expect(result.data.length).toBeGreaterThanOrEqual(1)
    })

    it('updates status', async () => {
      const created = await repo.create({ merchantId, workflowType: 'ONBOARDING' })
      const updated = await repo.updateStatus(created.id, 'succeeded')
      expect(updated.status).toBe('succeeded')
    })
  })

  /* ---- AlertsRepository ---- */
  describe('AlertsRepository', () => {
    const merchantRepo = new MerchantsRepository(prisma)
    const repo = new AlertsRepository(prisma)
    let merchantId: string

    beforeAll(async () => {
      const m = await merchantRepo.create({
        name: `Alert ${ts()}`,
        email: `alert${ts()}@t.com`,
        phone: '1234567890',
        deviceFingerprint: `FP-${ts()}`,
        ipAddress: '1.1.1.1',
        bankAccountNumber: '1234567890',
        bankAccountIfsc: 'HDFC0001234',
      })
      merchantId = m.id
    })

    it('creates an alert', async () => {
      const alert = await repo.create({
        merchantId,
        riskScore: 75,
        riskLevel: 'high',
        summary: 'Test alert',
      })
      expect(alert.id).toBeDefined()
      expect(alert.status).toBe('open')
    })

    it('finds by id', async () => {
      const created = await repo.create({
        merchantId,
        riskScore: 50,
        riskLevel: 'medium',
        summary: 'Find test',
      })
      const found = await repo.findById(created.id)
      expect(found).not.toBeNull()
      expect(found!.id).toBe(created.id)
    })

    it('finds all with pagination', async () => {
      const result = await repo.findAll({ page: 1, limit: 10 })
      expect(result.data.length).toBeGreaterThanOrEqual(1)
    })

    it('updates status', async () => {
      const created = await repo.create({
        merchantId,
        riskScore: 30,
        riskLevel: 'low',
        summary: 'Status update',
      })
      const updated = await repo.updateStatus(created.id, { status: 'resolved' })
      expect(updated.status).toBe('resolved')
    })
  })
})
