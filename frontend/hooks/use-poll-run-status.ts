"use client"

import { useEffect, useRef, useCallback } from "react"

export function usePollRunStatus(
  runId: string | null,
  enabled: boolean,
  onComplete?: () => void
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!enabled || !runId) {
      stop()
      return
    }

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/workflows/${runId}`)
        const data = await res.json()
        if (data.status === "completed" || data.status === "failed") {
          stop()
          onComplete?.()
        }
      } catch {
        stop()
      }
    }, 3000)

    return stop
  }, [runId, enabled, stop, onComplete])

  return { stop }
}
