"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Clock, Calendar } from "lucide-react";

export default function RecentlyPlayedPage() {
  const { data: session } = useSession();
  
  // Mock recently played data
  const recentItems = [
    {
      id: "1",
      name: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      playedAt: "Today at 10:30 AM",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a",
      type: "track"
    },
    {
      id: "2",
      name: "After Hours",
      artist: "The Weeknd",
      playedAt: "Today at 10:25 AM",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a",
      type: "album"
    },
    {
      id: "3",
      name: "The Weeknd",
      playedAt: "Today at 10:00 AM",
      image: "https://i.scdn.co/image/ab6761610000e5eb8278b782cbb5a3963db88ada",
      type: "artist"
    },
    {
      id: "4",
      name: "Chill Mix",
      description: "Chill vibes for relaxation",
      playedAt: "Yesterday at 8:45 PM",
      image: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6",
      type: "playlist"
    },
    {
      id: "5",
      name: "Save Your Tears",
      artist: "The Weeknd",
      album: "After Hours",
      playedAt: "Yesterday at 8:40 PM",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a",
      type: "track"
    },
    {
      id: "6",
      name: "Starboy",
      artist: "The Weeknd",
      album: "Starboy",
      playedAt: "Yesterday at 8:35 PM",
      image: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a",
      type: "track"
    },
    {
      id: "7",
      name: "Peaceful Piano",
      description: "Relax and indulge with beautiful piano pieces",
      playedAt: "2 days ago",
      image: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6",
      type: "playlist"
    },
    {
      id: "8",
      name: "Lo-Fi Beats",
      description: "Beats to relax/study to",
      playedAt: "3 days ago",
      image: "https://i.scdn.co/image/ab67706f000000025ea54b91b073c2776b966e7b",
      type: "playlist"
    }
  ];

  // Group items by date
  const groupedItems = recentItems.reduce((groups, item) => {
    const date = item.playedAt.includes("Today") 
      ? "Today" 
      : item.playedAt.includes("Yesterday")
        ? "Yesterday"
        : "Earlier";
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div className="pb-8">
      <h1 className="text-3xl font-bold mb-6">Recently Played</h1>
      
      {Object.entries(groupedItems).map(([date, items]) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{date}</span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {items.map((item) => (
              <a 
                key={item.id}
                href={`/dashboard/${item.type}/${item.id}`}
                className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer group"
              >
                <div className="relative mb-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className={`w-full aspect-square object-cover shadow-md ${item.type === 'artist' ? 'rounded-full' : 'rounded-md'}`}
                  />
                  <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <svg className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold truncate">{item.name}</h3>
                <div className="text-sm text-[var(--text-muted)] truncate">
                  {item.type === 'track' && (
                    <span>{item.artist}</span>
                  )}
                  {item.type === 'album' && (
                    <span>Album • {item.artist}</span>
                  )}
                  {item.type === 'artist' && (
                    <span>Artist</span>
                  )}
                  {item.type === 'playlist' && (
                    <span>Playlist • {item.description}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-[var(--text-muted)]">
                  <Clock className="h-3 w-3" />
                  <span>{item.playedAt}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-12 text-center">
        <p className="text-[var(--text-muted)]">Only showing recent activity. Listen to more music to expand your history.</p>
      </div>
    </div>
  );
} 