import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/", "/login", "/pricing", "/docs", "/api/auth/login", "/api/health"]
const PROTECTED_PREFIXES = ["/dashboard", "/alerts", "/merchants", "/investigations", "/graph", "/workflows", "/settings"]

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (PUBLIC_ROUTES.includes(path)) {
    return NextResponse.next()
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p))
  if (!isProtected) {
    return NextResponse.next()
  }

  const token = request.cookies.get("vg_auth_token")?.value

  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
