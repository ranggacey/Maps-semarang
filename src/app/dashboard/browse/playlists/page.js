"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getFeaturedPlaylists } from "@/lib/spotify/api";
import { ListMusic, Loader2, Music } from "lucide-react";

export default function FeaturedPlaylistsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 30;

  useEffect(() => {
    const fetchFeaturedPlaylists = async () => {
      if (!session?.accessToken) return;

      try {
        setIsLoading(true);
        const data = await getFeaturedPlaylists(session.accessToken, limit, page * limit);
        
        setFeaturedPlaylists(prevPlaylists => {
          if (page === 0) return data.playlists?.items || [];
          return [...prevPlaylists, ...(data.playlists?.items || [])];
        });
        
        if (page === 0 && data.message) {
          setMessage(data.message);
        }
        
        setHasMore((data.playlists?.items || []).length === limit);
      } catch (err) {
        console.error("Error fetching featured playlists:", err);
        setError("Failed to load featured playlists. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPlaylists();
  }, [session, page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePlaylistClick = (playlistId) => {
    router.push(`/dashboard/playlist/${playlistId}`);
  };

  if (isLoading && page === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (error && featuredPlaylists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-full"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 flex items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-purple-600">
            <ListMusic className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Featured Playlists</h1>
            {message && (
              <p className="text-gray-400 text-sm">{message}</p>
            )}
          </div>
        </div>
      </div>

      {featuredPlaylists.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <ListMusic className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No featured playlists found</h2>
          <p className="text-gray-400 mb-6">Try again later</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {featuredPlaylists.map((playlist) => (
              <div 
                key={playlist.id}
                className="flex flex-col p-4 rounded-md hover:bg-[#1e293b] transition-colors cursor-pointer"
                onClick={() => handlePlaylistClick(playlist.id)}
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
                      <Music className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-white font-medium truncate">{playlist.name}</p>
                <p className="text-gray-400 text-sm truncate">
                  {playlist.description || `By ${playlist.owner.display_name}`}
                </p>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-2 rounded-full bg-[#334155] hover:bg-[#475569] text-white flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 