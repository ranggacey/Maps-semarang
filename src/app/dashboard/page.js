"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Play } from "lucide-react";

export default function DashboardPage({ playTrack }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState("Good evening");
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    // Check if we're using the demo account
    if (session?.user?.id === "demo-user-id") {
      setIsDemoMode(true);
    }

    // Load data
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, these would be actual API calls to Spotify
        // For now, we'll use mock data
        setUserPlaylists(mockUserPlaylists);
        setFeaturedPlaylists(mockFeaturedPlaylists);
        setNewReleases(mockNewReleases);
        setTopArtists(mockTopArtists);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session]);

  const handlePlayTrack = (item) => {
    if (playTrack) {
      // In a real app, this would get the tracks from the playlist/album
      // and pass them to the playTrack function
      playTrack(item);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{greeting}</h1>
      </div>
      
      {/* Recently Played */}
      <section className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {userPlaylists.slice(0, 6).map((playlist) => (
            <a 
              key={playlist.id}
              href={`/dashboard/playlist/${playlist.id}`}
              className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg overflow-hidden flex h-16 group"
            >
              <img 
                src={playlist.images?.[0]?.url} 
                alt={playlist.name}
                className={`h-16 w-16 object-cover ${playlist.owner.display_name === 'Spotify' ? 'rounded-l-lg' : ''}`}
              />
              <div className="flex-1 flex items-center px-4">
                <h3 className="font-bold truncate">{playlist.name}</h3>
              </div>
              <div className="relative opacity-0 group-hover:opacity-100 transition-opacity flex items-center pr-2">
                <button className="bg-[var(--primary)] rounded-full p-2 shadow-lg">
                  <Play className="h-4 w-4 text-black" fill="currentColor" />
                </button>
              </div>
            </a>
          ))}
        </div>
      </section>
      
      {/* Featured Playlists */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Playlists</h2>
          <a href="/dashboard/browse/featured" className="text-sm text-[var(--text-muted)] font-bold uppercase hover:underline">
            See all
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {featuredPlaylists.slice(0, 5).map((playlist) => (
            <a 
              key={playlist.id}
              href={`/dashboard/${playlist.type}/${playlist.id}`}
              className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer group"
            >
              <div className="relative mb-4">
                <img 
                  src={playlist.images?.[0]?.url} 
                  alt={playlist.name}
                  className="w-full aspect-square object-cover rounded-md shadow-md"
                />
                <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="h-5 w-5 text-black" fill="currentColor" />
                </div>
              </div>
              <h3 className="font-semibold truncate">{playlist.name}</h3>
              <p className="text-sm text-[var(--text-muted)] line-clamp-2">{playlist.description}</p>
            </a>
          ))}
        </div>
      </section>
      
      {/* New Releases */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">New Releases</h2>
          <a href="/dashboard/browse/new-releases" className="text-sm text-[var(--text-muted)] font-bold uppercase hover:underline">
            See all
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {newReleases.slice(0, 4).map((album) => (
            <a 
              key={album.id}
              href={`/dashboard/${album.album_type}/${album.id}`}
              className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer group"
            >
              <div className="relative mb-4">
                <img 
                  src={album.images?.[0]?.url} 
                  alt={album.name}
                  className="w-full aspect-square object-cover rounded-md shadow-md"
                />
                <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="h-5 w-5 text-black" fill="currentColor" />
                </div>
              </div>
              <h3 className="font-semibold truncate">{album.name}</h3>
              <p className="text-sm text-[var(--text-muted)] truncate">{album.artists.map(artist => artist.name).join(', ')}</p>
            </a>
          ))}
        </div>
      </section>
      
      {/* Top Artists */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Top Artists</h2>
          <a href="/dashboard/browse/top-artists" className="text-sm text-[var(--text-muted)] font-bold uppercase hover:underline">
            See all
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {topArtists.slice(0, 5).map((artist) => (
            <a 
              key={artist.id}
              href={`/dashboard/artist/${artist.id}`}
              className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer group"
            >
              <div className="relative mb-4">
                <img 
                  src={artist.images?.[0]?.url} 
                  alt={artist.name}
                  className="w-full aspect-square object-cover rounded-md shadow-md"
                />
                <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="h-5 w-5 text-black" fill="currentColor" />
                </div>
              </div>
              <h3 className="font-semibold truncate">{artist.name}</h3>
            </a>
          ))}
        </div>
      </section>
      
      {/* Indonesia Content */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Indonesia</h2>
          <a href="/dashboard/browse/indonesia" className="text-sm text-[var(--text-muted)] font-bold uppercase hover:underline">
            See all
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {mockIndonesiaTopPicks.slice(0, 4).map((item) => (
            <a 
              key={item.id}
              href={`/dashboard/${item.type}/${item.id}`}
              className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer group"
            >
              <div className="relative mb-4">
                <img 
                  src={item.images?.[0]?.url} 
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded-md shadow-md"
                />
                <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="h-5 w-5 text-black" fill="currentColor" />
                </div>
              </div>
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-[var(--text-muted)] line-clamp-2">{item.description}</p>
            </a>
          ))}
        </div>
      </section>
      
      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="mt-12 p-4 bg-[var(--card)] bg-opacity-30 rounded-lg">
          <p className="text-center text-[var(--text-muted)]">
            You're in demo mode. This is a showcase of what the app would look like with real Spotify data.
          </p>
        </div>
      )}
    </div>
  );
}

// Mock data for demo mode
const mockUserPlaylists = [
  {
    id: "user-playlist-1",
    name: "Liked Songs",
    images: [{ url: "https://misc.scdn.co/liked-songs/liked-songs-640.png" }],
    owner: { display_name: "You" },
    tracks: { total: 127 }
  },
  {
    id: "user-playlist-2",
    name: "Your Top Songs 2023",
    images: [{ url: "https://wrapped-images.spotifycdn.com/image/wrapped-2023/your-top-songs-2023.jpg" }],
    owner: { display_name: "Spotify" },
    tracks: { total: 100 }
  },
  {
    id: "user-playlist-3",
    name: "Discover Weekly",
    images: [{ url: "https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/aAbca4VNfzWuUCQ_FGiEFA==/bmVuZW5lbmVuZW5lbmVuZQ==" }],
    owner: { display_name: "Spotify" },
    tracks: { total: 30 }
  },
  {
    id: "user-playlist-4",
    name: "Chill Mix",
    images: [{ url: "https://seed-mix-image.spotifycdn.com/v6/img/chill/0du5cEVh5yTK3QJXyrWavw/en/default" }],
    owner: { display_name: "Spotify" },
    tracks: { total: 50 }
  }
];

const mockFeaturedPlaylists = [
  {
    id: "featured-1",
    name: "Today's Top Hits",
    description: "Jung Kook is on top of the Hottest 50!",
    images: [{ url: "https://i.scdn.co/image/ab67706f00000003e2e1495a3c40b72dc5194a9a" }],
    owner: { display_name: "Spotify" },
    tracks: { total: 50 }
  },
  {
    id: "featured-2",
    name: "RapCaviar",
    description: "New music from Lil Baby, Gunna and Moneybagg Yo.",
    images: [{ url: "https://i.scdn.co/image/ab67706f0000000386c8ee5971e69e79eec11679" }],
    owner: { display_name: "Spotify" },
    tracks: { total: 50 }
  },
  {
    id: "featured-3",
    name: "Mega Hit Mix",
    description: "A mega mix of 75 favorites from the last few years!",
    images: [{ url: "https://i.scdn.co/image/ab67706f000000034f3cbf921f88d68d3d6c5b9e" }],
    owner: { display_name: "Spotify" },
    tracks: { total: 75 }
  },
  {
    id: "featured-4",
    name: "All Out 2010s",
    description: "The biggest songs of the 2010s.",
    images: [{ url: "https://i.scdn.co/image/ab67706f00000003c0c5bb00461fd8df8c832943" }],
    owner: { display_name: "Spotify" },
    tracks: { total: 100 }
  },
  {
    id: "featured-5",
    name: "Rock Classics",
    description: "Rock legends & epic songs that continue to inspire generations.",
    images: [{ url: "https://i.scdn.co/image/ab67706f0000000278b4745cb9ce8ffe32daaf7e" }],
    owner: { display_name: "Spotify" },
    tracks: { total: 100 }
  },
  {
    id: "featured-6",
    name: "Peaceful Piano",
    description: "Relax and indulge with beautiful piano pieces",
    images: [{ url: "https://i.scdn.co/image/ab67706f00000003ca5a7517156021292e5663a6" }],
    owner: { display_name: "Spotify" },
    tracks: { total: 174 }
  }
];

const mockNewReleases = [
  {
    id: "album-1",
    name: "GOLDEN",
    artists: [{ id: "artist-1", name: "Jung Kook" }],
    images: [{ url: "https://i.scdn.co/image/ab67616d0000b2738fc2c8ccc8cc066110b21744" }],
    release_date: "2023-11-03",
    album_type: "album"
  },
  {
    id: "album-2",
    name: "For All The Dogs",
    artists: [{ id: "artist-2", name: "Drake" }],
    images: [{ url: "https://i.scdn.co/image/ab67616d0000b273d4a92be6f80a1107e6ac8be8" }],
    release_date: "2023-10-06",
    album_type: "album"
  },
  {
    id: "album-3",
    name: "Hackney Diamonds",
    artists: [{ id: "artist-3", name: "The Rolling Stones" }],
    images: [{ url: "https://i.scdn.co/image/ab67616d0000b2736d9bea67f2835f4f81927ff6" }],
    release_date: "2023-10-20",
    album_type: "album"
  },
  {
    id: "album-4",
    name: "GUTS",
    artists: [{ id: "artist-4", name: "Olivia Rodrigo" }],
    images: [{ url: "https://i.scdn.co/image/ab67616d0000b2738c5a5a3a6d72b8ed0d9de9ee" }],
    release_date: "2023-09-08",
    album_type: "album"
  },
  {
    id: "album-5",
    name: "The Rise and Fall of a Midwest Princess",
    artists: [{ id: "artist-5", name: "Chappell Roan" }],
    images: [{ url: "https://i.scdn.co/image/ab67616d0000b273d9af5d2e3a37423b1e2f855d" }],
    release_date: "2023-09-22",
    album_type: "album"
  },
  {
    id: "album-6",
    name: "Stick Season (We'll All Be Here Forever)",
    artists: [{ id: "artist-6", name: "Noah Kahan" }],
    images: [{ url: "https://i.scdn.co/image/ab67616d0000b273e481c8b1134b3762705d0ec8" }],
    release_date: "2023-06-09",
    album_type: "album"
  }
];

const mockTopArtists = [
  {
    id: "artist-1",
    name: "Taylor Swift",
    images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0" }],
    type: "artist"
  },
  {
    id: "artist-2",
    name: "Drake",
    images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9" }],
    type: "artist"
  },
  {
    id: "artist-3",
    name: "The Weeknd",
    images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb" }],
    type: "artist"
  },
  {
    id: "artist-4",
    name: "Bad Bunny",
    images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb8ee9a6f54dcbd3bc500a837a" }],
    type: "artist"
  },
  {
    id: "artist-5",
    name: "Billie Eilish",
    images: [{ url: "https://i.scdn.co/image/ab6761610000e5ebd8b9980db67272cb4d2c3daf" }],
    type: "artist"
  },
  {
    id: "artist-6",
    name: "aespa",
    images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb6a2e4c23c33db2a8a5b58da1" }],
    type: "artist"
  }
];

const mockIndonesiaTopPicks = [
  {
    id: "id-artist-1",
    name: "Tulus",
    type: "artist",
    images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb0b5d85c2267d7d3af45bb3ac" }]
  },
  {
    id: "id-artist-2",
    name: "Isyana Sarasvati",
    type: "artist",
    images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb3c02f4a9cca854f0862a5bbc" }]
  },
  {
    id: "id-album-1",
    name: "Monokrom",
    type: "album",
    artists: [{ id: "id-artist-1", name: "Tulus" }],
    images: [{ url: "https://i.scdn.co/image/ab67616d0000b273a0931e5bd25b6d2a67b67b67" }]
  },
  {
    id: "id-playlist-1",
    name: "Indonesia Top 50",
    type: "playlist",
    owner: { display_name: "Spotify" },
    tracks: { total: 50 },
    images: [{ url: "https://charts-images.scdn.co/assets/locale_en/regional/daily/region_id_default.jpg" }]
  },
  {
    id: "id-artist-3",
    name: "Raisa",
    type: "artist",
    images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb0c3d0a1f2e8b1a7f4e4c9b0d" }]
  },
  {
    id: "id-album-2",
    name: "Mantra Mantra",
    type: "album",
    artists: [{ id: "id-artist-2", name: "Isyana Sarasvati" }],
    images: [{ url: "https://i.scdn.co/image/ab67616d0000b273d2aaf635815c265aa1ecdecc" }]
  }
];
