import { PrismaClient } from '@prisma/client'
import { prismaClient } from '../../services/db/prisma'
import { WorkflowRun, WorkflowTriggerDTO, WorkflowQuery } from './workflows.types'

export class WorkflowsRepository {
  private _prisma?: PrismaClient

  constructor(injectedPrisma?: PrismaClient) {
    this._prisma = injectedPrisma
  }

  private get client(): PrismaClient {
    if (!this._prisma) {
      if (!prismaClient) throw new Error('PrismaClient not initialized')
      this._prisma = prismaClient
    }
    return this._prisma
  }

  async findAll(query: WorkflowQuery) {
    const page = query.page || 1
    const limit = query.limit || 20
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (query.merchantId) where.merchantId = query.merchantId
    if (query.workflowType) where.workflowType = query.workflowType
    if (query.status) where.status = query.status

    const [data, total] = await Promise.all([
      this.client.workflowRun.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.client.workflowRun.count({ where }),
    ])

    return {
      data: data as unknown as WorkflowRun[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findById(id: string): Promise<WorkflowRun | null> {
    const run = await this.client.workflowRun.findUnique({ where: { id } })
    return run as unknown as WorkflowRun | null
  }

  async create(dto: WorkflowTriggerDTO): Promise<WorkflowRun> {
    const run = await this.client.workflowRun.create({
      data: {
        merchantId: dto.merchantId,
        workflowType: dto.workflowType,
        renderRunId: dto.renderRunId ?? null,
        status: 'running',
      },
    })
    return run as unknown as WorkflowRun
  }

  async updateStatus(id: string, status: string): Promise<WorkflowRun> {
    const run = await this.client.workflowRun.update({
      where: { id },
      data: { status },
    })
    return run as unknown as WorkflowRun
  }
}
