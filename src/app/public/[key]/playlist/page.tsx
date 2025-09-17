"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { IoSearchSharp } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image"
// import { Search, ExternalLink, Youtube, Settings, Loader2 } from "lucide-react"
import { usePublicSearch } from "@/app/public/searchContext";


export default function Page() {


  const params = useParams()
  const key = params.key as string

   const { searchQuery } = usePublicSearch();
  

  const [userId, setUserId] = useState<number | null>(null)
  const [playlist, setPlaylist] = useState<any[]>([])
  const [filteredContents, setFilteredContents] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
      if (!searchQuery.trim()) {
        setFilteredContents(playlist);
      } else {
        setFilteredContents(
          playlist.filter(
            (c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
    }, [searchQuery, playlist]);



  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const extractInstagramId = (url: string) => {
    const match = url.match(/instagram\.com\/reel\/([^/?]+)/)
    return match ? match[1] : null
  }


  // Step 1: Get userId from unique key
  useEffect(() => {
    if (!key) return

    const fetchUserId = async () => {
      try {
        const res = await fetch(`/api/public/${key}`)
        const data = await res.json()

        if (data.success) {
          setUserId(data.userId)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Something went wrong (fetch userId)")
      }
    }

    fetchUserId()
  }, [key])

  // Step 2: Once userId is set → fetch contents
  useEffect(() => {
    if (!userId) return

    const fetchContents = async () => {
      try {
        const res = await fetch(`/api/public/playlist/${userId}`)
        const data = await res.json()

        if (data.success) {
          setPlaylist(data.contents)
          setFilteredContents(data.contents)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Something went wrong (fetch contents)")
      } finally {
        setIsLoading(false)
      }
    }

    fetchContents()
  }, [userId])

  useEffect(() => {
    setFilteredContents(playlist)
  }, [playlist])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="p-6 text-center">
            <div className="text-destructive mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Error</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (

    <div className="container mx-auto p-6 bg-[#fff9fa]">
      <div className=" flex items-center justify-between py-[15px]">
        <div className="">
          <div className="text-2xl font-bold text-slate-800">Playlist your Videos</div>
          <div className="text-slate-600">Manage your playlist</div>
        </div>
        <div className="bg-secondary text-secondary-foreground">
          {filteredContents.length} {filteredContents.length === 1 ? "item" : "items"}
        </div>

      </div>



      {isLoading ? (
        <div className="shadow-sm border-0 bg-card/70 backdrop-blur-sm">
          <div className="p-12 text-center">
            <div className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your Playlistings...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredContents.map((content, index) => (
              <Link key={content.id} href={`/public/${key}/playlist_contend/${content.id}`}>
              <div className="bg-[#fff9fa] rounded-lg shadow-md border border-slate-200 overflow-hidden flex flex-col">
                <div className="relative h-32 my-4 mx-auto md:w-[80%] w-[50%] bg-black/70 text-white text-xs px-2 py-2 rounded-md">
                  <Image
                    src="/img/bg.jpg"
                    alt=""
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  {/* Overlay badge for video count */}

                </div>

                <div className="relative w-full py-3 font-medium text-[16px] flex items-center justify-center capitalize">
                  {content.name}
                </div>
               
              </div>
              </Link>
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
                      setFilteredContents(playlist)
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
