"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Globe, BarChart2, Music, Play } from "lucide-react";

export default function ChartsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("global");
  
  // Mock chart data
  const charts = {
    global: [
      {
        id: "1",
        title: "Top 50 - Global",
        description: "Your daily update of the most played tracks right now - Global.",
        image: "https://charts-images.scdn.co/assets/locale_en/regional/daily/region_global_default.jpg",
        type: "playlist"
      },
      {
        id: "2",
        title: "Global Viral 50",
        description: "The most viral tracks on Spotify right now - Global.",
        image: "https://charts-images.scdn.co/assets/locale_en/viral/daily/region_global_default.jpg",
        type: "playlist"
      },
      {
        id: "3",
        title: "Top Artists - Global",
        description: "The most streamed artists worldwide.",
        image: "https://i.scdn.co/image/ab67706c0000da84fcb8b92f2615d3261b8eb146",
        type: "playlist"
      }
    ],
    indonesia: [
      {
        id: "4",
        title: "Top 50 - Indonesia",
        description: "Your daily update of the most played tracks right now - Indonesia.",
        image: "https://charts-images.scdn.co/assets/locale_en/regional/daily/region_id_default.jpg",
        type: "playlist"
      },
      {
        id: "5",
        title: "Indonesia Viral 50",
        description: "The most viral tracks on Spotify right now - Indonesia.",
        image: "https://charts-images.scdn.co/assets/locale_en/viral/daily/region_id_default.jpg",
        type: "playlist"
      },
      {
        id: "6",
        title: "Top Artists - Indonesia",
        description: "The most streamed artists in Indonesia.",
        image: "https://i.scdn.co/image/ab67706c0000da84fcb8b92f2615d3261b8eb146",
        type: "playlist"
      }
    ],
    genres: [
      {
        id: "7",
        title: "Top Rock Tracks",
        description: "The most popular rock tracks right now.",
        image: "https://i.scdn.co/image/ab67706c0000da84fcb8b92f2615d3261b8eb146",
        type: "playlist"
      },
      {
        id: "8",
        title: "Top Pop Tracks",
        description: "The most popular pop tracks right now.",
        image: "https://i.scdn.co/image/ab67706c0000da84fcb8b92f2615d3261b8eb146",
        type: "playlist"
      },
      {
        id: "9",
        title: "Top Hip-Hop Tracks",
        description: "The most popular hip-hop tracks right now.",
        image: "https://i.scdn.co/image/ab67706c0000da84fcb8b92f2615d3261b8eb146",
        type: "playlist"
      },
      {
        id: "10",
        title: "Top Electronic/Dance Tracks",
        description: "The most popular electronic tracks right now.",
        image: "https://i.scdn.co/image/ab67706c0000da84fcb8b92f2615d3261b8eb146",
        type: "playlist"
      }
    ]
  };

  // Tabs for chart categories
  const tabs = [
    { id: "global", label: "Global", icon: Globe },
    { id: "indonesia", label: "Indonesia", icon: BarChart2 },
    { id: "genres", label: "By Genre", icon: Music }
  ];

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Charts</h1>
        <p className="text-[var(--text-muted)]">The most played tracks on Spotify</p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-[var(--accent)] mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-[var(--primary)] text-white"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Chart cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charts[activeTab].map((chart) => (
          <a 
            key={chart.id}
            href={`/dashboard/${chart.type}/${chart.id}`}
            className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg overflow-hidden group"
          >
            <div className="relative">
              <img 
                src={chart.image} 
                alt={chart.title}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-[var(--primary)] rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
                  <Play className="h-6 w-6 text-black" fill="currentColor" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{chart.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{chart.description}</p>
            </div>
          </a>
        ))}
      </div>
      
      {/* Trending section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={`trending-${i}`}
              className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer group"
            >
              <div className="relative mb-4">
                <img 
                  src={`https://picsum.photos/seed/${i + 100}/300/300`}
                  alt={`Trending ${i}`}
                  className="w-full aspect-square object-cover rounded-md shadow-md"
                />
                <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="h-5 w-5 text-black" fill="currentColor" />
                </div>
              </div>
              <h3 className="font-semibold truncate">Trending Track {i}</h3>
              <p className="text-sm text-[var(--text-muted)] truncate">Various Artists</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 