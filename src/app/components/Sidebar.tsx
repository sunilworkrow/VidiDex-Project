"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoVideocamOutline } from "react-icons/io5";
import { LuLayoutDashboard, LuMenu, LuX } from "react-icons/lu";
import Image from "next/image";

interface SidebarProps {
  darkMode: boolean;
}

export default function Sidebar({ darkMode }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "All Videos", icon: <LuLayoutDashboard /> },
    { href: "/dashboard/playlist", label: "PlayList", icon: <IoVideocamOutline /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-1 rounded-md bg-white border border-gray-200"
      >
        {isMobileMenuOpen ? <LuX size={24} /> : <LuMenu size={18} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#00000088] bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          
          md:w-64 md:h-full md:relative md:translate-x-0
          
          fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:block
          border-[1px] border-[#f3f3f3] 
          ${darkMode ? "bg-[#ffffff]" : "bg-gray-100"} 
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#f3f3f3] flex items-center gap-2">
          <div className="w-6 h-6 bg-[#d40924] rounded-md flex items-center justify-center">
            <Image src="/img/logo.png" alt="" height={60} width={60} />
          </div>
          <h1 className="font-bold text-lg">Workrow</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href!}
              onClick={closeMobileMenu} // Close mobile menu when navigating
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#fff9fa] ${
                pathname === item.href
                  ? "bg-[#fff9fa] border-b-[1px] border-[#fff9fa] "
                  : "border-b-[1px] border-[#f3f3f3]"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}