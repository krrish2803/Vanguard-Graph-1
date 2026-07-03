import { Request, Response, NextFunction } from 'express'
import { InvestigationsService } from './investigations.service'
import { CreateInvestigationSchema, UpdateInvestigationSchema, InvestigationQuerySchema } from './investigations.schemas'

export class InvestigationsController {
  constructor(private service: InvestigationsService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = CreateInvestigationSchema.parse(req.body)
      const investigation = await this.service.create(data)
      res.status(201).json({ success: true, data: investigation })
    } catch (err) {
      next(err)
    }
  }

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = InvestigationQuerySchema.parse(req.query)
      const result = await this.service.findAll(query)
      res.json({ success: true, ...result })
    } catch (err) {
      next(err)
    }
  }

  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const investigation = await this.service.findById(req.params.id as string)
      res.json({ success: true, data: investigation })
    } catch (err) {
      next(err)
    }
  }

  findByMerchantId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const investigation = await this.service.findByMerchantId(req.params.merchantId as string)
      if (!investigation) {
        res.json({ success: true, data: null })
        return
      }
      res.json({ success: true, data: investigation })
    } catch (err) {
      next(err)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = UpdateInvestigationSchema.parse(req.body)
      const investigation = await this.service.update(req.params.id as string, data)
      res.json({ success: true, data: investigation })
    } catch (err) {
      next(err)
    }
  }
}
