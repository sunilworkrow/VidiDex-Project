"use client";

import Sidebar from "@/app/components/Sidebar";
import DashboardHeader from "@/app/components/dashboard-header";
import { UserProvider, useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchProvider } from "@/app/context/SearchContext";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <SearchProvider>
                <DashboardContent>{children}</DashboardContent>
            </SearchProvider>
        </UserProvider>
    );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { user, logout } = useUser();

    const darkMode = true;

    const router = useRouter();
    const pathname = usePathname();



    return (
        <>

            <div className={`flex h-screen ${darkMode ? "bg-[#f3f3f3]" : "bg-white text-black"}`}>
                <Sidebar darkMode={darkMode} />
                <div className="flex-1 overflow-auto">
                    <DashboardHeader onLogout={logout} />
                    <main className="">
                        {children}
                    </main>
                </div>
            </div>

        </>
    );
}
