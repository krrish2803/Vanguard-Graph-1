import { RenderClient, RenderDeployResponse } from './render-client'
import { logger } from '../../config/logger'

export interface WorkflowTriggerPayload {
  merchantId: string
  eventType: 'ONBOARDING'
  data: Record<string, unknown>
}

function getServiceId(eventType: string): string {
  return process.env[`RENDER_${eventType}_SERVICE_ID`] || ''
}

const PLACEHOLDER_SERVICE_IDS = ['placeholder', 'demo', 'test']

export class WorkflowTrigger {
  constructor(private client: RenderClient) {}

  async trigger(payload: WorkflowTriggerPayload): Promise<RenderDeployResponse> {
    const serviceId = getServiceId(payload.eventType)

    if (!serviceId || PLACEHOLDER_SERVICE_IDS.includes(serviceId)) {
      logger.info('Using demo workflow data', { eventType: payload.eventType, merchantId: payload.merchantId })
      return {
        deployId: `demo-dep-${Date.now()}`,
        status: 'live',
        url: `https://demo.render.com/deploy/${Date.now()}`,
      }
    }

    logger.info('Triggering workflow', { eventType: payload.eventType, merchantId: payload.merchantId })

    return this.client.triggerWorkflow(serviceId, {
      envVars: [
        { key: 'MERCHANT_ID', value: payload.merchantId },
        { key: 'EVENT_TYPE', value: payload.eventType },
        { key: 'PAYLOAD', value: JSON.stringify(payload.data) },
      ],
    })
  }
}
