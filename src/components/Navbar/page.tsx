'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from '@/components/Menu/menu'
import { GalleryVerticalEnd } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="relative z-50 bg-white shadow-md">
            <div className="h-16 px-4 md:px-8 lg:px-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    X3D
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Menu />
                </div>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-2">
                    <Link href="/login">
                        <Button>Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button variant="outline">Sign Up</Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden flex flex-col items-center space-y-6 py-6 px-6"
                    >
                        {/* Menu in column */}
                        <div className="flex flex-col items-center space-y-4 w-full">
                            <Menu />
                        </div>

                        {/* Auth buttons in column */}
                        <div className="flex flex-col w-full space-y-2">
                            <Link href="/login">
                                <Button className="w-full">Login</Button>
                            </Link>
                            <Link href="/signup">
                                <Button variant="outline" className="w-full">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
