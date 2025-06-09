"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  ListMusic
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export function Player() {
  const { data: session } = useSession();
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  // This is a mock function - in a real app, this would interact with the Spotify API
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // This is a mock function - in a real app, this would interact with the Spotify API
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // This is a mock function - in a real app, this would interact with the Spotify API
  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
    if (parseInt(e.target.value) === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="fixed bottom-0 bg-[var(--card)] border-t border-[var(--accent)] w-full py-2 px-4 h-[90px]">
      <div className="grid grid-cols-3 h-full">
        <div className="flex items-center gap-x-4">
          {currentTrack ? (
            <>
              <div className="w-[60px] h-[60px] rounded-md overflow-hidden">
                <img 
                  src={currentTrack.album?.images?.[0]?.url || "/images/placeholder.png"} 
                  alt={currentTrack.name || "Now playing"}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-y-1 overflow-hidden">
                <p className="text-white truncate text-sm">{currentTrack.name || "Not playing"}</p>
                <p className="text-xs text-[var(--secondary)] truncate">
                  {currentTrack.artists?.map(a => a.name).join(", ") || "Unknown artist"}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-x-2">
              <div className="w-[60px] h-[60px] rounded-md bg-[var(--accent)] flex items-center justify-center">
                <ListMusic className="text-[var(--secondary)]" />
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-white text-sm">Not playing</p>
                <p className="text-xs text-[var(--secondary)]">
                  Play something to start listening
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-y-2">
          <div className="flex items-center gap-x-6">
            <button className="text-[var(--secondary)] hover:text-white transition">
              <Shuffle className="h-5 w-5" />
            </button>
            <button className="text-[var(--secondary)] hover:text-white transition">
              <SkipBack className="h-5 w-5" />
            </button>
            <button 
              onClick={togglePlay}
              className="flex items-center justify-center rounded-full bg-white p-2 hover:scale-105 transition"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-black" fill="black" />
              ) : (
                <Play className="h-5 w-5 text-black" fill="black" />
              )}
            </button>
            <button className="text-[var(--secondary)] hover:text-white transition">
              <SkipForward className="h-5 w-5" />
            </button>
            <button className="text-[var(--secondary)] hover:text-white transition">
              <Repeat className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-x-2 w-full max-w-[600px]">
            <span className="text-xs text-[var(--secondary)] w-12 text-right">0:00</span>
            <input
              type="range"
              min="0"
              max="100"
              value="0"
              onChange={() => {}}
              className="h-1 w-full rounded-full bg-[var(--accent)] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition"
            />
            <span className="text-xs text-[var(--secondary)] w-12">0:00</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-2">
          <button 
            onClick={toggleMute}
            className="text-[var(--secondary)] hover:text-white transition"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="h-1 w-24 rounded-full bg-[var(--accent)] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition"
          />
        </div>
      </div>
    </div>
  );
} 