"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getArtist, getArtistTopTracks, getArtistAlbums, getArtistRelatedArtists } from "@/lib/spotify/api";

export default function ArtistPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken || !id) return;
      
      setLoading(true);
      try {
        const [artistData, topTracksData, albumsData, relatedArtistsData] = await Promise.all([
          getArtist(session.user.accessToken, id),
          getArtistTopTracks(session.user.accessToken, id),
          getArtistAlbums(session.user.accessToken, id),
          getArtistRelatedArtists(session.user.accessToken, id)
        ]);
        
        setArtist(artistData);
        setTopTracks(topTracksData.tracks || []);
        setAlbums(albumsData.items || []);
        setRelatedArtists(relatedArtistsData.artists || []);
      } catch (error) {
        console.error("Error fetching artist data:", error);
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

  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
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

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-2">Artist not found</h1>
        <p className="text-[var(--secondary)] mb-4">The artist you're looking for doesn't exist or is not available.</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="relative">
        {/* Artist Header */}
        <div className="relative h-[40vh] min-h-[300px] w-full">
          {artist.images?.[0]?.url ? (
            <>
              {/* Background Image with Gradient Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${artist.images[0].url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)]"></div>
              </div>
              
              {/* Artist Info */}
              <div className="absolute bottom-0 left-0 p-8 z-10">
                <div className="flex items-center gap-4 mb-4">
                  {artist.images?.[0]?.url && (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={artist.images[0].url} 
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium">Artist</span>
                    <h1 className="text-5xl font-bold mt-1 mb-2">{artist.name}</h1>
                    <p className="text-[var(--secondary)]">
                      {formatFollowers(artist.followers?.total || 0)} followers
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-[var(--card)]">
              <h1 className="text-5xl font-bold">{artist.name}</h1>
            </div>
          )}
        </div>
        
        {/* Play Button */}
        <div className="flex items-center gap-4 p-8">
          <Button
            onClick={() => togglePlay(topTracks[0]?.id)}
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
      </div>

      {/* Popular Tracks */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Popular</h2>
        <div className="bg-[var(--card)] rounded-md overflow-hidden">
          <table className="w-full">
            <tbody>
              {topTracks.slice(0, 5).map((track, index) => (
                <tr 
                  key={track.id}
                  className="border-b border-[var(--accent)] last:border-0 hover:bg-[var(--card-hover)] transition cursor-pointer"
                  onClick={() => router.push(`/dashboard/track/${track.id}`)}
                >
                  <td className="p-4 w-12 text-center text-[var(--secondary)]">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-x-3">
                      <div className="w-10 h-10 min-w-[40px]">
                        {track.album?.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={track.album.images[0].url} 
                            alt={track.name}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-[var(--accent)]"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium truncate">{track.name}</p>
                      </div>
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
      </div>

      {/* Albums */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Albums</h2>
          <button 
            onClick={() => {}}
            className="text-sm font-semibold text-[var(--secondary)] hover:underline"
          >
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {albums.slice(0, 6).map((album) => (
            <Card 
              key={album.id}
              data={album}
              type="album"
              onClick={() => router.push(`/dashboard/album/${album.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Related Artists */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Fans also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {relatedArtists.slice(0, 6).map((relatedArtist) => (
            <Card 
              key={relatedArtist.id}
              data={relatedArtist}
              type="artist"
              onClick={() => router.push(`/dashboard/artist/${relatedArtist.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Artist Bio */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <div className="bg-[var(--card)] p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">Artist Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--secondary)]">Followers</span>
                  <span>{artist.followers?.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--secondary)]">Popularity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[var(--accent)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--primary)]" 
                        style={{ width: `${artist.popularity}%` }}
                      ></div>
                    </div>
                    <span>{artist.popularity}/100</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--secondary)]">Genres</span>
                  <div className="text-right">
                    {artist.genres?.length > 0 ? (
                      <div className="flex flex-wrap justify-end gap-1">
                        {artist.genres.map((genre) => (
                          <span 
                            key={genre} 
                            className="px-2 py-0.5 text-xs bg-[var(--accent)] rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span>No genres available</span>
                    )}
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