'use client'


import Navbar from "@/components/Navbar/page"
import { usePathname } from "next/navigation";

export const dynamic = "force-dynamic"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    return <div>{children}</div>;
  }

  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
}