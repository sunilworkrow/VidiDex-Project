"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import Image from "next/image";
import { IoVideocamOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuMenu, LuX } from "react-icons/lu";
import { useState, useEffect } from "react";
import { HiMenuAlt3 } from "react-icons/hi";

export default function Sidebar() {
    const pathname = usePathname()
    const params = useParams()
    const key = params.key as string
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const menuItems = [
        { name: "All Videos", href: `/public/${key}`, icon: <LuLayoutDashboard /> },
        { name: "PlayList", href: `/public/${key}/playlist`, icon: <IoVideocamOutline /> },
    ]

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-[19px] left-4 z-30 p-1 rounded-md bg-white border border-gray-200"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? (
                    <LuX size={24} />
                ) : (
                    <HiMenuAlt3 size={18} className=" text-gray-600" />
                )}
            </button>

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-[#00000088] bg-opacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                w-64 h-[100vh] border-[1px] border-[#f3f3f3] bg-[#ffffff] flex flex-col
                md:relative md:translate-x-0 md:opacity-100
                fixed top-0 left-0 z-40 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:block
            `}>
                <div className="p-4 border-b border-[#f3f3f3] flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#d40924] rounded-md flex items-center justify-center">
                        <Image src="/img/logo.png" alt="" height={60} width={60} />
                    </div>
                    <h1 className="font-bold text-lg">Workrow</h1>
                </div>
                <nav className="flex-1 p-2 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#fff9fa] ${pathname === item.href
                                    ? "bg-[#fff9fa] border-b-[1px] border-[#fff9fa]"
                                    : "border-b-[1px] border-[#f3f3f3]"
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    )
}