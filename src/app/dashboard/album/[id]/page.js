"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Clock, Share2, MoreHorizontal, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAlbum } from "@/lib/spotify/api";

export default function AlbumPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken || !id) return;
      
      setLoading(true);
      try {
        const albumData = await getAlbum(session.user.accessToken, id);
        setAlbum(albumData);
      } catch (error) {
        console.error("Error fetching album data:", error);
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

  const formatReleaseDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTotalDuration = () => {
    if (!album?.tracks?.items) return "0 min";
    
    const totalMs = album.tracks.items.reduce((total, track) => total + track.duration_ms, 0);
    const minutes = Math.floor(totalMs / 60000);
    
    return `${minutes} min`;
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

  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-2">Album not found</h1>
        <p className="text-[var(--secondary)] mb-4">The album you're looking for doesn't exist or is not available.</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
        <div className="w-full md:w-64 h-64 min-w-64 relative">
          {album.images?.[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={album.images[0].url} 
              alt={album.name}
              className="w-full h-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-full h-full bg-[var(--card)] flex items-center justify-center">
              <span className="text-[var(--secondary)]">No Image</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-medium">Album</span>
          <h1 className="text-5xl font-bold mt-2 mb-6">{album.name}</h1>
          
          <div className="flex items-center gap-x-2 mb-2">
            {album.images?.[0]?.url && (
              <div className="w-6 h-6 overflow-hidden rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={album.images[0].url} 
                  alt={album.artists?.[0]?.name || "Artist"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <span className="font-medium">
              {album.artists?.map((artist, index) => (
                <span key={artist.id}>
                  <span 
                    className="hover:underline cursor-pointer"
                    onClick={() => router.push(`/dashboard/artist/${artist.id}`)}
                  >
                    {artist.name}
                  </span>
                  {index < album.artists.length - 1 && ", "}
                </span>
              ))}
            </span>
          </div>
          
          <div className="flex items-center gap-x-2 text-sm text-[var(--secondary)] mb-6">
            <span>{formatReleaseDate(album.release_date)}</span>
            <span>•</span>
            <span>{album.total_tracks} songs,</span>
            <span>{formatTotalDuration()}</span>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => togglePlay(album.tracks?.items?.[0]?.id)}
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
              <th className="p-4 text-right">
                <Clock className="h-5 w-5 inline-block" />
              </th>
            </tr>
          </thead>
          <tbody>
            {album.tracks?.items?.map((track, index) => (
              <tr 
                key={track.id}
                className="border-b border-[var(--accent)] last:border-0 hover:bg-[var(--card-hover)] transition cursor-pointer"
                onClick={() => router.push(`/dashboard/track/${track.id}`)}
              >
                <td className="p-4 w-12 text-center text-[var(--secondary)]">{track.track_number}</td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-[var(--secondary)]">
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
                </td>
                <td className="p-4 text-right text-[var(--secondary)]">
                  {formatDuration(track.duration_ms)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Album Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Album Info</h2>
        <div className="bg-[var(--card)] p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[var(--secondary)]">Release Date</span>
                  <span>{formatReleaseDate(album.release_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--secondary)]">Popularity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[var(--accent)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--primary)]" 
                        style={{ width: `${album.popularity || 0}%` }}
                      ></div>
                    </div>
                    <span>{album.popularity || 0}/100</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--secondary)]">Label</span>
                  <span>{album.label || "Unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--secondary)]">Copyright</span>
                  <div className="text-right">
                    {album.copyrights?.map((copyright, index) => (
                      <p key={index} className="text-sm">
                        {copyright.text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 