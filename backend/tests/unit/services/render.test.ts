import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RenderClient } from '../../../src/services/render/render-client'
import { WorkflowTrigger } from '../../../src/services/render/workflow-trigger'
import { WorkflowStatus } from '../../../src/services/render/workflow-status'

vi.mock('../../../src/config/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

describe('RenderClient', () => {
  let client: RenderClient

  beforeEach(() => {
    vi.stubEnv('RENDER_API_KEY', 'test-render-key')
    client = new RenderClient()
  })

  it('throws when RENDER_API_KEY is not set', async () => {
    vi.stubEnv('RENDER_API_KEY', '')
    const emptyClient = new RenderClient()

    await expect(emptyClient.triggerWorkflow('svc-1', {}))
      .rejects.toThrow('RENDER_API_KEY is not configured')
  })

  it('makes a POST request to trigger a deploy', async () => {
    const mockResponse = { deployId: 'dep-123', status: 'live', url: 'https://example.com' }
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await client.triggerWorkflow('svc-1', { clearCache: 'do_not_clear' })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.render.com/v1/services/svc-1/deploys',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(result.deployId).toBe('dep-123')
    expect(result.status).toBe('live')
  })

  it('gets deploy status', async () => {
    const mockResponse = { status: 'live', finishedAt: null }
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await client.getDeployStatus('svc-1', 'dep-123')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.render.com/v1/services/svc-1/deploys/dep-123',
      expect.any(Object),
    )
    expect(result.status).toBe('live')
  })

  it('lists services', async () => {
    const mockResponse = [{ id: 'svc-1', name: 'test', type: 'web', serviceDetails: { env: 'node', repo: 'test', branch: 'main' } }]
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await client.listServices()

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('svc-1')
  })

  it('throws on non-ok response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Unauthorized'),
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(client.triggerWorkflow('svc-1', {}))
      .rejects.toThrow('Render API error (401): Unauthorized')
  })
})

describe('WorkflowTrigger', () => {
  let mockClient: RenderClient
  let trigger: WorkflowTrigger

  beforeEach(() => {
    vi.stubEnv('RENDER_ONBOARDING_SERVICE_ID', 'svc-onboarding')
    vi.stubEnv('RENDER_API_KEY', 'test-key')

    mockClient = new RenderClient()
    trigger = new WorkflowTrigger(mockClient)
  })

  it('triggers an onboarding workflow', async () => {
    vi.spyOn(mockClient, 'triggerWorkflow').mockResolvedValue({
      deployId: 'dep-123',
      status: 'live',
      url: 'https://example.com',
    })

    const result = await trigger.trigger({
      merchantId: 'M-001',
      eventType: 'ONBOARDING',
      data: { name: 'Test Merchant' },
    })

    expect(result.deployId).toBe('dep-123')
    expect(mockClient.triggerWorkflow).toHaveBeenCalledWith(
      'svc-onboarding',
      expect.objectContaining({ envVars: expect.any(Array) }),
    )
  })

  it('returns demo data when no service ID is configured', async () => {
    vi.stubEnv('RENDER_ONBOARDING_SERVICE_ID', '')

    const emptyTrigger = new WorkflowTrigger(mockClient)

    const result = await emptyTrigger.trigger({
      merchantId: 'M-001',
      eventType: 'ONBOARDING',
      data: {},
    })

    expect(result.deployId).toMatch(/^demo-dep-/)
    expect(result.status).toBe('live')
  })

  it('returns demo data for placeholder service ID', async () => {
    vi.stubEnv('RENDER_ONBOARDING_SERVICE_ID', 'placeholder')

    const placeholderTrigger = new WorkflowTrigger(mockClient)

    const result = await placeholderTrigger.trigger({
      merchantId: 'M-001',
      eventType: 'ONBOARDING',
      data: {},
    })

    expect(result.deployId).toMatch(/^demo-dep-/)
    expect(result.status).toBe('live')
  })
})

describe('WorkflowStatus', () => {
  let mockClient: RenderClient
  let statusChecker: WorkflowStatus

  beforeEach(() => {
    vi.stubEnv('RENDER_API_KEY', 'test-key')
    mockClient = new RenderClient()
    statusChecker = new WorkflowStatus(mockClient)
  })

  it('returns running status for live deploy', async () => {
    vi.spyOn(mockClient, 'getDeployStatus').mockResolvedValue({
      status: 'live',
      finishedAt: null,
    })

    const result = await statusChecker.check('svc-1', 'dep-123')

    expect(result.status).toBe('running')
    expect(result.finishedAt).toBeNull()
  })

  it('returns succeeded status for successful deploy', async () => {
    vi.spyOn(mockClient, 'getDeployStatus').mockResolvedValue({
      status: 'success',
      finishedAt: '2026-07-02T00:00:00Z',
    })

    const result = await statusChecker.check('svc-1', 'dep-123')

    expect(result.status).toBe('succeeded')
    expect(result.finishedAt).toBe('2026-07-02T00:00:00Z')
  })

  it('returns failed status for failed deploy', async () => {
    vi.spyOn(mockClient, 'getDeployStatus').mockResolvedValue({
      status: 'failed',
      finishedAt: '2026-07-02T00:00:00Z',
    })

    const result = await statusChecker.check('svc-1', 'dep-456')

    expect(result.status).toBe('failed')
  })
})
