"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import React from 'react'

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()
    const routes = [
        { href : "/", label: "Beranda"},
        { href : "/services", label: "Layanan" },
        { href : "/about", label: "Tentang" },
    ]
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 justify-between">
            <div className="flex items-center gap-12">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-bold pl-6 text-xl hidden md:inline-block">Readibly</span>
                </Link>
            </div>

            <div className="flex items-center gap-6 justify-end ">
                <nav className="hidden md:flex items-center gap-6">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-muted-foreground hover:text-blue-500",
                                    pathname === route.href? "text-blue-500":"text-muted-foreground",
                                )}
                            >
                                {route.label}
                            </Link>
                        ))}
                </nav>
                <Button className="hidden md:flex">Masuk</Button>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen (!isMenuOpen)}>
                    {isMenuOpen? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                </Button>
            </div>
        </div>


    </header>
  );
};

export default Navbar