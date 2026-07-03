import { InvestigationsRepository } from './investigations.repository'
import { Investigation, CreateInvestigationDTO, UpdateInvestigationDTO, InvestigationQuery } from './investigations.types'
import { NotFoundError } from '../../shared/errors'
import { logger } from '../../config/logger'

export class InvestigationsService {
  constructor(private repository: InvestigationsRepository) {}

  async create(data: CreateInvestigationDTO): Promise<Investigation> {
    const investigation = await this.repository.create(data)
    logger.info('Investigation created', { investigationId: investigation.id, merchantId: investigation.merchantId })
    return investigation
  }

  async findAll(query: InvestigationQuery) {
    return this.repository.findAll(query)
  }

  async findById(id: string): Promise<Investigation> {
    const investigation = await this.repository.findById(id)
    if (!investigation) {
      throw new NotFoundError('Investigation')
    }
    return investigation
  }

  async findByMerchantId(merchantId: string): Promise<Investigation | null> {
    return this.repository.findByMerchantId(merchantId)
  }

  async update(id: string, dto: UpdateInvestigationDTO): Promise<Investigation> {
    const investigation = await this.repository.findById(id)
    if (!investigation) {
      throw new NotFoundError('Investigation')
    }
    return this.repository.update(id, dto)
  }
}
