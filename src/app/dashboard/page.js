"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { getNewReleases, getFeaturedPlaylists, getUserTopItems } from "@/lib/spotify/api";

// Mock data for development mode
const mockNewReleases = {
  albums: {
    items: Array(6).fill(null).map((_, i) => ({
      id: `mock-album-${i}`,
      name: `Mock Album ${i + 1}`,
      artists: [{ name: `Artist ${i + 1}` }],
      images: [{ url: `https://picsum.photos/seed/${i + 100}/300/300` }],
      type: "album"
    }))
  }
};

const mockFeaturedPlaylists = {
  playlists: {
    items: Array(6).fill(null).map((_, i) => ({
      id: `mock-playlist-${i}`,
      name: `Mock Playlist ${i + 1}`,
      description: `This is a mock playlist description ${i + 1}`,
      images: [{ url: `https://picsum.photos/seed/${i + 200}/300/300` }],
      type: "playlist"
    }))
  }
};

const mockTopArtists = {
  items: Array(6).fill(null).map((_, i) => ({
    id: `mock-artist-${i}`,
    name: `Mock Artist ${i + 1}`,
    images: [{ url: `https://picsum.photos/seed/${i + 300}/300/300` }],
    type: "artist"
  }))
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [newReleases, setNewReleases] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) return;
      
      setLoading(true);
      
      // Check if we're using the demo account
      if (session.user.id === "demo-user-id") {
        setIsDemoMode(true);
        setNewReleases(mockNewReleases.albums?.items || []);
        setFeaturedPlaylists(mockFeaturedPlaylists.playlists?.items || []);
        setTopArtists(mockTopArtists.items || []);
        setLoading(false);
        return;
      }
      
      try {
        const [newReleasesData, featuredPlaylistsData, topArtistsData] = await Promise.all([
          getNewReleases(session.user.accessToken),
          getFeaturedPlaylists(session.user.accessToken),
          getUserTopItems(session.user.accessToken, 'artists')
        ]);
        
        setNewReleases(newReleasesData.albums?.items || []);
        setFeaturedPlaylists(featuredPlaylistsData.playlists?.items || []);
        setTopArtists(topArtistsData.items || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fall back to mock data if API calls fail
        setNewReleases(mockNewReleases.albums?.items || []);
        setFeaturedPlaylists(mockFeaturedPlaylists.playlists?.items || []);
        setTopArtists(mockTopArtists.items || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Good {getTimeOfDay()}</h1>
        {isDemoMode && (
          <p className="text-[var(--secondary)] mt-2">
            You're using the demo account. Some features may be limited.
          </p>
        )}
      </div>

      {/* Featured Playlists */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Playlists</h2>
          <button 
            onClick={() => {}}
            className="text-sm font-semibold text-[var(--secondary)] hover:underline"
          >
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {featuredPlaylists.slice(0, 6).map((playlist) => (
            <Card 
              key={playlist.id}
              data={playlist}
              type="playlist"
              onClick={() => router.push(`/dashboard/playlist/${playlist.id}`)}
            />
          ))}
        </div>
      </div>

      {/* New Releases */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">New Releases</h2>
          <button 
            onClick={() => {}}
            className="text-sm font-semibold text-[var(--secondary)] hover:underline"
          >
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {newReleases.slice(0, 6).map((album) => (
            <Card 
              key={album.id}
              data={album}
              type="album"
              onClick={() => router.push(`/dashboard/album/${album.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Your Top Artists */}
      {topArtists.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Top Artists</h2>
            <button 
              onClick={() => router.push('/dashboard/account')}
              className="text-sm font-semibold text-[var(--secondary)] hover:underline"
            >
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {topArtists.slice(0, 6).map((artist) => (
              <Card 
                key={artist.id}
                data={artist}
                type="artist"
                onClick={() => router.push(`/dashboard/artist/${artist.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
