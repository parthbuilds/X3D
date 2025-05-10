'use client'

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()  // Get the current path

  const handleLogout = () => {
    // Optional: add confirmation or real auth logic
    router.push("/")
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/users", label: "Customers" },
    { href: "/admin/orders", label: "Sales" },
  ]

  // If the current path is /admin/login, do not show the navigation bar
  if (pathname === "/admin/login") {
    return <main className="p-2 max-w-screen-xl mx-auto">{children}</main>
  }

  return (
    <>
      <header className="border-b bg-background px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between">
          {/* Mobile menu */}
          <div className="flex items-center gap-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <span className="text-lg font-semibold">Admin</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="ml-auto"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="p-4 max-w-screen-xl mx-auto">{children}</main>
    </>
  )
}
