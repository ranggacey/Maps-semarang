"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search as SearchIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { search } from "@/lib/spotify/api";

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

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery || !session?.user?.accessToken) return;
    
    setLoading(true);
    try {
      const data = await search(session.user.accessToken, searchQuery);
      setResults({
        tracks: data.tracks?.items || [],
        artists: data.artists?.items || [],
        albums: data.albums?.items || [],
        playlists: data.playlists?.items || []
      });
    } catch (error) {
      console.error("Error searching:", error);
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

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
                                  <span key={artist.id}>
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