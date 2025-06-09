"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Clock, Share2, MoreHorizontal, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getTrack, getTrackAudioFeatures } from "@/lib/spotify/api";

export default function TrackPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const [track, setTrack] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken || !id) return;
      
      setLoading(true);
      try {
        const [trackData, featuresData] = await Promise.all([
          getTrack(session.user.accessToken, id),
          getTrackAudioFeatures(session.user.accessToken, id)
        ]);
        
        setTrack(trackData);
        setAudioFeatures(featuresData);
      } catch (error) {
        console.error("Error fetching track data:", error);
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

  const getAudioFeatureLevel = (value) => {
    if (value < 0.33) return "Low";
    if (value < 0.66) return "Medium";
    return "High";
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would interact with the Spotify Web Playback SDK
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-2">Track not found</h1>
        <p className="text-[var(--secondary)] mb-4">The track you're looking for doesn't exist or is not available.</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
        <div className="w-full md:w-64 h-64 min-w-64 relative">
          {track.album?.images?.[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={track.album.images[0].url} 
              alt={track.name}
              className="w-full h-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-full h-full bg-[var(--card)] flex items-center justify-center">
              <span className="text-[var(--secondary)]">No Image</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-medium">Song</span>
          <h1 className="text-5xl font-bold mt-2 mb-6">{track.name}</h1>
          
          <div className="flex items-center gap-x-2 mb-6">
            {track.album?.images?.[0]?.url && (
              <div className="w-6 h-6 overflow-hidden rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={track.album.images[0].url} 
                  alt={track.artists?.[0]?.name || "Artist"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <span className="font-medium">
              {track.artists?.map((artist, index) => (
                <span key={artist.id}>
                  <span 
                    className="hover:underline cursor-pointer"
                    onClick={() => router.push(`/dashboard/artist/${artist.id}`)}
                  >
                    {artist.name}
                  </span>
                  {index < track.artists.length - 1 && ", "}
                </span>
              ))}
            </span>
            <span className="text-[var(--secondary)] mx-1">•</span>
            <span 
              className="text-[var(--secondary)] hover:underline cursor-pointer"
              onClick={() => router.push(`/dashboard/album/${track.album?.id}`)}
            >
              {track.album?.name}
            </span>
            <span className="text-[var(--secondary)] mx-1">•</span>
            <span className="text-[var(--secondary)]">{formatReleaseDate(track.album?.release_date)}</span>
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={togglePlay}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[var(--card)] p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Track Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--secondary)]">Duration</span>
              <span>{formatDuration(track.duration_ms)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--secondary)]">Popularity</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-[var(--accent)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--primary)]" 
                    style={{ width: `${track.popularity}%` }}
                  ></div>
                </div>
                <span>{track.popularity}/100</span>
              </div>
            </div>
            {track.explicit && (
              <div className="flex justify-between">
                <span className="text-[var(--secondary)]">Explicit</span>
                <span className="px-2 py-0.5 text-xs bg-[var(--accent)] rounded-sm">EXPLICIT</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--secondary)]">Track Number</span>
              <span>{track.track_number} of {track.album?.total_tracks}</span>
            </div>
          </div>
        </div>
        
        {audioFeatures && (
          <div className="bg-[var(--card)] p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Audio Features</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--secondary)]">Danceability</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[var(--accent)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--primary)]" 
                      style={{ width: `${audioFeatures.danceability * 100}%` }}
                    ></div>
                  </div>
                  <span>{getAudioFeatureLevel(audioFeatures.danceability)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--secondary)]">Energy</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[var(--accent)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--primary)]" 
                      style={{ width: `${audioFeatures.energy * 100}%` }}
                    ></div>
                  </div>
                  <span>{getAudioFeatureLevel(audioFeatures.energy)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--secondary)]">Tempo</span>
                <span>{Math.round(audioFeatures.tempo)} BPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--secondary)]">Key</span>
                <span>
                  {['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'][audioFeatures.key]}
                  {audioFeatures.mode === 1 ? ' Major' : ' Minor'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--secondary)]">Acousticness</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[var(--accent)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--primary)]" 
                      style={{ width: `${audioFeatures.acousticness * 100}%` }}
                    ></div>
                  </div>
                  <span>{getAudioFeatureLevel(audioFeatures.acousticness)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 