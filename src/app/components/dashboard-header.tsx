"use client"

import { CiSearch } from "react-icons/ci"
import { useEffect, useState } from "react"
import { FaRegCopy } from "react-icons/fa"
import { useSearch } from "@/app/context/SearchContext"

type Props = {
  onLogout: () => void
}

type UserType = {
  name: string
  image?: string
  user: {
    unique_key: string
  }
}

export default function DashboardHeader({ onLogout }: Props) {
  const [user, setUser] = useState<UserType | null>(null)
  const [successMsg, setSuccessMsg] = useState("")
  const { searchTerm, setSearchTerm } = useSearch()

  const publicUrl = user?.user?.unique_key ? `http://localhost:3000/public/${user.user.unique_key}` : ""

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch("/api/get-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await res.json()
      console.log("API response:", result)

      if (result.success) {
        const firstName = result.data.name || ""
        const lastName = result.data.lastName || "" // last name
        const fullName = `${firstName} ${lastName}`.trim()

        setUser({
          name: fullName,
          image: result.data.image,
          user: {
            unique_key: result.data.unique_key, // ✅ now stored
          },
        })
      }
    }

    fetchUser()
  }, [])

  if (!user) {
    return <p className="text-gray-400">Loading...</p>
  }

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ")
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase()
  }

  const showToast = (message: string) => {
    setSuccessMsg(message)
    setTimeout(() => setSuccessMsg(""), 2000)
  }

  return (
    <>
      <header className="p-4 text-gray-800 sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-[70px] border-b border-[#f3f3f3] pb-4">
          <div className="flex-shrink-0">
            <h1 className="pl-[52px] md:pl-0 text-xl md:text-2xl font-bold bg-gradient-to-r from-[#d40924] to-[#d40924] bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center max-w-2xl lg:pl-6 bg-white rounded-[39px] border-gray-300 border-[1px] w-full lg:flex-1 overflow-hidden order-3 lg:order-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search campaign, customer, etc."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:outline-none w-full pl-4 lg:pl-0 pr-3 py-3 lg:py-0 text-sm"
              />
            </div>
            <button className="text-white px-6 lg:px-8 py-3 bg-[#f3f3f3] rounded-r-[39px] border-gray-200 border-r-[1px] cursor-pointer hover:bg-[#e5e3e3]">
              <CiSearch className="text-slate-600 h-5 w-5" />
            </button>
          </div>

          <div className="md:flex items-center gap-4 order-2 lg:order-3">
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 rounded-full bg-red-700 overflow-hidden flex items-center justify-center shadow-sm">
                {user.image ? (
                  <img src={user.image || "/placeholder.svg"} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#d40924]">
                    <span className="text-white font-bold text-sm">{getInitials(user.name)}</span>
                  </div>
                )}
              </div>
              <div className="block">
                <p className="font-medium text-slate-800 text-sm lg:text-base">{user.name}</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
              <button
                onClick={onLogout}
                className="rounded-lg border border-slate-300 hover:border-slate-400 text-xs lg:text-sm px-3 lg:px-4 py-2 cursor-pointer transition-colors hover:bg-slate-50 text-slate-700"
              >
                Logout
              </button>

            </div>

            {/* mobile view */}

            <div className="md:hidden flex items-center gap-2 lg:gap-3 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-700 overflow-hidden flex items-center justify-center shadow-sm">
                  {user.image ? (
                    <img src={user.image || "/placeholder.svg"} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#d40924]">
                      <span className="text-white font-bold text-sm">{getInitials(user.name)}</span>
                    </div>
                  )}
                </div>
                <div className="block">
                  <p className="font-medium text-slate-800 text-sm lg:text-base">{user.name}</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="rounded-lg border border-slate-300 hover:border-slate-400 text-xs lg:text-sm px-3 lg:px-4 py-2 cursor-pointer transition-colors hover:bg-slate-50 text-slate-700"
              >
                Logout
              </button>

            </div>


          </div>
        </div>

        <div className="mt-4 lg:mt-6">
          <div className="bg-white shadow-sm border-slate-200 overflow-hidden rounded-md">
            <div className="px-3 lg:px-4 py-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-slate-600 font-medium text-sm whitespace-nowrap">Active URL:</span>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={publicUrl}
                    disabled
                    className="flex-1 bg-[#fff9fa] text-slate-700 cursor-not-allowed border-slate-200 font-mono text-xs lg:text-sm p-2 rounded border"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publicUrl)
                      showToast("Copied to clipboard!")
                    }}
                    className="h-10 w-10 hover:bg-slate-50 border-slate-200 border rounded flex items-center justify-center flex-shrink-0"
                  >
                    <FaRegCopy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {successMsg && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 text-sm">
          {successMsg}
        </div>
      )}
    </>
  )
}
