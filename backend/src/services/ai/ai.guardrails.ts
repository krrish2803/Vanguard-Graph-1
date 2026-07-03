import { AIRequest, GuardrailResult } from './ai.types'
import { logger } from '../../config/logger'

const BLOCKED_PATTERNS = [
  /ignore all previous instructions/i,
  /forget your (instructions|guidelines|rules)/i,
  /you are (not |are not )?(an AI|a language model)/i,
  /system prompt/i,
  /disregard/i,
]

const MAX_INPUT_LENGTH = 100_000
const MAX_MESSAGES = 100

export function applyInputGuardrails(request: AIRequest): GuardrailResult {
  const violations: string[] = []

  if (request.messages.length > MAX_MESSAGES) {
    violations.push(`Exceeded maximum message count: ${request.messages.length} > ${MAX_MESSAGES}`)
  }

  for (const msg of request.messages) {
    if (msg.content.length > MAX_INPUT_LENGTH) {
      violations.push(`Message exceeds maximum length: ${msg.content.length} > ${MAX_INPUT_LENGTH}`)
    }

    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(msg.content)) {
        violations.push(`Prompt injection detected: matched pattern ${pattern}`)
      }
    }
  }

  if (request.systemPrompt && request.systemPrompt.length > 10_000) {
    violations.push(`System prompt exceeds maximum length: ${request.systemPrompt.length} > 10000`)
  }

  const result: GuardrailResult = {
    passed: violations.length === 0,
    violations,
  }

  if (!result.passed) {
    logger.warn('AI guardrails blocked request', { violations })
  }

  return result
}
