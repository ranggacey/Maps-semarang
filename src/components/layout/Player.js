"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart, Maximize2, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

export function Player() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes in seconds
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0); // 0: no repeat, 1: repeat all, 2: repeat one

  // Mock data - in a real app this would come from Spotify's API
  const currentTrack = {
    name: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    image: "https://i.scdn.co/image/ab67616d00001e02ef12a4e3bcb7c777c4e00f0b",
  };

  useEffect(() => {
    // Simulate track progress
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  const handleProgressChange = (e) => {
    setCurrentTime(parseInt(e.target.value));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRepeat = () => {
    setRepeat((prevRepeat) => (prevRepeat + 1) % 3);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--background-dark)] border-t border-[var(--accent)] px-4 py-2 h-[90px]">
      <div className="flex items-center justify-between h-full">
        {/* Current Track Info */}
        <div className="flex items-center gap-x-4 w-1/4">
          {currentTrack.image && (
            <div className="h-14 w-14 rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={currentTrack.image} 
                alt={currentTrack.name}
                className="object-cover h-full w-full"
              />
            </div>
          )}
          <div className="flex flex-col">
            <span 
              className="font-medium hover:underline cursor-pointer truncate max-w-[150px]"
              onClick={() => router.push('/dashboard/track/123')}
            >
              {currentTrack.name}
            </span>
            <span 
              className="text-xs text-[var(--secondary)] hover:underline cursor-pointer truncate max-w-[150px]"
              onClick={() => router.push('/dashboard/artist/123')}
            >
              {currentTrack.artist}
            </span>
          </div>
          <button 
            onClick={() => setLiked(!liked)}
            className={cn(
              "ml-2 flex items-center justify-center",
              liked ? "text-[var(--primary)]" : "text-[var(--secondary)] hover:text-white"
            )}
          >
            <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
        
        {/* Player Controls */}
        <div className="flex flex-col items-center justify-center max-w-md w-1/2">
          <div className="flex items-center gap-x-6 mb-2">
            <button 
              onClick={() => setShuffle(!shuffle)}
              className={cn(
                "flex items-center justify-center",
                shuffle ? "text-[var(--primary)]" : "text-[var(--secondary)] hover:text-white"
              )}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-center text-[var(--secondary)] hover:text-white">
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
            <button className="flex items-center justify-center text-[var(--secondary)] hover:text-white">
              <SkipForward className="h-5 w-5" />
            </button>
            <button 
              onClick={toggleRepeat}
              className={cn(
                "flex items-center justify-center",
                repeat > 0 ? "text-[var(--primary)]" : "text-[var(--secondary)] hover:text-white"
              )}
            >
              <Repeat className="h-4 w-4" />
              {repeat === 2 && <span className="text-xs absolute">1</span>}
            </button>
          </div>
          
          <div className="flex items-center gap-x-2 w-full">
            <span className="text-xs text-[var(--secondary)]">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-[var(--accent)] rounded-full overflow-hidden group">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleProgressChange}
                className="w-full h-full opacity-0 cursor-pointer absolute"
              />
              <div 
                className="h-full bg-[var(--secondary)] group-hover:bg-[var(--primary)] transition"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-[var(--secondary)]">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Volume Controls */}
        <div className="flex items-center gap-x-3 w-1/4 justify-end">
          <button className="flex items-center justify-center text-[var(--secondary)] hover:text-white">
            <Laptop className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-x-2">
            <Volume2 className="h-4 w-4 text-[var(--secondary)]" />
            <div className="w-24 h-1 bg-[var(--accent)] rounded-full overflow-hidden group">
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-full opacity-0 cursor-pointer absolute"
              />
              <div 
                className="h-full bg-[var(--secondary)] group-hover:bg-[var(--primary)] transition"
                style={{ width: `${volume}%` }}
              ></div>
            </div>
          </div>
          <button className="flex items-center justify-center text-[var(--secondary)] hover:text-white">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 