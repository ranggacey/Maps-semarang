"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { Play } from "lucide-react";

export function Card({
  className,
  data,
  onClick,
  type = "default",
}) {
  const getImageUrl = () => {
    if (!data) return "/images/placeholder.png";
    
    if (type === "artist" && data.images?.[0]) {
      return data.images[0].url;
    }
    
    if (type === "playlist" && data.images?.[0]) {
      return data.images[0].url;
    }
    
    if (type === "album" && data.images?.[0]) {
      return data.images[0].url;
    }
    
    if (type === "track" && data.album?.images?.[0]) {
      return data.album.images[0].url;
    }
    
    return "/images/placeholder.png";
  };

  const getName = () => {
    if (!data) return "Unknown";
    return data.name || "Unknown";
  };

  const getSubtitle = () => {
    if (!data) return "";
    
    if (type === "artist") {
      return "Artist";
    }
    
    if (type === "playlist") {
      return `By ${data.owner?.display_name || "Unknown"}`;
    }
    
    if (type === "album") {
      return `By ${data.artists?.[0]?.name || "Unknown"}`;
    }
    
    if (type === "track") {
      return `By ${data.artists?.[0]?.name || "Unknown"}`;
    }
    
    return "";
  };

  return (
    <div 
      className={twMerge(
        "group relative flex flex-col gap-3 p-3 bg-[var(--card)] rounded-md card-hover cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md">
        <Image
          src={getImageUrl()}
          alt={getName()}
          fill
          className={twMerge(
            "object-cover",
            type === "artist" && "rounded-full"
          )}
        />
        <div className="absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-[var(--primary)] p-3 opacity-0 drop-shadow-md transition-all group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
          <Play className="h-5 w-5 text-black" fill="black" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="truncate font-semibold">{getName()}</p>
        <p className="truncate text-sm text-[var(--secondary)]">{getSubtitle()}</p>
      </div>
    </div>
  );
} 