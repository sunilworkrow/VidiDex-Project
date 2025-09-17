"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CiImageOff, CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { SearchProvider, useSearch } from "@/app/context/SearchContext";


interface PlaylistContent {
  id: number;
  content_id: number;
  content_url: string;
  content_name: string;
  playlist_id: number;
  playlist_name: string;

}

export default function PlaylistContendPage() {
  const { id } = useParams(); // ✅ playlist_id from URL
  const { searchTerm } = useSearch();
  const [contents, setContents] = useState<PlaylistContent[]>([]);
  const [loading, setLoading] = useState(true);
  // const [searchTerm, setSearchTerm] = useState("");

  // store playlist name
  const [playlistName, setPlaylistName] = useState<string>("");

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/contend_playlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          const playlistId = Number(id); // convert once

          const filtered = data.data.filter(
            (item: PlaylistContent) => item.playlist_id === playlistId
          );
          setContents(filtered);

          // ✅ take playlist_name from first item (if available)
          if (filtered.length > 0) {
            setPlaylistName(filtered[0].playlist_name);
          }
        } else {
          console.error("Error fetching:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchContents();
  }, [id]);


  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const extractInstagramId = (url: string) => {
    const match = url.match(/instagram\.com\/reel\/([^/?]+)/)
    return match ? match[1] : null
  }


  const getPreview = (url: string) => {
    const ytId = extractYouTubeId(url)
    if (ytId) {
      return (
        <img
          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
          alt="YouTube thumbnail"
          className="w-44 h-20 object-cover rounded-md shadow-sm border border-border"
        />
      )
    }

    const instaId = extractInstagramId(url)
    if (instaId) {
      return (
        <div className="w-32 h-20 flex items-center justify-center rounded-md shadow-sm border border-border text-muted-foreground">
          <CiImageOff size={28} />
        </div>
      )
    }

    return <span className="text-muted-foreground text-xs">No Preview</span>
  }


  if (loading) return <p className="p-6 bg-[#fff9fa]">Loading...</p>;

  return (
    <main className="shadow-sm border-slate-200 bg-[#fff9fa] overflow-hidden rounded-md">

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
      </div> */}
      <div className="bg-[#fff9fa] flex items-center justify-between px-[26px] py-[15px]">
        <div className="">
          <div className="text-2xl font-bold text-slate-800">{playlistName}</div>
          <div className="text-slate-600">Manage your videos</div>
        </div>

        <Link href="/dashboard/playlist">
          <button
            className="bg-[#4c4c4c] text-[#ffffff] text-[14px] md:text-[16px] font-medium px-[8px] md:px-3 py-2 rounded-md flex items-center md:gap-3 gap-2 shadow-sm transition-all hover:shadow-lg"
          >
            <IoMdArrowRoundBack className="h-4 w-4 text-[#ffffff]" />
            <span>Back to Playlist</span>
          </button>
        </Link>

      </div>

      {contents.length === 0 ? (
        <p>No contents in this playlist yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {contents.
            filter((item) =>
              item.content_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.content_url.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <div
                key={item.id}
                className="bg-[#fff9fa] rounded-lg shadow-md border overflow-hidden flex flex-col relative justify-between transition-all border-slate-200"
              >
                {/* <h3 className="text-lg font-semibold"></h3>
              <h3 className="text-lg font-semibold"></h3>
              <p className="text-sm text-gray-500">
                Content ID: {item.content_id}
              </p> */}

                <div className="relative w-full h-[127px] flex items-center justify-center">
                  {getPreview(item.content_url)}
                </div>

                <div className="relative w-full flex items-center justify-center font-medium p-2">
                  {item.content_name}
                </div>

                <div className="p-4 pt-0 flex justify-between items-center">
                  <span className="text-slate-800 text-sm truncate flex-1 mr-2 bg-gray-100 p-1 rounded">
                    {item.content_url}
                  </span>

                </div>

              </div>
            ))}
        </div>
      )}
    </main>
  );
}
