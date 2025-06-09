"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Play, Pause, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSavedTracks } from "@/lib/spotify/api";

// Mock data for development mode
const mockSavedTracks = {
  items: Array(20).fill(null).map((_, i) => ({
    added_at: new Date(Date.now() - i * 86400000).toISOString(),
    track: {
      id: `mock-track-${i}`,
      name: `Liked Song ${i + 1}`,
      duration_ms: 180000 + i * 10000,
      album: {
        name: `Album ${i + 1}`,
        images: [{ url: `https://picsum.photos/seed/${i + 400}/300/300` }],
        id: `mock-album-${i}`
      },
      artists: [
        { id: `mock-artist-${i}`, name: `Artist ${i + 1}` }
      ]
    }
  }))
};

export default function LikedSongsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [savedTracks, setSavedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) return;
      
      setLoading(true);
      
      // Check if we're using the demo account
      if (session.user.id === "demo-user-id") {
        setIsDemoMode(true);
        setSavedTracks(mockSavedTracks.items || []);
        setLoading(false);
        return;
      }
      
      try {
        const data = await getSavedTracks(session.user.accessToken);
        setSavedTracks(data.items || []);
      } catch (error) {
        console.error("Error fetching saved tracks:", error);
        // Fall back to mock data if API calls fail
        setSavedTracks(mockSavedTracks.items || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const togglePlay = (trackId) => {
    if (playingTrackId === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingTrackId(trackId);
      setIsPlaying(true);
    }
    // In a real app, this would interact with the Spotify Web Playback SDK
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="relative h-[30vh] min-h-[250px] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5038a0] to-[var(--background)] flex items-end">
          <div className="p-8 flex items-end gap-6">
            <div className="h-52 w-52 shadow-lg bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-24 w-24 text-white" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold uppercase">Playlist</p>
              <h1 className="text-5xl font-bold mt-2 mb-4">Liked Songs</h1>
              <p className="text-[var(--secondary)]">
                {savedTracks.length} songs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 p-8 pt-4">
        <Button
          onClick={() => {
            if (savedTracks.length > 0) {
              togglePlay(savedTracks[0].track.id);
            }
          }}
          className="flex items-center justify-center rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] p-3"
          size="icon"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-black" fill="black" />
          ) : (
            <Play className="h-6 w-6 text-black" fill="black" />
          )}
        </Button>
      </div>

      {/* Tracks Table */}
      {savedTracks.length > 0 ? (
        <div className="px-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--accent)] text-[var(--secondary)] text-sm">
                <th className="pb-2 text-center w-12">#</th>
                <th className="pb-2 text-left">Title</th>
                <th className="pb-2 text-left">Album</th>
                <th className="pb-2 text-left">Date added</th>
                <th className="pb-2 text-right pr-8">
                  <Clock className="h-4 w-4 inline" />
                </th>
              </tr>
            </thead>
            <tbody>
              {savedTracks.map((item, index) => (
                <tr 
                  key={item.track.id}
                  className="hover:bg-[var(--card-hover)] group transition cursor-pointer"
                  onClick={() => router.push(`/dashboard/track/${item.track.id}`)}
                >
                  <td className="py-3 text-center">
                    <div className="relative flex items-center justify-center h-6 w-6">
                      <span className="group-hover:hidden text-[var(--secondary)]">{index + 1}</span>
                      <button 
                        className="hidden group-hover:flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay(item.track.id);
                        }}
                      >
                        {playingTrackId === item.track.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 min-w-[40px]">
                        {item.track.album?.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={item.track.album.images[0].url} 
                            alt={item.track.name}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-[var(--accent)]"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.track.name}</p>
                        <div className="text-sm text-[var(--secondary)]">
                          {item.track.artists?.map((artist, idx) => (
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
                              {idx < item.track.artists.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <p 
                      className="text-[var(--secondary)] hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/album/${item.track.album.id}`);
                      }}
                    >
                      {item.track.album.name}
                    </p>
                  </td>
                  <td className="py-3 text-[var(--secondary)]">
                    {formatDate(item.added_at)}
                  </td>
                  <td className="py-3 text-right pr-8 text-[var(--secondary)]">
                    {formatDuration(item.track.duration_ms)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 px-8">
          <h3 className="text-xl font-bold mb-2">Songs you like will appear here</h3>
          <p className="text-[var(--secondary)]">Save songs by tapping the heart icon.</p>
        </div>
      )}
    </div>
  );
}
