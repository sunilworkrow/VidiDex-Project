"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { IoMdArrowRoundBack } from "react-icons/io"
import { CiImageOff } from "react-icons/ci"
import { usePublicSearch } from "@/app/public/searchContext";

export default function Page() {
  const { key, id } = useParams() as { key: string; id: string }
  const playlistId = id

  const { searchQuery } = usePublicSearch();

  const [contents, setContents] = useState<any[]>([])
  const [playlistName, setPlaylistName] = useState<string>("")
  const [filteredContents, setFilteredContents] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredContents(contents);
    } else {
      setFilteredContents(
        contents.filter(
          (c) =>
            c.content_name.toLowerCase().includes(searchQuery.toLowerCase())||
            c.content_url.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, contents]);



  // ---------- Helpers ----------
  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const extractInstagramId = (url: string) => {
    const match = url.match(/instagram\.com\/reel\/([^/?]+)/)
    return match ? match[1] : null
  }

  const getPreview = (url: string) => {
    // YouTube → show thumbnail
    const ytId = extractYouTubeId(url)
    if (ytId) {
      return (
        <img
          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
          alt="YouTube thumbnail"
          className="w-32 h-20 object-cover rounded-md shadow-sm border border-border"
        />
      )
    }

    // Instagram Reel → placeholder
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

  // ---------- Fetch contents ----------
  useEffect(() => {
    if (!playlistId) return

    const fetchContents = async () => {
      try {
        const res = await fetch(`/api/public/playlist_contend/${playlistId}`)
        const data = await res.json()

        console.log("datadatadata", data)

        if (data.success) {
          setContents(data.contents)
          setFilteredContents(data.contents)
          if (data.contents.length > 0) {
            setPlaylistName(data.contents[0].playlist_name) // take from first row
          }
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Something went wrong (fetch playlist contents)")
      } finally {
        setIsLoading(false)
      }
    }

    fetchContents()
  }, [playlistId])

  useEffect(() => {
    setFilteredContents(contents)
  }, [contents])

  // ---------- UI ----------
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="p-6 bg-[#fff9fa]">
      {/* Header */}
      <div className="flex items-center justify-between py-[15px]">
        <div>
          <div className="text-2xl font-bold text-slate-800">{playlistName}</div>
          <div className="text-slate-600">Manage your videos</div>
        </div>
        <div>
          <Link href={`/public/${key}/playlist`}>
            <button className="bg-[#4c4c4c] text-[#ffffff] text-[14px] md:text-[16px] font-medium px-[8px] md:px-3 py-2 rounded-md flex items-center md:gap-3 gap-2 shadow-sm transition-all hover:shadow-lg">
              <IoMdArrowRoundBack className="h-4 w-4 text-[#ffffff]" />
              <span>Back to Playlist</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Playlist contents */}
      {filteredContents.length === 0 ? (
        <p>No videos found</p>
      ) : (
        <div className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredContents.map((item) => (
              <div
                key={item.id}
                className="bg-[#fff9fa] rounded-lg shadow-md border border-slate-200 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative w-full h-[127px] flex items-center justify-center">
                  {getPreview(item.content_url)}
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <p className="relative w-full flex items-center justify-center font-medium">
                    {item.content_name}
                  </p>
                  <p className="text-slate-800 text-sm truncate flex-1 mr-2 bg-gray-100 rounded">
                    {item.content_url}
                  </p>

                  <Link
                    href={item.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#d40924] text-[#ffffff] flex justify-center mx-auto px-4 py-1 font-medium rounded-md shadow-sm transition-all hover:shadow-lg"
                  >
                    Open Video
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredContents.length === 0 && !isLoading && (
            <div className="shadow-sm border-0 bg-card/70 backdrop-blur-sm">
              <div className="p-12 text-center">
                <div className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No videos found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms." : "No video listings available yet."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setFilteredContents(contents)
                    }}
                    className="border-border hover:bg-muted"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
