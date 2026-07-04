import { prismaClient } from '../services/db/prisma'
import { logger } from '../config/logger'

interface WorkflowSeed {
  merchantEmail: string
  workflowType: string
  status: string
}

const workflowSeeds: WorkflowSeed[] = [
  { merchantEmail: 'rajesh.kumar@example.com', workflowType: 'kyc_review', status: 'scoring' },
  { merchantEmail: 'sanjay.agarwal@example.com', workflowType: 'kyc_review', status: 'running' },
  { merchantEmail: 'ananya.gupta@example.com', workflowType: 'payout_change', status: 'generating_memo' },
  { merchantEmail: 'suresh.patel@example.com', workflowType: 'periodic_review', status: 'completed' },
  { merchantEmail: 'rahul.mehta@example.com', workflowType: 'kyc_review', status: 'completed' },
  { merchantEmail: 'deepak.verma@example.com', workflowType: 'kyc_review', status: 'queued' },
  { merchantEmail: 'vijay.khanna@example.com', workflowType: 'periodic_review', status: 'failed' },
]

export async function seedWorkflows(): Promise<void> {
  logger.info('Seeding workflow runs...')

  const merchants = await Promise.all(
    workflowSeeds.map(w => prismaClient.merchant.findUnique({ where: { email: w.merchantEmail } }))
  )

  for (let i = 0; i < workflowSeeds.length; i++) {
    const w = workflowSeeds[i]
    const merchant = merchants[i]
    if (!merchant) {
      logger.warn(`Merchant not found for email: ${w.merchantEmail}, skipping workflow`)
      continue
    }

    await prismaClient.workflowRun.create({
      data: {
        merchantId: merchant.id,
        workflowType: w.workflowType,
        status: w.status,
      },
    })
  }

  logger.info(`Seeded ${workflowSeeds.length} workflow runs`)
}
