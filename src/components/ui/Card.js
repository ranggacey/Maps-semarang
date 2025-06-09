"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({ data, type = "playlist", onClick }) {
  const images = data.images || data.album?.images || [];
  const image = images[0]?.url;
  
  const renderImage = () => {
    if (image) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={image} 
          alt={data.name}
          className={cn(
            "object-cover w-full h-full transition",
            type === "artist" ? "rounded-full" : "rounded-md"
          )}
        />
      );
    }
    
    return (
      <div 
        className={cn(
          "w-full h-full bg-[var(--card)] flex items-center justify-center",
          type === "artist" ? "rounded-full" : "rounded-md"
        )}
      >
        <span className="text-[var(--secondary)]">No Image</span>
      </div>
    );
  };
  
  const getSubtitle = () => {
    switch (type) {
      case "playlist":
        return data.description || `By ${data.owner?.display_name || "Unknown"}`;
      case "album":
        return data.artists?.map(a => a.name).join(", ") || "Unknown Artist";
      case "artist":
        return "Artist";
      case "track":
        return data.artists?.map(a => a.name).join(", ") || "Unknown Artist";
      default:
        return "";
    }
  };
  
  return (
    <div 
      className="group relative flex flex-col gap-y-3 p-4 bg-[var(--card)] rounded-md hover:bg-[var(--card-hover)] transition cursor-pointer"
      onClick={onClick}
    >
      <div className={cn(
        "relative aspect-square w-full overflow-hidden",
        type === "artist" ? "rounded-full" : "rounded-md"
      )}>
        {renderImage()}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
          <button 
            className="flex items-center justify-center rounded-full bg-[var(--primary)] p-3 drop-shadow-md hover:scale-105 transition"
            onClick={(e) => {
              e.stopPropagation();
              // In a real app, this would interact with the Spotify Web Playback SDK
            }}
          >
            <Play className="h-5 w-5 text-black" fill="black" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-1">
        <h3 className="font-semibold truncate">{data.name}</h3>
        <p className="text-sm text-[var(--secondary)] truncate">
          {getSubtitle()}
        </p>
      </div>
    </div>
  );
} 