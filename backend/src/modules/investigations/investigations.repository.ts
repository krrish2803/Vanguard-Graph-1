import { PrismaClient } from '@prisma/client'
import { prismaClient } from '../../services/db/prisma'
import { Investigation, CreateInvestigationDTO, UpdateInvestigationDTO, InvestigationQuery } from './investigations.types'

export class InvestigationsRepository {
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

  async findAll(query: InvestigationQuery) {
    const page = query.page || 1
    const limit = query.limit || 20
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (query.merchantId) where.merchantId = query.merchantId
    if (query.status) where.status = query.status

    const [data, total] = await Promise.all([
      this.client.investigation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.client.investigation.count({ where }),
    ])

    return {
      data: data as unknown as Investigation[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findById(id: string): Promise<Investigation | null> {
    const investigation = await this.client.investigation.findUnique({ where: { id } })
    return investigation as unknown as Investigation | null
  }

  async findByMerchantId(merchantId: string): Promise<Investigation | null> {
    const investigation = await this.client.investigation.findFirst({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
    })
    return investigation as unknown as Investigation | null
  }

  async create(dto: CreateInvestigationDTO): Promise<Investigation> {
    const investigation = await this.client.investigation.create({
      data: dto,
    })
    return investigation as unknown as Investigation
  }

  async update(id: string, dto: UpdateInvestigationDTO): Promise<Investigation> {
    const investigation = await this.client.investigation.update({
      where: { id },
      data: dto,
    })
    return investigation as unknown as Investigation
  }
}
