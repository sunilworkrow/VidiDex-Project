"use client";
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image"
import Link from "next/link";
import { SearchProvider, useSearch } from "@/app/context/SearchContext";
import { MdOutlinePlaylistAdd } from "react-icons/md";

interface Playlist {
  id: number;
  name: string;
  user: { name: string };
}

export default function Page({ user }: Playlist) {
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [list, setList] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitMode, setIsSubmitMode] = useState(false); // ✅ toggle state

  const { searchTerm } = useSearch();

  // fetch data when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/playlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setPlaylist(data.data || []);
        } else {
          console.error("Error fetching:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  // save new playlist
  const handleSubmit = async () => {
    if (!list.trim()) {
      setError("Name is required");
      return;
    }
    setError("");

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: list }),
      });

      const data = await res.json();
      if (res.ok) {
        setPlaylist((prev) => [...prev, { id: data.id || Date.now(), name: list, user: user },
        ]);
        setList("");
        setIsOpen(false);

        // ✅ Different toast message for Save vs Submit
        showToast(isSubmitMode ? "Submitted successfully!" : "Saved successfully!");
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };




  // delete playlist
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/playlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }), // ✅ send playlist id
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ remove from local state so UI updates instantly
        setPlaylist((prev) => prev.filter((item) => item.id !== id));
        showToast("Playlist deleted successfully!");
      } else {
        console.error("Delete error:", data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };







  // ✅ Toast utility
  const showToast = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <>
      {/* ✅ Success Toast */}
      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {successMsg}
        </div>
      )}

      <main className="">

        {/* Playlist Table */}
        <div className="shadow-sm border-slate-200 bg-[#fff9fa] overflow-hidden rounded-md">

          {/* <div className="flex items-center max-w-2xl pl-6 bg-white rounded-[39px] border-gray-300 border-[1px] w-full overflow-hidden">
            <div className="relative flex-1">

              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:outline-none w-full pr-3"
              />

            </div>
            <button className=" text-white px-8 py-3 bg-[#f3f3f3] rounded-r-[39px] border-gray-200 border-r-[1px] cursor-pointer hover:bg-[#e5e3e3]">
              <CiSearch className=" text-slate-600 h-5 w-5" />
            </button>
          </div>  */}

          <div className="bg-[#fff9fa] flex items-center justify-between px-[26px] py-[15px]">
            <div className="">
              <div className="text-2xl font-bold text-slate-800">PlayList</div>
              <div className="text-slate-600">Manage your playlist</div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#d40924] text-[#ffffff] font-medium px-3 py-2 rounded-md flex items-center gap-3 shadow-sm transition-all hover:shadow-lg"
            >
              <IoMdAdd className="h-5 w-5 text-[#ffffff]" />
              <span>Add New</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {playlist
                .filter((list) =>
                  list.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((list, index) => (
                  <Link key={list.id} href={`/dashboard/playlist_contend/${list.id}`}>
                    <div
                      className="bg-[#fff9fa] rounded-lg shadow-md border border-slate-200 
                 overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition"
                    >
                      <div className="relative h-32 my-4 mx-auto md:w-[80%] w-[50%] bg-black/70 text-white text-xs px-2 py-2 rounded-md">
                        <Image
                          src="/img/bg.jpg"
                          alt={list.name}
                          width={300}
                          height={200}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>

                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="text-slate-800 font-semibold text-lg">
                            {list.name}
                          </h3>
                          <p className="text-slate-500 text-sm">Playlist #{index + 1}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>

      {isOpen && (
        <div className="fixed inset-0 bg-[#00000067] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#ffffff] rounded-2xl shadow-2xl w-96 max-w-[90vw] border border-slate-700/50 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d40924] rounded-xl flex items-center justify-center">
                  <MdOutlinePlaylistAdd size={24} className="text-[#ffffff]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Add New Playlist</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ✅ Use `list` instead of `url` */}
            <div className="space-y-6 px-6 pb-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={list}
                  onChange={(e) => setList(e.target.value)}
                  placeholder="Enter playlist name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d40924] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />

                {/* ✅ Show error message */}
                {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
              </div>
            </div>

            <div className="flex items-center gap-6 justify-end p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 text-gray-700 bg-[#bebebe] font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-[#d40924] text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}




    </>
  );
}
