"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getRecentlyPlayedTracks } from "@/lib/spotify/api";
import { Clock, Loader2, Music, History } from "lucide-react";

export default function RecentlyPlayedPage() {
  const { data: session } = useSession();
  const [recentTracks, setRecentTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 50;

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      if (!session?.accessToken) return;

      try {
        setIsLoading(true);
        const data = await getRecentlyPlayedTracks(
          session.accessToken, 
          limit, 
          page > 0 ? recentTracks[recentTracks.length - 1].played_at : null
        );
        
        setRecentTracks(prevTracks => {
          if (page === 0) return data.items || [];
          return [...prevTracks, ...(data.items || [])];
        });
        
        setHasMore((data.items || []).length === limit);
      } catch (err) {
        console.error("Error fetching recently played tracks:", err);
        setError("Failed to load your recently played tracks. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, [session, page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatPlayedAt = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  if (isLoading && page === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (error && recentTracks.length === 0) {
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
          <div className="h-16 w-16 flex items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-emerald-600">
            <History className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Recently Played</h1>
            <p className="text-gray-400 text-sm">
              {recentTracks.length} {recentTracks.length === 1 ? 'track' : 'tracks'}
            </p>
          </div>
        </div>
      </div>

      {recentTracks.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <History className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No recently played tracks</h2>
          <p className="text-gray-400 mb-6">Listen to some music and check back later</p>
        </div>
      ) : (
        <>
          <div className="mb-4 border-b border-[#334155] pb-2">
            <div className="grid grid-cols-[4fr_3fr_2fr_1fr] gap-4 px-4 text-sm text-gray-400">
              <div>TITLE</div>
              <div>ALBUM</div>
              <div>PLAYED</div>
              <div className="flex justify-end">
                <Clock className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {recentTracks.map((item, index) => (
              <div
                key={`${item.track.id}-${item.played_at}`}
                className="grid grid-cols-[4fr_3fr_2fr_1fr] gap-4 px-4 py-2 rounded-md hover:bg-[#1e293b] transition-colors cursor-pointer"
                onClick={() => window.open(item.track.external_urls.spotify, '_blank')}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 h-10 w-10 bg-[#334155] rounded overflow-hidden">
                    {item.track.album.images[0] ? (
                      <img
                        src={item.track.album.images[0].url}
                        alt={item.track.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#334155]">
                        <Music className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{item.track.name}</p>
                    <p className="text-gray-400 text-sm truncate">
                      {item.track.artists.map(artist => artist.name).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-400 truncate">
                  {item.track.album.name}
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  {formatPlayedAt(item.played_at)}
                </div>
                <div className="flex items-center justify-end text-gray-400 text-sm">
                  {formatTime(item.track.duration_ms)}
                </div>
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