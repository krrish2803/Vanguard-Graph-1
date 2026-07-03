import path from 'path'

const testDbPath = path.resolve(__dirname, '../../prisma/test.db')

let prisma: any = null

function loadPrismaClient(): any {
  const { PrismaClient } = require(path.resolve(__dirname, '../../node_modules/.prisma/test-client'))
  return new PrismaClient({
    datasources: { db: { url: `file:${testDbPath}` } },
  })
}

export function getTestPrismaClient(): any {
  if (!prisma) {
    prisma = loadPrismaClient()
  }
  return prisma
}

export async function cleanDatabase(prisma: any): Promise<void> {
  await prisma.$transaction([
    prisma.alert.deleteMany(),
    prisma.investigation.deleteMany(),
    prisma.workflowRun.deleteMany(),
    prisma.merchant.deleteMany(),
  ])
}

export async function teardownTestDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect()
    prisma = null
  }
}

export function createTestMerchant(overrides: Record<string, unknown> = {}) {
  const ts = Date.now()
  return {
    name: `Test Merchant ${ts}`,
    email: `merchant${ts}@test.com`,
    phone: '1234567890',
    deviceFingerprint: `FP-TEST-${ts}`,
    ipAddress: '192.168.1.1',
    bankAccountNumber: '1234567890',
    bankAccountIfsc: 'HDFC0001234',
    ...overrides,
  }
}
