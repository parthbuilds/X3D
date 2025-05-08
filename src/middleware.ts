import { NextRequest, NextResponse } from "next/server"


export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("admin-auth")?.value === "true"

  const isLoginPage = req.nextUrl.pathname === "/admin/login"

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = "/admin/login"
    loginUrl.searchParams.set("returnTo", req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
export const config = {
  matcher: ["/admin/:path*", "/admin/login"],
}
