"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = "vg_auth_token"

function parseJwt(token: string): User | null {
  try {
    const base64 = token.split(".")[1]
    const payload = JSON.parse(atob(base64))
    return { id: payload.id, email: payload.email, name: payload.name, role: payload.role }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const u = parseJwt(stored)
      if (u) {
        setToken(stored)
        setUser(u)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Login failed")
    }
    const data = await res.json()
    localStorage.setItem(STORAGE_KEY, data.token)
    document.cookie = `vg_auth_token=${data.token}; path=/; max-age=86400; SameSite=Lax`
    setToken(data.token)
    setUser(parseJwt(data.token))
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {}
    localStorage.removeItem(STORAGE_KEY)
    document.cookie = "vg_auth_token=; path=/; max-age=0"
    setToken(null)
    setUser(null)
    window.location.href = "/"
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
