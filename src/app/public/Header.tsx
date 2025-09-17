"use client"

import { CiSearch, CiBellOn } from "react-icons/ci";
import { usePublicSearch } from "@/app/public/searchContext";


export default function Header({ onSearch }: { onSearch?: (q: string) => void }) {

  const { searchQuery, setSearchQuery } = usePublicSearch();

  return (
    <header className="p-4 text-gray-800 sticky top-0 bg-white/95 backdrop-blur-md z-10">
      <div className=" flex items-center justify-between md:gap-[70px] gap-3 border-b border-[#f3f3f3] pb-4">
        <div className="pl-[40px] md:pl-0 ">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#d40924] to-[#d40924] bg-clip-text text-transparent">
            Home
          </h1>
        </div>

        <div className="flex items-center max-w-2xl pl-6 bg-white rounded-[39px] border-gray-300 border-[1px] w-full overflow-hidden">
          <div className="relative flex-1 md:text-[16px] text-[14px]">

            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:outline-none w-full pr-3"
            />


          </div>
          <button className=" text-white md:px-8 md:py-3 px-4 py-2 bg-[#f3f3f3] rounded-r-[39px] border-gray-200 border-r-[1px] cursor-pointer hover:bg-[#e5e3e3]">
            <CiSearch size={18} className=" text-slate-600" />
          </button>
        </div>


      </div>


    </header>
  )
}
