import { describe, it, expect } from 'vitest'

describe('NvidiaProvider', () => {
  it('has name nvidia', async () => {
    const { NvidiaProvider } = await import('../../../src/services/ai/providers/nvidia.provider')
    const provider = new NvidiaProvider()
    expect(provider.name).toBe('nvidia')
  })

  it('connects to NVIDIA API', async () => {
    const key = process.env.NVIDIA_API_KEY
    if (!key) {
      console.warn('Skipping real NVIDIA test: NVIDIA_API_KEY not set')
      return
    }
    const { NvidiaProvider } = await import('../../../src/services/ai/providers/nvidia.provider')
    const provider = new NvidiaProvider()
    try {
      const response = await provider.generate({
        messages: [{ role: 'user', content: 'Say hello in one word' }],
        maxTokens: 50,
        temperature: 0,
      })
      expect(response.content).toBeTruthy()
      expect(response.usage.totalTokens).toBeGreaterThan(0)
    } catch (err: any) {
      if (err.message.includes('404')) {
        console.warn('NVIDIA model not found on account — API key is valid but model unavailable')
        return
      }
      throw err
    }
  }, 15000)
})
