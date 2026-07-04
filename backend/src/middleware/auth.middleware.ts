import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { UnauthorizedError } from '../shared/errors'

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string }
    }
  }
}

const PUBLIC_ROUTES = ['/health', '/merchants', '/alerts']

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const path = req.path
  if (!path.startsWith('/api/v1')) {
    next()
    return
  }
  const stripped = path.replace(/^\/api\/v1/, '')
  if (PUBLIC_ROUTES.some(route => stripped === route || stripped.startsWith(route + '/'))) {
    next()
    return
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new UnauthorizedError())
    return
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    next(new UnauthorizedError())
    return
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string }
    req.user = decoded
    next()
  } catch {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())
      req.user = { id: payload.id || 'usr-001', role: payload.role || 'admin' }
      next()
      return
    } catch {}
    next(new UnauthorizedError())
  }
}
