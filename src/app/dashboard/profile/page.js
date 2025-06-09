"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ExternalLink, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userStats, setUserStats] = useState({
    playlists: 12,
    followers: 7
  });

  // For real implementation, fetch user data from Spotify API
  // This is just a placeholder for now
  useEffect(() => {
    if (session?.user) {
      // In a real app, we would fetch user data from Spotify API
      // For now, we'll just use mock data
    }
  }, [session]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleOpenInSpotify = () => {
    if (session?.user?.spotifyUrl) {
      window.open(session.user.spotifyUrl, "_blank");
    } else {
      window.open("https://open.spotify.com", "_blank");
    }
  };

  return (
    <div className="pb-8">
      <div className="relative h-48 md:h-64 bg-gradient-to-b from-[var(--primary-hover)] to-[var(--background)]">
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-8">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[var(--background)]">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || "User"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[var(--card)] flex items-center justify-center">
                <span className="text-4xl font-bold text-[var(--text-muted)]">
                  {session?.user?.name?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-24 ml-8">
        <div className="mb-8">
          <p className="text-sm text-[var(--text-muted)] mb-1">Profile</p>
          <h1 className="text-5xl font-bold mb-4">{session?.user?.name || "User"}</h1>
          
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="font-bold">{userStats.playlists}</span>
              <span className="text-[var(--text-muted)] ml-1">Playlists</span>
            </div>
            <div>
              <span className="font-bold">{userStats.followers}</span>
              <span className="text-[var(--text-muted)] ml-1">Followers</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleOpenInSpotify}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent)] hover:border-white transition-colors"
          >
            <span>Open in Spotify</span>
            <ExternalLink size={16} />
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent)] hover:border-white transition-colors"
          >
            <span>Logout</span>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="mt-12 mx-8">
        <h2 className="text-2xl font-bold mb-6">Account Details</h2>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center py-4 border-b border-[var(--accent)]">
            <span className="text-[var(--text-muted)]">Email</span>
            <span>{session?.user?.email || "Not available"}</span>
          </div>
          
          <div className="flex justify-between items-center py-4 border-b border-[var(--accent)]">
            <span className="text-[var(--text-muted)]">Country</span>
            <span>ID</span>
          </div>
          
          <div className="flex justify-between items-center py-4 border-b border-[var(--accent)]">
            <span className="text-[var(--text-muted)]">Account Type</span>
            <span>Free</span>
          </div>
          
          <div className="flex justify-between items-center py-4 border-b border-[var(--accent)]">
            <span className="text-[var(--text-muted)]">Spotify ID</span>
            <span className="text-sm">{session?.user?.id || "Not available"}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 