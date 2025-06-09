"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would make an API call to Spotify
    // For demo purposes, we'll simulate a search response
    setTimeout(() => {
      setSearchResults([
        {
          id: "1",
          type: "track",
          name: "Blinding Lights",
          artist: "The Weeknd",
          album: "After Hours",
          image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
        },
        {
          id: "2",
          type: "track",
          name: "Save Your Tears",
          artist: "The Weeknd",
          album: "After Hours",
          image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
        },
        {
          id: "3",
          type: "artist",
          name: "The Weeknd",
          image: "https://i.scdn.co/image/ab6761610000e5eb8278b782cbb5a3963db88ada"
        },
        {
          id: "4",
          type: "album",
          name: "After Hours",
          artist: "The Weeknd",
          image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a"
        },
        {
          id: "5",
          type: "playlist",
          name: "The Weeknd Mix",
          description: "The Weeknd and similar artists",
          image: "https://mosaic.scdn.co/300/ab67616d0000b2734718e2b124f79258be7bc452ab67616d0000b273a048415db06a5b6fa7ec4e1aab67616d0000b273ef00920e07de8dd8d1e167a7ab67616d0000b273f46b9d202509a8f7384b90de"
        }
      ]);
      setIsLoading(false);
    }, 800);
  };

  const categories = [
    "All", "Songs", "Artists", "Albums", "Playlists", "Podcasts"
  ];

  return (
    <div className="pb-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[var(--text-muted)]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full pl-10 pr-4 py-3 bg-[var(--card)] border border-[var(--accent)] rounded-full text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </form>
      
      {searchQuery === "" ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div 
                key={category}
                className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer"
              >
                <h3 className="font-semibold">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        <div>
          <div className="flex gap-4 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-1 rounded-full text-sm ${
                  category === "All" 
                    ? "bg-white text-black font-medium" 
                    : "bg-[var(--card)] hover:bg-[var(--card-hover)] text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Top result</h2>
              <div className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-5 flex flex-col">
                <img 
                  src={searchResults[2].image} 
                  alt={searchResults[2].name}
                  className="w-24 h-24 rounded-full mb-4 shadow-lg"
                />
                <h3 className="text-2xl font-bold">{searchResults[2].name}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Artist</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Songs</h2>
              <div className="bg-[var(--card)] rounded-lg overflow-hidden">
                {searchResults.filter(item => item.type === "track").map((track, index) => (
                  <div 
                    key={track.id}
                    className="flex items-center gap-4 px-4 py-2 hover:bg-[var(--card-hover)] transition-colors"
                  >
                    <div className="w-6 text-center text-[var(--text-muted)]">{index + 1}</div>
                    <img 
                      src={track.image} 
                      alt={track.name}
                      className="w-10 h-10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{track.name}</p>
                      <p className="text-sm text-[var(--text-muted)] truncate">{track.artist}</p>
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">3:20</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {searchResults.filter(item => item.type === "album").map((album) => (
                  <div 
                    key={album.id}
                    className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer"
                  >
                    <img 
                      src={album.image} 
                      alt={album.name}
                      className="w-full aspect-square rounded-md mb-3 shadow-md"
                    />
                    <h3 className="font-semibold truncate">{album.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] truncate">{album.artist}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Playlists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {searchResults.filter(item => item.type === "playlist").map((playlist) => (
                  <div 
                    key={playlist.id}
                    className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer"
                  >
                    <img 
                      src={playlist.image} 
                      alt={playlist.name}
                      className="w-full aspect-square rounded-md mb-3 shadow-md"
                    />
                    <h3 className="font-semibold truncate">{playlist.name}</h3>
                    <p className="text-sm text-[var(--text-muted)] truncate">{playlist.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 