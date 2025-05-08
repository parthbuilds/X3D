'use client'
import { Menu } from "@/components/Menu/menu";
import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="h-16 bg-white shadow-md px-4 md:px-8 lg:px-16 flex items-center justify-between">
            <Link href="#" className="flex items-center gap-2 font-medium">
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-4" />
                </div>
                X3D
            </Link>

            <div className="hidden md:flex items-center justify-end space-x-6">
                <Menu />
            </div>

            <div className="hidden md:flex items-center justify-end space-x-2">
                <Link href="/login"><Button>Login</Button></Link>
                <Link href="/signup"><Button variant='outline'>Sign Up</Button></Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    )}
                </svg>
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-center space-y-4 py-4 md:hidden">
                    <Menu />
                    <div className="flex space-x-2">
                        <Link href="/login"><Button>Login</Button></Link>
                        <Link href="/signup"><Button variant='outline'>Sign Up</Button></Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
