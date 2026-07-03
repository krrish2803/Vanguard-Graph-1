import { logger } from '../../config/logger'

export interface RenderDeployResponse {
  deployId: string
  status: string
  url: string
}

export interface RenderServiceInfo {
  id: string
  name: string
  type: string
  serviceDetails: {
    env: string
    repo: string
    branch: string
  }
}

export class RenderClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = 'https://api.render.com/v1'
  }

  private get apiKey(): string {
    return process.env.RENDER_API_KEY || ''
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>,
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('RENDER_API_KEY is not configured')
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error')
      throw new Error(`Render API error (${response.status}): ${errorBody}`)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  }

  async triggerWorkflow(serviceId: string, payload: Record<string, unknown>): Promise<RenderDeployResponse> {
    logger.info('Triggering Render workflow', { serviceId })
    return this.request<RenderDeployResponse>('POST', `/services/${serviceId}/deploys`, {
      clearCache: 'do_not_clear',
      image: null,
      ...payload,
    })
  }

  async getDeployStatus(serviceId: string, deployId: string): Promise<{ status: string; finishedAt: string | null }> {
    return this.request(`GET`, `/services/${serviceId}/deploys/${deployId}`)
  }

  async listServices(): Promise<RenderServiceInfo[]> {
    return this.request<RenderServiceInfo[]>('GET', '/services')
  }
}
