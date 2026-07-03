import { NextResponse } from "next/server"

const VALID_CREDENTIALS = [
  { email: "admin@vanguard.com", password: "admin123", id: "usr-001", name: "Admin", role: "admin" },
  { email: "analyst@vanguard.com", password: "analyst123", id: "usr-002", name: "Analyst", role: "analyst" },
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const cred = VALID_CREDENTIALS.find((c) => c.email === email && c.password === password)
    if (!cred) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const header = {
      alg: "HS256",
      typ: "JWT",
    }
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      id: cred.id,
      email: cred.email,
      name: cred.name,
      role: cred.role,
      iat: now,
      exp: now + 86400,
    }

    function b64(obj: object) {
      return Buffer.from(JSON.stringify(obj)).toString("base64url")
    }

    const token = `${b64(header)}.${b64(payload)}.mock-signature`

    const response = NextResponse.json({ token, user: { id: cred.id, email: cred.email, name: cred.name, role: cred.role } })
    response.cookies.set("vg_auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    })
    return response
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }
}
