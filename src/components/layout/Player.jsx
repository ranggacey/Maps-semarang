"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1, Repeat, Shuffle, Heart, Maximize2, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

export function Player() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes in seconds
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0); // 0: no repeat, 1: repeat all, 2: repeat one
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);

  // Mock data - in a real app this would come from Spotify's API
  const currentTrack = {
    name: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    image: "https://i.scdn.co/image/ab67616d00001e02ef12a4e3bcb7c777c4e00f0b",
    preview_url: "https://p.scdn.co/mp3-preview/505a0ddf7fbf560075eb8fc19e8d5a9d937a93bc?cid=774b29d4f13844c495f206cafdad9c86",
  };

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(currentTrack.preview_url);
    
    // Set up event listeners
    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.current.duration);
    });
    audioRef.current.addEventListener('ended', handleTrackEnd);
    
    // Set initial volume
    audioRef.current.volume = volume / 100;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, []);

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleTrackEnd = () => {
    if (repeat === 2) {
      // Repeat one
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      // In a real app, you would play the next track if repeat all is enabled
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          // Some browsers require user interaction before playing audio
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      if (audioRef.current) {
        audioRef.current.volume = previousVolume / 100;
      }
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
      setIsMuted(true);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleProgressBarClick = (e) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      setCurrentTime(newTime);
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    }
  };

  const handleVolumeBarClick = (e) => {
    if (volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newVolume = Math.floor(percent * 100);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
      if (newVolume === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRepeat = () => {
    setRepeat((prevRepeat) => (prevRepeat + 1) % 3);
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="h-4 w-4" />;
    } else if (volume < 50) {
      return <Volume1 className="h-4 w-4" />;
    } else {
      return <Volume2 className="h-4 w-4" />;
    }
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
            <div 
              ref={progressBarRef}
              className="flex-1 h-1 bg-[var(--accent)] rounded-full overflow-hidden group relative cursor-pointer"
              onClick={handleProgressBarClick}
            >
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleProgressChange}
                className="w-full h-full opacity-0 cursor-pointer absolute z-10"
                style={{ touchAction: 'none' }}
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
            <button 
              onClick={toggleMute}
              className="flex items-center justify-center text-[var(--secondary)] hover:text-white"
            >
              <VolumeIcon />
            </button>
            <div 
              ref={volumeBarRef}
              className="w-24 h-1 bg-[var(--accent)] rounded-full overflow-hidden group relative cursor-pointer"
              onClick={handleVolumeBarClick}
            >
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-full opacity-0 cursor-pointer absolute z-10"
                style={{ touchAction: 'none' }}
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
