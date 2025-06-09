"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Card({ data, type = "album", onClick, onPlay }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getImage = () => {
    if (!data) return null;
    
    if (type === "artist" && data.images?.length > 0) {
      return data.images[0].url;
    }
    
    if (["album", "playlist", "track"].includes(type) && data.album?.images?.length > 0) {
      return data.album.images[0].url;
    }
    
    if (["album", "playlist"].includes(type) && data.images?.length > 0) {
      return data.images[0].url;
    }
    
    return null;
  };
  
  const getName = () => {
    if (!data) return "Unknown";
    return data.name || "Unknown";
  };
  
  const getSubtitle = () => {
    if (!data) return "";
    
    switch (type) {
      case "artist":
        return "Artist";
      case "album":
        return data.artists?.map(a => a.name).join(", ") || "Various Artists";
      case "playlist":
        return `${data.owner?.display_name || "Spotify"} • ${data.tracks?.total || 0} tracks`;
      case "track":
        return data.artists?.map(a => a.name).join(", ") || "Unknown Artist";
      default:
        return "";
    }
  };
  
  const handlePlay = (e) => {
    e.stopPropagation();
    if (onPlay) onPlay(data);
  };
  
  const image = getImage();
  const isArtist = type === "artist";
  
  return (
    <div 
      className={cn(
        "bg-[var(--card)] rounded-lg p-4 transition-all duration-300 cursor-pointer group",
        "hover:bg-[var(--card-hover)] hover:shadow-lg"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <div 
          className={cn(
            "aspect-square w-full overflow-hidden bg-[var(--accent)] mb-4 shadow-md",
            isArtist ? "rounded-full" : "rounded-md"
          )}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={image} 
              alt={getName()}
              className={cn(
                "object-cover w-full h-full",
                isHovered && "scale-105 transition-transform duration-300"
              )}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isArtist ? (
                <svg viewBox="0 0 24 24" className="h-12 w-12 text-[var(--secondary)]" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-12 w-12 text-[var(--secondary)]" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              )}
            </div>
          )}
        </div>
        
        {/* Play button overlay */}
        <button 
          className={cn(
            "absolute bottom-2 right-2 rounded-full bg-[var(--primary)] p-3 shadow-lg opacity-0 translate-y-2 transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 hover:bg-[var(--primary-hover)]"
          )}
          onClick={handlePlay}
          aria-label="Play"
        >
          <Play className="h-5 w-5 text-black" fill="currentColor" />
        </button>
      </div>
      
      <div>
        <h3 className="font-semibold truncate mb-1">{getName()}</h3>
        <p className="text-sm text-[var(--text-muted)] truncate">{getSubtitle()}</p>
      </div>
    </div>
  );
} 