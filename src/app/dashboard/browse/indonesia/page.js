"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { search, getCategories, getCategoryPlaylists } from "@/lib/spotify/api";
import { Globe, Loader2, Music } from "lucide-react";

export default function IndonesiaPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [indonesiaContent, setIndonesiaContent] = useState({
    playlists: [],
    artists: [],
    tracks: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndonesiaContent = async () => {
      if (!session?.accessToken) return;

      try {
        setIsLoading(true);
        
        // Search for Indonesia playlists
        const playlistResults = await search(
          session.accessToken,
          "indonesia top playlist",
          ["playlist"],
          10
        );
        
        // Search for Indonesia artists
        const artistResults = await search(
          session.accessToken,
          "indonesia artist",
          ["artist"],
          10
        );
        
        // Search for Indonesia tracks
        const trackResults = await search(
          session.accessToken,
          "indonesia popular",
          ["track"],
          10
        );
        
        // Try to find Indonesia category
        const categoriesData = await getCategories(session.accessToken, 50);
        const indonesiaCategory = categoriesData.categories?.items?.find(
          category => category.name.toLowerCase().includes("indonesia") || 
                     category.name.toLowerCase().includes("indo")
        );
        
        let allPlaylists = [...(playlistResults.playlists?.items || [])];
        
        // If we found an Indonesia category, get its playlists
        if (indonesiaCategory) {
          const categoryPlaylists = await getCategoryPlaylists(
            session.accessToken,
            indonesiaCategory.id,
            10
          );
          
          allPlaylists = [...allPlaylists, ...(categoryPlaylists.playlists?.items || [])];
        }
        
        // Remove duplicates based on playlist ID
        const uniquePlaylists = Array.from(
          new Map(allPlaylists.map(playlist => [playlist.id, playlist])).values()
        );
        
        setIndonesiaContent({
          playlists: uniquePlaylists,
          artists: artistResults.artists?.items || [],
          tracks: trackResults.tracks?.items || []
        });
      } catch (err) {
        console.error("Error fetching Indonesia content:", err);
        setError("Failed to load Indonesia content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndonesiaContent();
  }, [session]);

  const handlePlaylistClick = (playlistId) => {
    router.push(`/dashboard/playlist/${playlistId}`);
  };

  const handleArtistClick = (artistUrl) => {
    window.open(artistUrl, '_blank');
  };

  const handleTrackClick = (trackUrl) => {
    window.open(trackUrl, '_blank');
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (error && indonesiaContent.playlists.length === 0 && 
      indonesiaContent.artists.length === 0 && 
      indonesiaContent.tracks.length === 0) {
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
          <div className="h-16 w-16 flex items-center justify-center rounded-md bg-gradient-to-br from-red-500 to-red-700">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Indonesia Top</h1>
            <p className="text-gray-400 text-sm">
              Discover the best music from Indonesia
            </p>
          </div>
        </div>
      </div>

      {/* Top Playlists */}
      {indonesiaContent.playlists.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Top Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {indonesiaContent.playlists.map((playlist) => (
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
        </section>
      )}

      {/* Top Artists */}
      {indonesiaContent.artists.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Top Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {indonesiaContent.artists.map((artist) => (
              <div 
                key={artist.id}
                className="flex flex-col items-center p-4 rounded-md hover:bg-[#1e293b] transition-colors cursor-pointer"
                onClick={() => handleArtistClick(artist.external_urls.spotify)}
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
                      <Music className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-white font-medium text-center">{artist.name}</p>
                <p className="text-gray-400 text-sm">Artist</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Tracks */}
      {indonesiaContent.tracks.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Top Tracks</h2>
          <div className="space-y-2">
            {indonesiaContent.tracks.map((track, index) => (
              <div 
                key={track.id}
                className="flex items-center gap-4 p-3 rounded-md hover:bg-[#1e293b] transition-colors cursor-pointer"
                onClick={() => handleTrackClick(track.external_urls.spotify)}
              >
                <div className="w-6 text-center text-gray-400">{index + 1}</div>
                <div className="flex-shrink-0 h-12 w-12 bg-[#334155] rounded overflow-hidden">
                  {track.album.images[0] ? (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[#334155]">
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium truncate">{track.name}</p>
                  <p className="text-gray-400 text-sm truncate">
                    {track.artists.map(artist => artist.name).join(", ")}
                  </p>
                </div>
                <div className="text-sm text-gray-400">{formatTime(track.duration_ms)}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {indonesiaContent.playlists.length === 0 && 
       indonesiaContent.artists.length === 0 && 
       indonesiaContent.tracks.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Globe className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Indonesia content found</h2>
          <p className="text-gray-400 mb-6">Try again later</p>
        </div>
      )}
    </div>
  );
} 