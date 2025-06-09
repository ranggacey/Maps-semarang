"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search as SearchIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { search } from "@/lib/spotify/api";
import { formatDuration, debounce } from "@/lib/utils";

// Mock data for development or fallback
const mockSearchResults = {
  tracks: {
    items: Array(10).fill(null).map((_, i) => ({
      id: `mock-track-${i}`,
      name: `Track ${i + 1}`,
      duration_ms: 180000 + i * 10000,
      album: {
        name: `Album ${i + 1}`,
        images: [{ url: `https://picsum.photos/seed/${i + 100}/300/300` }],
        id: `mock-album-${i}`
      },
      artists: [
        { id: `mock-artist-${i}`, name: `Artist ${i + 1}` }
      ]
    }))
  },
  artists: {
    items: Array(10).fill(null).map((_, i) => ({
      id: `mock-artist-${i}`,
      name: `Artist ${i + 1}`,
      images: [{ url: `https://picsum.photos/seed/${i + 200}/300/300` }],
      type: "artist"
    }))
  },
  albums: {
    items: Array(10).fill(null).map((_, i) => ({
      id: `mock-album-${i}`,
      name: `Album ${i + 1}`,
      images: [{ url: `https://picsum.photos/seed/${i + 300}/300/300` }],
      artists: [{ name: `Artist ${i + 1}` }],
      type: "album"
    }))
  },
  playlists: {
    items: Array(10).fill(null).map((_, i) => ({
      id: `mock-playlist-${i}`,
      name: `Playlist ${i + 1}`,
      description: `This is a mock playlist description ${i + 1}`,
      images: [{ url: `https://picsum.photos/seed/${i + 400}/300/300` }],
      type: "playlist"
    }))
  }
};

// Special mock data for specific searches
const specialMockData = {
  "aespa": {
    tracks: {
      items: [
        {
          id: "aespa-track-1",
          name: "Next Level",
          duration_ms: 221000,
          album: {
            name: "Next Level",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b273c6c2c1f7224a4127c0c6ac7a" }],
            id: "aespa-album-1"
          },
          artists: [{ id: "aespa-artist", name: "aespa" }]
        },
        {
          id: "aespa-track-2",
          name: "Savage",
          duration_ms: 240000,
          album: {
            name: "Savage - The 1st Mini Album",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b273a7a0ba3f6ca3a9fa89e89b1c" }],
            id: "aespa-album-2"
          },
          artists: [{ id: "aespa-artist", name: "aespa" }]
        },
        {
          id: "aespa-track-3",
          name: "Black Mamba",
          duration_ms: 180000,
          album: {
            name: "Black Mamba",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b2736a3aa7bcfb9b2f7d8af1f922" }],
            id: "aespa-album-3"
          },
          artists: [{ id: "aespa-artist", name: "aespa" }]
        },
        {
          id: "aespa-track-4",
          name: "Dreams Come True",
          duration_ms: 198000,
          album: {
            name: "Dreams Come True",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b273e0c4d8d06e4dd123d0bd61e4" }],
            id: "aespa-album-4"
          },
          artists: [{ id: "aespa-artist", name: "aespa" }]
        },
        {
          id: "aespa-track-5",
          name: "Forever",
          duration_ms: 210000,
          album: {
            name: "Forever",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b273a7a0ba3f6ca3a9fa89e89b1c" }],
            id: "aespa-album-5"
          },
          artists: [{ id: "aespa-artist", name: "aespa" }]
        }
      ]
    },
    artists: {
      items: [
        {
          id: "aespa-artist",
          name: "aespa",
          images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb6dc71e3b43f3c8fb37b2bc88" }],
          type: "artist"
        }
      ]
    },
    albums: {
      items: [
        {
          id: "aespa-album-1",
          name: "Next Level",
          images: [{ url: "https://i.scdn.co/image/ab67616d0000b273c6c2c1f7224a4127c0c6ac7a" }],
          artists: [{ name: "aespa" }],
          type: "album"
        },
        {
          id: "aespa-album-2",
          name: "Savage - The 1st Mini Album",
          images: [{ url: "https://i.scdn.co/image/ab67616d0000b273a7a0ba3f6ca3a9fa89e89b1c" }],
          artists: [{ name: "aespa" }],
          type: "album"
        },
        {
          id: "aespa-album-3",
          name: "Black Mamba",
          images: [{ url: "https://i.scdn.co/image/ab67616d0000b2736a3aa7bcfb9b2f7d8af1f922" }],
          artists: [{ name: "aespa" }],
          type: "album"
        }
      ]
    },
    playlists: {
      items: [
        {
          id: "aespa-playlist-1",
          name: "This is aespa",
          description: "All the essential tracks from aespa in one playlist.",
          images: [{ url: "https://i.scdn.co/image/ab67706f00000002b8b9d27db9616088c14f5166" }],
          type: "playlist"
        },
        {
          id: "aespa-playlist-2",
          name: "aespa Complete Collection",
          description: "All songs by aespa",
          images: [{ url: "https://i.scdn.co/image/ab67616d0000b273a7a0ba3f6ca3a9fa89e89b1c" }],
          type: "playlist"
        }
      ]
    }
  },
  "the weeknd": {
    tracks: {
      items: [
        {
          id: "weeknd-track-1",
          name: "Blinding Lights",
          duration_ms: 200000,
          album: {
            name: "After Hours",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b273ef12a4e3bcb7c777c4e00f0b" }],
            id: "weeknd-album-1"
          },
          artists: [{ id: "weeknd-artist", name: "The Weeknd" }]
        },
        {
          id: "weeknd-track-2",
          name: "Save Your Tears",
          duration_ms: 215000,
          album: {
            name: "After Hours",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b273ef12a4e3bcb7c777c4e00f0b" }],
            id: "weeknd-album-1"
          },
          artists: [{ id: "weeknd-artist", name: "The Weeknd" }]
        },
        {
          id: "weeknd-track-3",
          name: "Starboy",
          duration_ms: 230000,
          album: {
            name: "Starboy",
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a" }],
            id: "weeknd-album-2"
          },
          artists: [{ id: "weeknd-artist", name: "The Weeknd" }]
        }
      ]
    },
    artists: {
      items: [
        {
          id: "weeknd-artist",
          name: "The Weeknd",
          images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb" }],
          type: "artist"
        }
      ]
    },
    albums: {
      items: [
        {
          id: "weeknd-album-1",
          name: "After Hours",
          images: [{ url: "https://i.scdn.co/image/ab67616d0000b273ef12a4e3bcb7c777c4e00f0b" }],
          artists: [{ name: "The Weeknd" }],
          type: "album"
        },
        {
          id: "weeknd-album-2",
          name: "Starboy",
          images: [{ url: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a" }],
          artists: [{ name: "The Weeknd" }],
          type: "album"
        }
      ]
    },
    playlists: {
      items: [
        {
          id: "weeknd-playlist-1",
          name: "This is The Weeknd",
          description: "All the essential tracks from The Weeknd in one playlist.",
          images: [{ url: "https://i.scdn.co/image/ab67706f000000025c2c2d2f6f9a92f0e6123d78" }],
          type: "playlist"
        }
      ]
    }
  }
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if we're using the demo account
    if (session?.user?.id === "demo-user-id") {
      setIsDemoMode(true);
    }

    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams, session]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Check for special mock data first
      const lowerQuery = searchQuery.toLowerCase();
      
      // In demo mode or if we have special mock data for this query
      if (isDemoMode || !session?.user?.accessToken || specialMockData[lowerQuery]) {
        // Use special mock data if available, otherwise use generic mock data
        const mockData = specialMockData[lowerQuery] || mockSearchResults;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setResults({
          tracks: mockData.tracks?.items || [],
          artists: mockData.artists?.items || [],
          albums: mockData.albums?.items || [],
          playlists: mockData.playlists?.items || []
        });
      } else {
        // Real API call
        const data = await search(session.user.accessToken, searchQuery);
        setResults({
          tracks: data.tracks?.items || [],
          artists: data.artists?.items || [],
          albums: data.albums?.items || [],
          playlists: data.playlists?.items || []
        });
      }
    } catch (error) {
      console.error("Error searching:", error);
      setError("Failed to perform search. Using mock data instead.");
      
      // Fallback to mock data on error
      const mockData = mockSearchResults;
      setResults({
        tracks: mockData.tracks?.items || [],
        artists: mockData.artists?.items || [],
        albums: mockData.albums?.items || [],
        playlists: mockData.playlists?.items || []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="pb-24">
      <form onSubmit={handleSearch} className="relative mb-8">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--secondary)]" />
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full bg-[var(--card)] rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </form>

      {isDemoMode && (
        <div className="mb-4 px-4 py-2 bg-[var(--card)] rounded-md text-[var(--secondary)]">
          <p>You're in demo mode. Search results are simulated. Try searching for "aespa" or "the weeknd" for special results.</p>
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-900/30 border border-red-500 rounded-md">
          <p className="text-white">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        <>
          {/* Top Results */}
          {searchParams.get("q") && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Top Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {results.artists[0] && (
                  <Card 
                    data={results.artists[0]}
                    type="artist"
                    onClick={() => router.push(`/dashboard/artist/${results.artists[0].id}`)}
                  />
                )}
                {results.albums[0] && (
                  <Card 
                    data={results.albums[0]}
                    type="album"
                    onClick={() => router.push(`/dashboard/album/${results.albums[0].id}`)}
                  />
                )}
                {results.playlists[0] && (
                  <Card 
                    data={results.playlists[0]}
                    type="playlist"
                    onClick={() => router.push(`/dashboard/playlist/${results.playlists[0].id}`)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Songs */}
          {results.tracks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Songs</h2>
              <div className="bg-[var(--card)] rounded-md overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {results.tracks.slice(0, 5).map((track, index) => (
                      <tr 
                        key={track.id}
                        className="border-b border-[var(--accent)] last:border-0 hover:bg-[var(--card-hover)] transition cursor-pointer"
                        onClick={() => router.push(`/dashboard/track/${track.id}`)}
                      >
                        <td className="p-4 w-12 text-center text-[var(--secondary)]">{index + 1}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-x-3">
                            <div className="w-10 h-10 min-w-[40px]">
                              {track.album?.images?.[0]?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                  src={track.album.images[0].url} 
                                  alt={track.name}
                                  className="object-cover h-full w-full"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full w-full bg-[var(--accent)]"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium truncate">{track.name}</p>
                              <p className="text-sm text-[var(--secondary)] truncate">
                                {track.artists?.map((artist, idx) => (
                                  <span key={artist.id || idx}>
                                    <span 
                                      className="hover:underline cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/dashboard/artist/${artist.id}`);
                                      }}
                                    >
                                      {artist.name}
                                    </span>
                                    {idx < track.artists.length - 1 && ", "}
                                  </span>
                                ))}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="truncate hover:underline cursor-pointer" onClick={(e) => {
                            e.stopPropagation();
                            track.album?.id && router.push(`/dashboard/album/${track.album.id}`);
                          }}>
                            {track.album?.name || "Unknown Album"}
                          </p>
                        </td>
                        <td className="p-4 text-right text-[var(--secondary)]">
                          {formatDuration(track.duration_ms)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Artists */}
          {results.artists.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {results.artists.slice(0, 6).map((artist) => (
                  <Card 
                    key={artist.id}
                    data={artist}
                    type="artist"
                    onClick={() => router.push(`/dashboard/artist/${artist.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Albums */}
          {results.albums.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {results.albums.slice(0, 6).map((album) => (
                  <Card 
                    key={album.id}
                    data={album}
                    type="album"
                    onClick={() => router.push(`/dashboard/album/${album.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Playlists */}
          {results.playlists.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Playlists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {results.playlists.slice(0, 6).map((playlist) => (
                  <Card 
                    key={playlist.id}
                    data={playlist}
                    type="playlist"
                    onClick={() => router.push(`/dashboard/playlist/${playlist.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchParams.get("q") && 
            results.tracks.length === 0 && 
            results.artists.length === 0 && 
            results.albums.length === 0 && 
            results.playlists.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40">
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-[var(--secondary)]">Please try another search term.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const browseCategories = [
  { id: 'pop', name: 'Pop', color: '#8c67ab' },
  { id: 'hiphop', name: 'Hip-Hop', color: '#ba5d07' },
  { id: 'rock', name: 'Rock', color: '#e61e32' },
  { id: 'rnb', name: 'R&B', color: '#dc148c' },
  { id: 'indie', name: 'Indie', color: '#608108' },
  { id: 'dance', name: 'Dance/Electronic', color: '#d84000' },
  { id: 'mood', name: 'Mood', color: '#8d67ab' },
  { id: 'chill', name: 'Chill', color: '#477d95' },
  { id: 'sleep', name: 'Sleep', color: '#1e3264' },
  { id: 'focus', name: 'Focus', color: '#503750' },
  { id: 'workout', name: 'Workout', color: '#777777' },
  { id: 'party', name: 'Party', color: '#af2896' },
]; 