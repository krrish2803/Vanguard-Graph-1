import { PrismaClient } from '@prisma/client'
import { prismaClient } from '../../services/db/prisma'
import { Merchant, CreateMerchantDTO, UpdateMerchantDTO, MerchantQuery, PaginatedResult } from './merchants.types'

export class MerchantsRepository {
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

  async findAll(query: MerchantQuery): Promise<PaginatedResult<Merchant>> {
    const page = query.page || 1
    const limit = query.limit || 20
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (query.status) where.status = query.status
    if (query.riskLevel) where.riskLevel = query.riskLevel
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search } },
      ]
    }

    const [data, total] = await Promise.all([
      this.client.merchant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.client.merchant.count({ where }),
    ])

    return {
      data: data as unknown as Merchant[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findById(id: string): Promise<Merchant | null> {
    const merchant = await this.client.merchant.findUnique({ where: { id } })
    return merchant as unknown as Merchant | null
  }

  async findByEmail(email: string): Promise<Merchant | null> {
    const merchant = await this.client.merchant.findUnique({ where: { email } })
    return merchant as unknown as Merchant | null
  }

  async create(data: CreateMerchantDTO): Promise<Merchant> {
    const merchant = await this.client.merchant.create({ data })
    return merchant as unknown as Merchant
  }

  async update(id: string, data: UpdateMerchantDTO): Promise<Merchant> {
    const merchant = await this.client.merchant.update({ where: { id }, data })
    return merchant as unknown as Merchant
  }
}
