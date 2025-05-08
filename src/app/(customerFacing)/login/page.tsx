'use client'
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    document.body.classList.add("overflow-hidden")
    return () => document.body.classList.remove("overflow-hidden")
  }, [])

  return (
    <>
      <div className="bg-muted">
        <Button onClick={() => router.push("/")} variant="ghost" className="bg-transparent">
          ← Back
        </Button>
      </div>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 ">
        <div className="flex w-full max-w-sm flex-col gap-6 border border-primary rounded-lg shadow-md p-6 ">
          <Link href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            X3D
          </Link>
          <LoginForm />
        </div>
      </div>
    </>
  )
}