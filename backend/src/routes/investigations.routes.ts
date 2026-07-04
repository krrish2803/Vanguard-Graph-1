import { Router } from 'express'
import { InvestigationsController } from '../modules/investigations/investigations.controller'
import { InvestigationsService } from '../modules/investigations/investigations.service'
import { InvestigationsRepository } from '../modules/investigations/investigations.repository'

const repository = new InvestigationsRepository()
const service = new InvestigationsService(repository)
const controller = new InvestigationsController(service)

const router = Router()

router.get('/', controller.findAll)
router.get('/:id', controller.findById)
router.get('/merchant/:merchantId', controller.findByMerchantId)
router.post('/', controller.create)
router.patch('/:id', controller.update)

export default router
