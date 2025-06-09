"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Grid, List, Search, Plus, Filter } from "lucide-react";

export default function LibraryPage() {
  const { data: session } = useSession();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Mock playlists data
  const playlists = [
    {
      id: "1",
      name: "Liked Songs",
      owner: "You",
      image: "https://misc.scdn.co/liked-songs/liked-songs-640.png",
      pinned: true,
      type: "playlist"
    },
    {
      id: "2",
      name: "Discover Weekly",
      owner: "Spotify",
      image: "https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VNfzWuUCQ_FGiEFA==/bmVuZW5lbmVuZW5lbmVuZQ==",
      pinned: false,
      type: "playlist"
    },
    {
      id: "3",
      name: "Release Radar",
      owner: "Spotify",
      image: "https://newjams-images.scdn.co/image/ab67647800003f8a/dt/v3/release-radar/ab6761610000e5eb8278b782cbb5a3963db88ada/en",
      pinned: false,
      type: "playlist"
    },
    {
      id: "4",
      name: "Daily Mix 1",
      owner: "Spotify",
      image: "https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb8278b782cbb5a3963db88ada/1/en/default",
      pinned: false,
      type: "playlist"
    },
    {
      id: "5",
      name: "Rock Classics",
      owner: "You",
      image: "https://i.scdn.co/image/ab67706f00000002b5d03b4e18a8c5d2f5328eb0",
      pinned: true,
      type: "playlist"
    },
    {
      id: "6",
      name: "Peaceful Piano",
      owner: "Spotify",
      image: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6",
      pinned: false,
      type: "playlist"
    },
    {
      id: "7",
      name: "Lo-Fi Beats",
      owner: "You",
      image: "https://i.scdn.co/image/ab67706f000000025ea54b91b073c2776b966e7b",
      pinned: false,
      type: "playlist"
    },
    {
      id: "8",
      name: "Workout Mix",
      owner: "You",
      image: "https://i.scdn.co/image/ab67706f000000029249b35f23fb596b6f006a15",
      pinned: false,
      type: "playlist"
    }
  ];

  // Filter playlists based on search query
  const filteredPlaylists = playlists.filter(playlist => 
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group playlists by pinned status
  const pinnedPlaylists = filteredPlaylists.filter(playlist => playlist.pinned);
  const otherPlaylists = filteredPlaylists.filter(playlist => !playlist.pinned);

  // Library navigation items
  const libraryNavItems = [
    { label: "Playlists", href: "/dashboard/collection/playlists", active: true },
    { label: "Artists", href: "/dashboard/collection/artists", active: false },
    { label: "Albums", href: "/dashboard/collection/albums", active: false },
    { label: "Podcasts", href: "/dashboard/collection/podcasts", active: false }
  ];

  return (
    <div className="pb-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Library</h1>
          <div className="flex items-center gap-2">
            {showSearch ? (
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in Your Library"
                  className="w-64 pl-10 pr-4 py-2 bg-[var(--card)] border border-[var(--accent)] rounded-full text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  autoFocus
                  onBlur={() => searchQuery === "" && setShowSearch(false)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
              </div>
            ) : (
              <button 
                onClick={() => setShowSearch(true)}
                className="p-2 hover:bg-[var(--hover-light)] rounded-full transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
            <button className="p-2 hover:bg-[var(--hover-light)] rounded-full transition-colors">
              <Plus className="h-5 w-5" />
            </button>
            <div className="flex border-l border-[var(--accent)] pl-2 ml-2">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 hover:bg-[var(--hover-light)] rounded-full transition-colors ${viewMode === "grid" ? "text-[var(--primary)]" : ""}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 hover:bg-[var(--hover-light)] rounded-full transition-colors ${viewMode === "list" ? "text-[var(--primary)]" : ""}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {libraryNavItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                item.active 
                  ? "bg-white text-black font-medium" 
                  : "bg-[var(--card)] hover:bg-[var(--card-hover)] text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
          <button className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap bg-[var(--card)] hover:bg-[var(--card-hover)] flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {filteredPlaylists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-xl font-semibold mb-2">No matching playlists found</p>
            <p className="text-[var(--text-muted)]">Try a different search term</p>
          </div>
        ) : (
          <>
            {/* Pinned playlists section */}
            {pinnedPlaylists.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-4">Pinned</h2>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {pinnedPlaylists.map((playlist) => (
                      <a 
                        key={playlist.id}
                        href={`/dashboard/playlist/${playlist.id}`}
                        className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer group"
                      >
                        <div className="relative mb-4">
                          <img 
                            src={playlist.image} 
                            alt={playlist.name}
                            className="w-full aspect-square object-cover rounded-md shadow-md"
                          />
                          <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            <svg className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <h3 className="font-semibold truncate">{playlist.name}</h3>
                        <p className="text-sm text-[var(--text-muted)] truncate">{playlist.owner}</p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pinnedPlaylists.map((playlist) => (
                      <a 
                        key={playlist.id}
                        href={`/dashboard/playlist/${playlist.id}`}
                        className="flex items-center gap-3 p-2 hover:bg-[var(--card-hover)] rounded-md transition-colors"
                      >
                        <img 
                          src={playlist.image} 
                          alt={playlist.name}
                          className="w-12 h-12 rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{playlist.name}</h3>
                          <div className="flex items-center text-sm text-[var(--text-muted)]">
                            <span className="truncate">{playlist.type.charAt(0).toUpperCase() + playlist.type.slice(1)} • {playlist.owner}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other playlists section */}
            <div>
              {pinnedPlaylists.length > 0 && <h2 className="text-lg font-bold mb-4">Your Playlists</h2>}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {otherPlaylists.map((playlist) => (
                    <a 
                      key={playlist.id}
                      href={`/dashboard/playlist/${playlist.id}`}
                      className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer group"
                    >
                      <div className="relative mb-4">
                        <img 
                          src={playlist.image} 
                          alt={playlist.name}
                          className="w-full aspect-square object-cover rounded-md shadow-md"
                        />
                        <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <svg className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="font-semibold truncate">{playlist.name}</h3>
                      <p className="text-sm text-[var(--text-muted)] truncate">{playlist.owner}</p>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {otherPlaylists.map((playlist) => (
                    <a 
                      key={playlist.id}
                      href={`/dashboard/playlist/${playlist.id}`}
                      className="flex items-center gap-3 p-2 hover:bg-[var(--card-hover)] rounded-md transition-colors"
                    >
                      <img 
                        src={playlist.image} 
                        alt={playlist.name}
                        className="w-12 h-12 rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{playlist.name}</h3>
                        <div className="flex items-center text-sm text-[var(--text-muted)]">
                          <span className="truncate">{playlist.type.charAt(0).toUpperCase() + playlist.type.slice(1)} • {playlist.owner}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 