"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCurrentUserProfile, getUserPlaylists } from "@/lib/spotify/api";

export default function AccountPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken) return;
      
      setLoading(true);
      try {
        const [profileData, playlistsData] = await Promise.all([
          getCurrentUserProfile(session.user.accessToken),
          getUserPlaylists(session.user.accessToken)
        ]);
        
        setProfile(profileData);
        setPlaylists(playlistsData.items || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const formatFollowers = (count) => {
    if (!count) return "0";
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
        <p className="text-[var(--secondary)] mb-4">We couldn't load your profile information.</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="w-48 h-48 rounded-full overflow-hidden bg-[var(--card)]">
          {profile.images?.[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={profile.images[0].url} 
              alt={profile.display_name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-24 w-24 text-[var(--secondary)]" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          <span className="text-sm font-medium">Profile</span>
          <h1 className="text-5xl font-bold mt-2 mb-4">{profile.display_name || "User"}</h1>
          
          <div className="flex items-center gap-x-4 mb-6">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-bold">{playlists.length}</span>
              <span className="text-sm text-[var(--secondary)]">Playlists</span>
            </div>
            <div className="h-10 w-px bg-[var(--accent)]"></div>
            <div className="flex flex-col items-center md:items-start">
              <span className="font-bold">{formatFollowers(profile.followers?.total)}</span>
              <span className="text-sm text-[var(--secondary)]">Followers</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.open(profile.external_urls?.spotify, '_blank')}
              className="flex items-center gap-2"
            >
              <span>Open in Spotify</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2 text-[var(--secondary)]"
            >
              <span>Logout</span>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Account Details */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Account Details</h2>
        <div className="bg-[var(--card)] p-6 rounded-lg">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-[var(--secondary)]">Email</span>
              <span>{profile.email || "Not available"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--secondary)]">Country</span>
              <span>{profile.country || "Not available"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--secondary)]">Account Type</span>
              <span className="capitalize">{profile.product || "Free"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--secondary)]">Spotify ID</span>
              <span>{profile.id || "Not available"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 