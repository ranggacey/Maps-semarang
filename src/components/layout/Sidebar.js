"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Search, Library, PlusSquare, Heart, Compass, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

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
    {
      icon: Compass,
      label: "Browse",
      active: pathname.includes("/dashboard/browse"),
      href: "/dashboard/browse",
    },
    {
      icon: User,
      label: "Profile",
      active: pathname === "/dashboard/account",
      href: "/dashboard/account",
    },
  ];

  const playlists = [
    {
      label: "Liked Songs",
      icon: Heart,
      href: "/dashboard/collection/tracks",
    },
    {
      label: "Create Playlist",
      icon: PlusSquare,
      href: "#",
    },
  ];

  return (
    <div className="flex h-full">
      <div className="hidden md:flex flex-col h-full w-[300px] bg-[var(--background-dark)] p-2">
        <div className="flex flex-col gap-y-2 px-5 py-4">
          <Link href="/dashboard" className="flex items-center gap-x-4 mb-4">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-[var(--primary)]" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.85 14.35c-.2 0-.35-.1-.5-.2-1.35-.85-3.05-1.3-4.85-1.3-1.8 0-3.5.45-4.85 1.3-.15.1-.3.2-.5.2-.4 0-.75-.35-.75-.75 0-.35.2-.65.45-.75 1.65-1 3.6-1.5 5.65-1.5 2.05 0 4 .5 5.65 1.5.25.1.45.45.45.75 0 .4-.35.75-.75.75zm1.3-3.15c-.25 0-.45-.1-.6-.25-1.7-1.05-4.05-1.7-6.55-1.7s-4.85.65-6.55 1.7c-.15.15-.35.25-.6.25-.45 0-.85-.4-.85-.85 0-.35.2-.65.45-.8 2-1.25 4.75-2 7.55-2s5.55.75 7.55 2c.25.15.45.45.45.8 0 .45-.4.85-.85.85zm1.45-3.4c-.25 0-.45-.1-.65-.25-2.05-1.25-5.05-2-8.3-2-3.25 0-6.25.75-8.3 2-.2.15-.4.25-.65.25-.55 0-1-.45-1-1 0-.35.2-.7.45-.85 2.4-1.45 5.7-2.25 9.5-2.25 3.8 0 7.1.8 9.5 2.25.25.15.45.5.45.85 0 .55-.45 1-1 1z" />
            </svg>
            <h1 className="text-xl font-semibold">Spotitiy</h1>
          </Link>
          <div className="space-y-1">
            {routes.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-x-4 text-[var(--secondary)] font-medium hover:text-white py-3 px-4 rounded-md transition",
                  item.active && "text-white bg-[var(--card)]"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-2 px-5 py-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-x-2 text-[var(--secondary)] hover:text-white transition">
              <Library className="h-6 w-6" />
              <span className="font-medium">Your Library</span>
            </div>
            <PlusSquare className="h-5 w-5 text-[var(--secondary)] hover:text-white cursor-pointer transition" />
          </div>
          <div className="space-y-1">
            {playlists.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-x-4 text-[var(--secondary)] hover:text-white py-3 px-4 rounded-md transition"
              >
                <div className="flex items-center justify-center h-6 w-6 bg-gradient-to-br from-indigo-600 to-[var(--primary)] rounded-sm">
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <main className="h-full flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 