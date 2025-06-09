"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Clock, Search, MoreHorizontal, Play } from "lucide-react";

export default function LikedSongsPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  // Mock liked songs data
  const likedSongs = [
    {
      id: "1",
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      addedAt: "2023-09-15",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
    },
    {
      id: "2",
      title: "Save Your Tears",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:35",
      addedAt: "2023-09-14",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
    },
    {
      id: "3",
      title: "Starboy",
      artist: "The Weeknd, Daft Punk",
      album: "Starboy",
      duration: "3:50",
      addedAt: "2023-09-10",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
    },
    {
      id: "4",
      title: "Die For You",
      artist: "The Weeknd",
      album: "Starboy",
      duration: "4:20",
      addedAt: "2023-09-05",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
    },
    {
      id: "5",
      title: "Flowers",
      artist: "Miley Cyrus",
      album: "Endless Summer Vacation",
      duration: "3:21",
      addedAt: "2023-08-28",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
    },
    {
      id: "6",
      title: "As It Was",
      artist: "Harry Styles",
      album: "Harry's House",
      duration: "2:47",
      addedAt: "2023-08-20",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
    },
    {
      id: "7",
      title: "Unholy",
      artist: "Sam Smith, Kim Petras",
      album: "Gloria",
      duration: "2:36",
      addedAt: "2023-08-15",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
    },
    {
      id: "8",
      title: "Anti-Hero",
      artist: "Taylor Swift",
      album: "Midnights",
      duration: "3:21",
      addedAt: "2023-08-10",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
    },
    {
      id: "9",
      title: "Kill Bill",
      artist: "SZA",
      album: "SOS",
      duration: "2:33",
      addedAt: "2023-08-05",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
    },
    {
      id: "10",
      title: "Creepin'",
      artist: "Metro Boomin, The Weeknd, 21 Savage",
      album: "HEROES & VILLAINS",
      duration: "3:41",
      addedAt: "2023-07-28",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
    }
  ];

  // Filter songs based on search query
  const filteredSongs = likedSongs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="relative h-80 bg-gradient-to-b from-[var(--primary)] to-[var(--background)] mb-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] opacity-90"></div>
        <div className="absolute bottom-0 left-0 p-8 flex items-end">
          <div className="mr-6">
            <img 
              src="https://misc.scdn.co/liked-songs/liked-songs-640.png" 
              alt="Liked Songs" 
              className="w-52 h-52 shadow-2xl"
            />
          </div>
          <div>
            <p className="uppercase text-sm font-bold mb-2">Playlist</p>
            <h1 className="text-7xl font-extrabold mb-6">Liked Songs</h1>
            <div className="flex items-center text-sm">
              <span className="font-semibold">{session?.user?.name || "User"}</span>
              <span className="mx-1">•</span>
              <span>{filteredSongs.length} songs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-6">
        <button className="w-14 h-14 flex items-center justify-center bg-[var(--primary)] rounded-full hover:scale-105 transition-transform shadow-lg">
          <Play className="h-7 w-7 text-black ml-1" fill="currentColor" />
        </button>
        
        {showSearch ? (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in your liked songs"
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
      </div>

      {/* Songs Table */}
      <div className="bg-[var(--card)] bg-opacity-30 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-2 border-b border-[var(--accent)] text-sm text-[var(--text-muted)]">
          <div className="text-center">#</div>
          <div>Title</div>
          <div>Album</div>
          <div>Date Added</div>
          <div className="flex justify-end">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Table Body */}
        {filteredSongs.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xl font-semibold mb-2">No songs found</p>
            <p className="text-[var(--text-muted)]">Try a different search term</p>
          </div>
        ) : (
          <div>
            {filteredSongs.map((song, index) => (
              <div 
                key={song.id}
                className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-2 hover:bg-[var(--card-hover)] transition-colors items-center group"
              >
                <div className="text-center text-[var(--text-muted)] group-hover:hidden">{index + 1}</div>
                <div className="text-center text-white hidden group-hover:block">
                  <Play className="h-4 w-4" fill="currentColor" />
                </div>
                <div className="flex items-center gap-3">
                  <img 
                    src={song.image} 
                    alt={song.title}
                    className="w-10 h-10"
                  />
                  <div>
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-[var(--text-muted)] truncate">{song.artist}</p>
                  </div>
                </div>
                <div className="truncate text-[var(--text-muted)]">{song.album}</div>
                <div className="text-[var(--text-muted)] text-sm">{song.addedAt}</div>
                <div className="flex justify-end items-center gap-4">
                  <button className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  <span className="text-[var(--text-muted)]">{song.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
