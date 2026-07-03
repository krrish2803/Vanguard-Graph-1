import { env } from '../../../config/env'
import { AIProvider, AIRequest, AIResponse } from '../ai.types'

const DEFAULT_MODEL = 'nvidia/llama-3.1-nemotron-70b-instruct'

export class NvidiaProvider implements AIProvider {
  readonly name = 'nvidia' as const
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = env.NVIDIA_BASE_URL
    this.apiKey = env.NVIDIA_API_KEY
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('NVIDIA_API_KEY is not configured')
    }

    const messages: { role: string; content: string }[] = []
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt })
    }
    messages.push(...request.messages)

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || DEFAULT_MODEL,
        messages,
        temperature: request.temperature ?? 0.3,
        max_tokens: request.maxTokens ?? 1024,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error')
      throw new Error(`NVIDIA API error (${response.status}): ${errorBody}`)
    }

    const json: any = await response.json()
    const choice = json.choices?.[0]

    return {
      content: choice?.message?.content ?? '',
      model: json.model || DEFAULT_MODEL,
      usage: {
        promptTokens: json.usage?.prompt_tokens ?? 0,
        completionTokens: json.usage?.completion_tokens ?? 0,
        totalTokens: json.usage?.total_tokens ?? 0,
      },
    }
  }
}
