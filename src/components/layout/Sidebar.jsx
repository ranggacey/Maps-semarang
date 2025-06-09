"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, Library, Plus, Heart, Download } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { getUserPlaylists } from "@/lib/spotify/api";

export function Sidebar({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!session?.user?.accessToken) return;
      
      setLoading(true);
      try {
        const data = await getUserPlaylists(session.user.accessToken);
        setPlaylists(data.items || []);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [session]);

  const routes = [
    {
      icon: Home,
      label: "Home",
      active: pathname === "/dashboard",
      href: "/dashboard",
    },
    {
      icon: Search,
      label: "Search",
      active: pathname === "/dashboard/search",
      href: "/dashboard/search",
    },
  ];

  return (
    <div className="flex h-full">
      <div className="hidden md:flex flex-col gap-y-2 h-full w-[300px] p-2">
        <div className="flex flex-col gap-y-4 px-5 py-4 bg-[var(--card)] rounded-lg">
          {routes.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={twMerge(
                "flex items-center gap-x-4 py-1 text-[var(--secondary)] font-medium hover:text-white transition",
                item.active && "text-white"
              )}
            >
              <item.icon className="h-6 w-6" />
              <p className="truncate w-full">{item.label}</p>
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-y-4 px-5 py-4 bg-[var(--card)] rounded-lg h-full overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2 text-[var(--secondary)]">
              <Library className="h-6 w-6" />
              <p className="font-medium">Your Library</p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5 text-[var(--secondary)]" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2 p-2 rounded-md bg-[var(--card-hover)]">
              <div className="relative min-h-[48px] min-w-[48px] rounded-md bg-pink-600 flex items-center justify-center">
                <Heart className="text-white" fill="white" />
              </div>
              <div className="flex flex-col gap-y-1 overflow-hidden">
                <p className="text-white truncate">Liked Songs</p>
                <p className="text-sm text-[var(--secondary)] truncate">
                  Playlist • Spotify
                </p>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <p className="text-sm text-[var(--secondary)]">Loading...</p>
              </div>
            ) : (
              <>
                {playlists.map((playlist) => (
                  <Link
                    key={playlist.id}
                    href={`/dashboard/playlist/${playlist.id}`}
                    className="flex items-center gap-x-2 p-2 rounded-md hover:bg-[var(--card-hover)] transition"
                  >
                    <div className="relative min-h-[48px] min-w-[48px] rounded-md overflow-hidden">
                      {playlist.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={playlist.images[0].url} 
                          alt={playlist.name}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-[var(--accent)]">
                          <Library className="h-6 w-6 text-[var(--secondary)]" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-y-1 overflow-hidden">
                      <p className="text-white truncate">{playlist.name}</p>
                      <p className="text-sm text-[var(--secondary)] truncate">
                        Playlist • {playlist.owner.display_name}
                      </p>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2 pr-2">{children}</main>
    </div>
  );
} 