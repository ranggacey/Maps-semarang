"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getNewReleases } from "@/lib/spotify/api";
import { Disc, Loader2, Music } from "lucide-react";

export default function NewReleasesPage() {
  const { data: session } = useSession();
  const [newReleases, setNewReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 30;

  useEffect(() => {
    const fetchNewReleases = async () => {
      if (!session?.accessToken) return;

      try {
        setIsLoading(true);
        const data = await getNewReleases(session.accessToken, limit, page * limit);
        
        setNewReleases(prevReleases => {
          if (page === 0) return data.albums?.items || [];
          return [...prevReleases, ...(data.albums?.items || [])];
        });
        
        setHasMore((data.albums?.items || []).length === limit);
      } catch (err) {
        console.error("Error fetching new releases:", err);
        setError("Failed to load new releases. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewReleases();
  }, [session, page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading && page === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (error && newReleases.length === 0) {
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
          <div className="h-16 w-16 flex items-center justify-center rounded-md bg-gradient-to-br from-red-500 to-orange-500">
            <Disc className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">New Releases</h1>
            <p className="text-gray-400 text-sm">
              The latest albums and singles
            </p>
          </div>
        </div>
      </div>

      {newReleases.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Disc className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No new releases found</h2>
          <p className="text-gray-400 mb-6">Try again later</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {newReleases.map((album) => (
              <div 
                key={album.id}
                className="flex flex-col p-4 rounded-md hover:bg-[#1e293b] transition-colors cursor-pointer"
                onClick={() => window.open(album.external_urls.spotify, '_blank')}
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
                      <Music className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-white font-medium truncate">{album.name}</p>
                <p className="text-gray-400 text-sm truncate">
                  {album.artists.map(artist => artist.name).join(", ")}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{formatReleaseDate(album.release_date)}</span>
                  <span className="text-xs text-gray-500 capitalize">{album.album_type}</span>
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