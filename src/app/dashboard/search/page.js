"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { search } from "@/lib/spotify/api";
import { Search as SearchIcon, Loader2 } from "lucide-react";

export default function SearchPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery || !session?.accessToken) return;

      setIsLoading(true);
      try {
        const results = await search(
          session.accessToken,
          debouncedQuery,
          ['track', 'artist', 'album', 'playlist'],
          8
        );
        
        setSearchResults({
          tracks: results.tracks?.items || [],
          artists: results.artists?.items || [],
          albums: results.albums?.items || [],
          playlists: results.playlists?.items || []
        });
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, session]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            ) : (
              <SearchIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full p-4 pl-10 text-sm rounded-lg bg-[#1e293b] border border-[#334155] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="What do you want to listen to?"
          />
        </div>
      </div>

      {debouncedQuery && (
        <div className="space-y-6">
          {/* Tracks */}
          {searchResults.tracks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Songs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-4 p-3 rounded-md hover:bg-[#1e293b] transition-colors"
                  >
                    <div className="flex-shrink-0 h-12 w-12 bg-[#334155] rounded overflow-hidden">
                      {track.album.images[0] ? (
                        <img
                          src={track.album.images[0].url}
                          alt={track.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-[#334155]">
                          <SearchIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate">{track.name}</p>
                      <p className="text-gray-400 text-sm truncate">
                        {track.artists.map(artist => artist.name).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artists */}
          {searchResults.artists.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex flex-col items-center p-4 rounded-md hover:bg-[#1e293b] transition-colors"
                  >
                    <div className="h-36 w-36 rounded-full overflow-hidden mb-3 bg-[#334155]">
                      {artist.images && artist.images[0] ? (
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-[#334155]">
                          <SearchIcon className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium text-center">{artist.name}</p>
                    <p className="text-gray-400 text-sm">Artist</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Albums */}
          {searchResults.albums.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.albums.map((album) => (
                  <div
                    key={album.id}
                    className="flex flex-col p-4 rounded-md hover:bg-[#1e293b] transition-colors"
                  >
                    <div className="aspect-square w-full rounded overflow-hidden mb-3 bg-[#334155]">
                      {album.images && album.images[0] ? (
                        <img
                          src={album.images[0].url}
                          alt={album.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-[#334155]">
                          <SearchIcon className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium truncate">{album.name}</p>
                    <p className="text-gray-400 text-sm truncate">
                      {album.artists.map(artist => artist.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playlists */}
          {searchResults.playlists.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Playlists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex flex-col p-4 rounded-md hover:bg-[#1e293b] transition-colors"
                  >
                    <div className="aspect-square w-full rounded overflow-hidden mb-3 bg-[#334155]">
                      {playlist.images && playlist.images[0] ? (
                        <img
                          src={playlist.images[0].url}
                          alt={playlist.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-[#334155]">
                          <SearchIcon className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium truncate">{playlist.name}</p>
                    <p className="text-gray-400 text-sm truncate">
                      By {playlist.owner.display_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {debouncedQuery && 
            !isLoading && 
            searchResults.tracks.length === 0 && 
            searchResults.artists.length === 0 && 
            searchResults.albums.length === 0 && 
            searchResults.playlists.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <SearchIcon className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No results found for "{debouncedQuery}"</h2>
              <p className="text-gray-400">Please check your spelling or try different keywords.</p>
            </div>
          )}
        </div>
      )}

      {!debouncedQuery && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-6">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {browseCategories.map((category) => (
              <div
                key={category.id}
                className="aspect-square relative rounded-lg overflow-hidden"
                style={{ backgroundColor: category.color }}
              >
                <span className="absolute top-4 left-4 text-white font-bold text-2xl">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const browseCategories = [
  { id: 'pop', name: 'Pop', color: '#8a7cff' },
  { id: 'hiphop', name: 'Hip-Hop', color: '#1db954' },
  { id: 'rock', name: 'Rock', color: '#e9173f' },
  { id: 'rnb', name: 'R&B', color: '#e8115b' },
  { id: 'indie', name: 'Indie', color: '#af2896' },
  { id: 'dance', name: 'Dance', color: '#148a08' },
  { id: 'metal', name: 'Metal', color: '#503750' },
  { id: 'chill', name: 'Chill', color: '#477d95' },
  { id: 'focus', name: 'Focus', color: '#503750' },
  { id: 'sleep', name: 'Sleep', color: '#1e3264' },
]; 