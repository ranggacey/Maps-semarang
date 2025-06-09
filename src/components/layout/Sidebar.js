"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Home, Search, Library, PlusSquare, Heart, 
  Compass, User, Music, Disc, Radio, Clock, 
  ListMusic, BarChart2, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./Sidebar.module.css";

export function Sidebar() {
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
      icon: Library,
      label: "Your Library",
      active: pathname === "/dashboard/collection/playlists",
      href: "/dashboard/collection/playlists",
    }
  ];

  const yourMusic = [
    {
      label: "Liked Songs",
      icon: Heart,
      href: "/dashboard/collection/tracks",
      active: pathname === "/dashboard/collection/tracks",
      color: "from-blue-600 to-[var(--primary)]"
    },
    {
      label: "Recently Played",
      icon: Clock,
      href: "/dashboard/collection/recent",
      active: pathname === "/dashboard/collection/recent",
      color: "from-purple-600 to-pink-500"
    },
    {
      label: "Your Episodes",
      icon: Radio,
      href: "/dashboard/collection/episodes",
      active: pathname === "/dashboard/collection/episodes",
      color: "from-green-500 to-emerald-600"
    },
    {
      label: "Your Artists",
      icon: User,
      href: "/dashboard/collection/artists",
      active: pathname === "/dashboard/collection/artists",
      color: "from-red-500 to-orange-500"
    },
    {
      label: "Your Albums",
      icon: Disc,
      href: "/dashboard/collection/albums",
      active: pathname === "/dashboard/collection/albums",
      color: "from-yellow-500 to-amber-600"
    },
  ];

  const discover = [
    {
      label: "Charts",
      icon: BarChart2,
      href: "/dashboard/browse/charts",
      active: pathname === "/dashboard/browse/charts",
    },
    {
      label: "New Releases",
      icon: Music,
      href: "/dashboard/browse/new-releases",
      active: pathname === "/dashboard/browse/new-releases",
    },
    {
      label: "Indonesia Top",
      icon: Globe,
      href: "/dashboard/browse/indonesia",
      active: pathname === "/dashboard/browse/indonesia",
    },
    {
      label: "Playlists",
      icon: ListMusic,
      href: "/dashboard/browse/playlists",
      active: pathname === "/dashboard/browse/playlists",
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.section}>
        <Link href="/dashboard" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-black" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.85 14.35c-.2 0-.35-.1-.5-.2-1.35-.85-3.05-1.3-4.85-1.3-1.8 0-3.5.45-4.85 1.3-.15.1-.3.2-.5.2-.4 0-.75-.35-.75-.75 0-.35.2-.65.45-.75 1.65-1 3.6-1.5 5.65-1.5 2.05 0 4 .5 5.65 1.5.25.1.45.45.45.75 0 .4-.35.75-.75.75zm1.3-3.15c-.25 0-.45-.1-.6-.25-1.7-1.05-4.05-1.7-6.55-1.7s-4.85.65-6.55 1.7c-.15.15-.35.25-.6.25-.45 0-.85-.4-.85-.85 0-.35.2-.65.45-.8 2-1.25 4.75-2 7.55-2s5.55.75 7.55 2c.25.15.45.45.45.8 0 .45-.4.85-.85.85zm1.45-3.4c-.25 0-.45-.1-.65-.25-2.05-1.25-5.05-2-8.3-2-3.25 0-6.25.75-8.3 2-.2.15-.4.25-.65.25-.55 0-1-.45-1-1 0-.35.2-.7.45-.85 2.4-1.45 5.7-2.25 9.5-2.25 3.8 0 7.1.8 9.5 2.25.25.15.45.5.45.85 0 .55-.45 1-1 1z" />
            </svg>
          </div>
          <h1 className={styles.logoText}>Spotitiy</h1>
        </Link>
        <div>
          {routes.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                styles.navItem,
                item.active && styles.navItemActive
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Your Music
        </h2>
        <div>
          {yourMusic.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                styles.navItem,
                item.active && styles.navItemActive
              )}
            >
              <div className={cn(
                styles.iconContainer,
                "bg-gradient-to-br",
                item.color || "from-[var(--primary)] to-blue-700"
              )}>
                <item.icon className="h-4 w-4 text-white" />
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Discover
        </h2>
        <div>
          {discover.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                styles.navItem,
                item.active && styles.navItemActive
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <button className={styles.navItem}>
          <PlusSquare className="h-5 w-5" />
          <span>Create Playlist</span>
        </button>
      </div>
      
      {session?.user && (
        <div className={styles.userSection}>
          <div className={styles.userContainer}>
            <div className={styles.userAvatar}>
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={styles.userName}>
                {session.user.name || "User"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 