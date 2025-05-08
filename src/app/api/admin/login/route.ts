import { NextResponse } from "next/server"
import { isValidPassword } from "@/lib/isValidPassword"

export async function POST(req: Request) {
  const { username, password } = await req.json()

  if (
    username !== process.env.ADMIN_USERNAME ||
    !(await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD!))
  ) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set("admin-auth", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60, // 1 hour
  })

  return response
}
