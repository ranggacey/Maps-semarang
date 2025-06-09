"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getCurrentUserPlaylists } from "@/lib/spotify/api";
import { PlusCircle, Music, Loader2 } from "lucide-react";

export default function PlaylistsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!session?.accessToken) return;

      try {
        setIsLoading(true);
        const data = await getCurrentUserPlaylists(session.accessToken);
        setPlaylists(data.items || []);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("Failed to load playlists. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [session]);

  const handleCreatePlaylist = () => {
    router.push("/dashboard/playlist/create");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-10 w-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (error) {
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Playlists</h1>
        <button
          onClick={handleCreatePlaylist}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-opacity-80 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Create Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Music className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Create your first playlist</h2>
          <p className="text-gray-400 mb-6">It's easy, we'll help you</p>
          <button
            onClick={handleCreatePlaylist}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-opacity-80 transition-colors"
          >
            Create playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => router.push(`/dashboard/playlist/${playlist.id}`)}
              className="group bg-[#1e293b] hover:bg-[#334155] transition-colors duration-300 p-4 rounded-md cursor-pointer"
            >
              <div className="aspect-square w-full rounded-md overflow-hidden mb-4 shadow-lg">
                {playlist.images && playlist.images[0] ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-[#334155]">
                    <Music className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
              <p className="text-sm text-gray-400 truncate">
                {playlist.description || `By ${playlist.owner.display_name}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 