import { Router } from 'express'
import merchantsRoutes from './merchants.routes'
import alertsRoutes from './alerts.routes'
import healthRoutes from './health.routes'
import graphController from '../modules/graph/graph.controller'
import workflowsRoutes from './workflows.routes'

const router = Router()

router.use('/merchants', merchantsRoutes)
router.use('/alerts', alertsRoutes)
router.use('/health', healthRoutes)
router.use('/graph', graphController)
router.use('/workflows', workflowsRoutes)

export default router
