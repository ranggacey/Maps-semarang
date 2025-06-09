"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { search, getCategories, getCategoryPlaylists } from "@/lib/spotify/api";
import { BarChart2, Loader2, Music } from "lucide-react";

export default function ChartsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [chartPlaylists, setChartPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharts = async () => {
      if (!session?.accessToken) return;

      try {
        setIsLoading(true);
        
        // First, try to search for chart playlists
        const searchResults = await search(
          session.accessToken,
          "charts top 50",
          ["playlist"],
          20
        );
        
        // Then try to find chart category
        const categoriesData = await getCategories(session.accessToken, 50);
        const chartCategory = categoriesData.categories?.items?.find(
          category => category.name.toLowerCase().includes("chart") || 
                     category.name.toLowerCase().includes("top") ||
                     category.name.toLowerCase().includes("viral")
        );
        
        let allCharts = [...(searchResults.playlists?.items || [])];
        
        // If we found a chart category, get its playlists
        if (chartCategory) {
          const categoryPlaylists = await getCategoryPlaylists(
            session.accessToken,
            chartCategory.id,
            20
          );
          
          allCharts = [...allCharts, ...(categoryPlaylists.playlists?.items || [])];
        }
        
        // Remove duplicates based on playlist ID
        const uniqueCharts = Array.from(
          new Map(allCharts.map(chart => [chart.id, chart])).values()
        );
        
        setChartPlaylists(uniqueCharts);
      } catch (err) {
        console.error("Error fetching charts:", err);
        setError("Failed to load charts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharts();
  }, [session]);

  const handlePlaylistClick = (playlistId) => {
    router.push(`/dashboard/playlist/${playlistId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (error && chartPlaylists.length === 0) {
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
          <div className="h-16 w-16 flex items-center justify-center rounded-md bg-gradient-to-br from-yellow-500 to-amber-600">
            <BarChart2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Charts</h1>
            <p className="text-gray-400 text-sm">
              Top songs and playlists from around the world
            </p>
          </div>
        </div>
      </div>

      {chartPlaylists.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <BarChart2 className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No chart playlists found</h2>
          <p className="text-gray-400 mb-6">Try again later</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {chartPlaylists.map((playlist) => (
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
              {playlist.tracks && (
                <p className="text-xs text-gray-500 mt-1">
                  {playlist.tracks.total} tracks
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 