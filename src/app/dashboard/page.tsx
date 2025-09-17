"use client";

import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { FaRegCopy } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaExternalLinkAlt } from "react-icons/fa";
import { RiPlayList2Fill } from "react-icons/ri";
import { CiImageOff } from "react-icons/ci";

import { useSearchParams } from "next/navigation";
import { SearchProvider, useSearch } from "@/app/context/SearchContext";

interface Youtube {
  id: number;
  url: string;
  name: string;
  user: {
    name: string;
  };
}

interface Playlist {
  id: number;
  name: string;
}

export default function Page({ user }: { user?: any }) {
  const [youtube, setYoutube] = useState<Youtube[]>([]);
  const [url, setUrl] = useState("");
  const [videoname, setVideoName] = useState("");
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false)
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [list, setList] = useState("")

   const { searchTerm } = useSearch();

  // Track selected videos
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
  const [addPlaylist, setAddPlaylist] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch videos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/youtube", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setYoutube(data.data || []);
        } else {
          console.error("Error fetching:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch playlists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/playlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Handle video selection
  const handleVideoSelect = (videoId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedVideos(prev => [...prev, videoId]);
    } else {
      setSelectedVideos(prev => prev.filter(id => id !== videoId));
    }
  };

  // Handle select all/none
  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedVideos(youtube.map(video => video.id));
    } else {
      setSelectedVideos([]);
    }
  };

  // Create new playlist
  const createPlaylist = async (name: string) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      console.log("Create Playlist Response:", data);

      if (res.ok) {
        // ✅ Since backend doesn't return playlist id, refetch playlists
        const refreshed = await fetch("/api/playlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const refreshedData = await refreshed.json();
        const latestPlaylist = refreshedData.data?.find((p: { name: string; }) => p.name === name);

        if (!latestPlaylist) {
          throw new Error("Could not find newly created playlist");
        }

        setPlaylist(prev => [...prev, latestPlaylist]);
        return latestPlaylist.id;
      } else {
        throw new Error(data.message || "Failed to create playlist");
      }
    } catch (error) {
      console.error("Create playlist error:", error);
      throw error;
    }
  };


  // Add videos to playlist
  const addVideosToPlaylist = async (playlistId: string) => {
    const token = localStorage.getItem("token");

    try {
      // Add each selected video to the playlist
      for (const contentId of selectedVideos) {
        const res = await fetch("/api/contend_playlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content_id: contentId,
            playlist_id: parseInt(playlistId)
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
      }
    } catch (error) {
      console.error("Add to playlist error:", error);
      throw error;
    }
  };


  // Save new video
  const handleSubmit = async () => {
    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, name: videoname }),
      });

      const data = await res.json();

      if (res.ok) {
        setYoutube((prev) => [...prev, { id: data.id || Date.now(), url, name: videoname, user: { name: "" } }]);
        setUrl("");
        setVideoName("");
        setIsOpen(false);
        showToast("URL added successfully!");
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

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

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/youtube/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setYoutube((prev) => prev.filter((item) => item.id !== id));
        setSelectedVideos(prev => prev.filter(videoId => videoId !== id));
        showToast("URL deleted successfully!");
      } else {
        const data = await res.json();
        console.error("Delete error:", data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const showToast = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 2000);
  };





  // Handle playlist submission
  const handlePlaylistSubmit = async () => {
    if (selectedVideos.length === 0) {
      setError("Please select at least one video");
      return;
    }

    if (isCreating && !newPlaylistName.trim()) {
      setError("Please enter a playlist name");
      return;
    }

    if (!isCreating && !selectedPlaylist) {
      setError("Please select a playlist");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      let playlistId = selectedPlaylist;

      // Create new playlist if needed
      if (isCreating) {
        playlistId = await createPlaylist(newPlaylistName.trim());
      }

      // Add videos to playlist
      await addVideosToPlaylist(playlistId);

      // Success - reset form and close modal
      setSelectedVideos([]);
      setSelectedPlaylist("");
      setNewPlaylistName("");
      setListOpen(false);
      showToast(`Successfully added ${selectedVideos.length} video(s) to playlist!`);

    } catch (error) {
      setError((error as Error).message || "Failed to add videos to playlist");
    } finally {
      setIsSubmitting(false);
    }
  };



  //  add play list api 

  // ✅ Unified playlist submit
  const handlePlaylistSubmitnew = async () => {


    if (selectedVideos.length === 0) {
      setError("Please select at least one video");
      return;
    }

    if (isCreating && !addPlaylist.trim()) {
      setError("Please enter a playlist name");
      return;
    }

    if (!isCreating && !selectedPlaylist) {
      setError("Please select a playlist");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      let playlistId: number | string = selectedPlaylist;

      // ✅ If creating, first create playlist
      if (isCreating) {
        const newPlaylist = await createPlaylist(addPlaylist.trim());
        playlistId = newPlaylist; // createPlaylist already returns ID
      }

      // ✅ Add all selected videos to that playlist
      await addVideosToPlaylist(playlistId.toString());

      // ✅ Reset state
      setSelectedVideos([]);
      setSelectedPlaylist("");
      setAddPlaylist("");
      setListOpen(false);
      showToast(`Successfully added ${selectedVideos.length} video(s) to playlist!`);
    } catch (error) {
      setError((error as Error).message || "Failed to add videos to playlist");
    } finally {
      setIsSubmitting(false);
    }
  };





  return (
    <>
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {successMsg}
        </div>
      )}

      <main className="">
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
          </div> */}
          <div className="bg-[#fff9fa] md:flex items-center justify-between px-[26px] py-[15px]">
            <div className="">
              <div className="text-2xl font-bold text-slate-800">Listing your Videos</div>
              <div className="text-slate-600">Manage your videos</div>
            </div>
            <div className="flex items-center gap-4 justify-end md:justify-start py-3 md:py-0">
              {selectedVideos.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    {selectedVideos.length} selected
                  </span>
                  <button
                    onClick={() => setListOpen(true)}
                    className="bg-[#4c4c4c] text-[#ffffff] text-[14px] md:text-[16px] font-medium px-[8px] md:px-3 py-2 rounded-md flex items-center md:gap-3 gap-2 shadow-sm transition-all hover:shadow-lg"
                  >
                    <RiPlayList2Fill className="h-4 w-4 text-[#ffffff]" />
                    <span>Add to Playlist</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsOpen(true)}
                className="bg-[#d40924] text-[#ffffff] text-[14px] md:text-[16px] font-medium px-[8px] md:px-3 py-2 rounded-md flex items-center md:gap-3 gap-2 shadow-sm transition-all hover:shadow-lg"
              >
                <IoMdAdd className="h-4 w-4 text-[#ffffff]" />
                <span>Add Videos</span>
              </button>
            </div>
          </div>

          {/* Video Grid */}
          <div className="md:p-6 px-6 pb-6">
            {youtube.length === 0 ? (
              <p className="text-center text-slate-500">No videos added yet.</p>
            ) : (
              <>
                {/* Select All Checkbox */}
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={selectedVideos.length === youtube.length && youtube.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="selectAll" className="text-sm text-slate-600">
                    Select All ({youtube.length} videos)
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {youtube
                    .filter((item) =>
                      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.url.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`bg-[#fff9fa] rounded-lg shadow-md border overflow-hidden flex flex-col relative justify-between transition-all ${selectedVideos.includes(item.id)
                            ? "border-[#d40924] ring-2 ring-[#d40924]/20"
                            : "border-slate-200"
                          }`}
                      >
                        <input
                          type="checkbox"
                          className="absolute right-3 top-2 z-[1]"
                          checked={selectedVideos.includes(item.id)}
                          onChange={(e) => handleVideoSelect(item.id, e.target.checked)}
                        />

                        <div className="relative w-full h-[127px] flex items-center justify-center">
                          {getPreview(item.url)}
                        </div>

                        <div className="relative w-full flex items-center justify-center font-medium p-2">
                          {item.name}
                        </div>

                        <div className="p-4 pt-0 flex justify-between items-center">
                          <span className="text-slate-800 text-sm truncate flex-1 mr-2 bg-gray-100 p-1 rounded">
                            {item.url}
                          </span>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors"
                          >
                            <RiDeleteBin6Line className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

              </>
            )}
          </div>
        </div>
      </main>

      {/* Add Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#00000067] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#ffffff] rounded-2xl shadow-2xl w-96 max-w-[90vw] border border-slate-700/50 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d40924] rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Add New URL</h2>
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

            <div className="space-y-6 px-6 pb-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Name
                </label>
                <input
                  type="text"
                  value={videoname}
                  onChange={(e) => setVideoName(e.target.value)}
                  placeholder="Enter video title"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d40924] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/video"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d40924] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
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
                Add Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Playlist Modal */}
      {listOpen && (
        <div className="fixed inset-0 bg-[#00000067] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-96 max-w-[90vw] relative">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#d40924] rounded-lg flex items-center justify-center">
                  <RiPlayList2Fill className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add {selectedVideos.length} Video(s) to Playlist
                </h2>
              </div>
              <button
                onClick={() => setListOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex rounded-lg bg-[#fff9fa] p-1 mb-4">
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setSelectedPlaylist("");
                    setNewPlaylistName("");
                    setError("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${isCreating
                    ? 'bg-[#d40924] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedPlaylist("");
                    setNewPlaylistName("");
                    setError("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${!isCreating
                    ? 'bg-[#d40924] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Select Existing
                </button>
              </div>

              <div className="">
                {isCreating ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Playlist Name
                    </label>
                    <input
                      type="text"
                      value={addPlaylist}
                      onChange={(e) => setAddPlaylist(e.target.value)}
                      placeholder="Enter playlist name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d40924] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    />


                    <div className="flex items-center gap-6 justify-end p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                      <button
                        onClick={() => setListOpen(false)}
                        className="px-6 py-2.5 text-gray-700 bg-[#bebebe] font-medium rounded-lg transition-colors cursor-pointer"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handlePlaylistSubmitnew}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-[#d40924] text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Adding..." : "Save"}
                      </button>


                    </div>

                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Playlist
                    </label>
                    <div className="relative">
                      <select
                        value={selectedPlaylist}
                        onChange={(e) => setSelectedPlaylist(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d40924] focus:border-transparent bg-white text-gray-900 appearance-none cursor-pointer"
                      >
                        <option value="">Choose from existing playlists</option>
                        {playlist.map((list) => (
                          <option key={list.id} value={list.id}>
                            {list.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 justify-end p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                      <button
                        onClick={() => setListOpen(false)}
                        className="px-6 py-2.5 text-gray-700 bg-[#bebebe] font-medium rounded-lg transition-colors cursor-pointer"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handlePlaylistSubmitnew}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-[#d40924] text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Adding..." : "Save"}
                      </button>
                    </div>

                  </div>




                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}