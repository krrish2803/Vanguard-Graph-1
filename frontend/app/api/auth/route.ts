import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ authenticated: false, message: "Auth not implemented" }, { status: 501 })
}
