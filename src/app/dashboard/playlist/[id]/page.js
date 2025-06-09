"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Clock, Share2, MoreHorizontal, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getPlaylist } from "@/lib/spotify/api";

export default function PlaylistPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken || !id) return;
      
      setLoading(true);
      try {
        const playlistData = await getPlaylist(session.user.accessToken, id);
        setPlaylist(playlistData);
      } catch (error) {
        console.error("Error fetching playlist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, id]);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTotalDuration = () => {
    if (!playlist?.tracks?.items) return "0 min";
    
    const totalMs = playlist.tracks.items.reduce((total, item) => total + (item.track?.duration_ms || 0), 0);
    const minutes = Math.floor(totalMs / 60000);
    
    return `${minutes} min`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const togglePlay = (trackId) => {
    if (playingTrackId === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingTrackId(trackId);
      setIsPlaying(true);
    }
    // In a real app, this would interact with the Spotify Web Playback SDK
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-2">Playlist not found</h1>
        <p className="text-[var(--secondary)] mb-4">The playlist you're looking for doesn't exist or is not available.</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
        <div className="w-full md:w-64 h-64 min-w-64 relative">
          {playlist.images?.[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={playlist.images[0].url} 
              alt={playlist.name}
              className="w-full h-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-full h-full bg-[var(--card)] flex items-center justify-center">
              <span className="text-[var(--secondary)]">No Image</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-medium">Playlist</span>
          <h1 className="text-5xl font-bold mt-2 mb-6">{playlist.name}</h1>
          
          <p className="text-[var(--secondary)] mb-2">{playlist.description}</p>
          
          <div className="flex items-center gap-x-2 mb-6">
            <span className="font-medium">
              <span 
                className="hover:underline cursor-pointer"
                onClick={() => {
                  if (playlist.owner?.id) {
                    router.push(`/dashboard/user/${playlist.owner.id}`);
                  }
                }}
              >
                {playlist.owner?.display_name || "Unknown"}
              </span>
            </span>
            <span className="text-[var(--secondary)] mx-1">•</span>
            <span className="text-[var(--secondary)]">{playlist.followers?.total || 0} likes</span>
            <span className="text-[var(--secondary)] mx-1">•</span>
            <span className="text-[var(--secondary)]">{playlist.tracks?.total || 0} songs,</span>
            <span className="text-[var(--secondary)]">{formatTotalDuration()}</span>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => togglePlay(playlist.tracks?.items?.[0]?.track?.id)}
              className="flex items-center justify-center rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] p-3"
              size="icon"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-black" fill="black" />
              ) : (
                <Play className="h-6 w-6 text-black" fill="black" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-[var(--secondary)] hover:text-white"
            >
              <Heart className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-[var(--secondary)] hover:text-white"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-[var(--secondary)] hover:text-white"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Track List */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--accent)] text-[var(--secondary)] text-left">
              <th className="p-4 w-12">#</th>
              <th className="p-4">Title</th>
              <th className="p-4">Album</th>
              <th className="p-4">Date added</th>
              <th className="p-4 text-right">
                <Clock className="h-5 w-5 inline-block" />
              </th>
            </tr>
          </thead>
          <tbody>
            {playlist.tracks?.items?.map((item, index) => (
              <tr 
                key={item.track?.id || index}
                className="border-b border-[var(--accent)] last:border-0 hover:bg-[var(--card-hover)] transition cursor-pointer"
                onClick={() => item.track?.id && router.push(`/dashboard/track/${item.track.id}`)}
              >
                <td className="p-4 w-12 text-center text-[var(--secondary)]">{index + 1}</td>
                <td className="p-4">
                  <div className="flex items-center gap-x-3">
                    <div className="w-10 h-10 min-w-[40px]">
                      {item.track?.album?.images?.[0]?.url ? (
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
                      <p className="font-medium truncate">{item.track?.name || "Unknown Track"}</p>
                      <p className="text-sm text-[var(--secondary)] truncate">
                        {item.track?.artists?.map((artist, idx) => (
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
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="truncate hover:underline cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    item.track?.album?.id && router.push(`/dashboard/album/${item.track.album.id}`);
                  }}>
                    {item.track?.album?.name || "Unknown Album"}
                  </p>
                </td>
                <td className="p-4 text-[var(--secondary)]">
                  {formatDate(item.added_at)}
                </td>
                <td className="p-4 text-right text-[var(--secondary)]">
                  {formatDuration(item.track?.duration_ms || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {playlist.tracks?.items?.length === 0 && (
          <div className="flex items-center justify-center h-40">
            <p className="text-[var(--secondary)]">This playlist is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
} 