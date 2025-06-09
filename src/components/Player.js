"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Heart, Repeat, Shuffle,
  Maximize2, ListMusic, Laptop2
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

export function Player({ currentTrack, isPlaying, setIsPlaying, onNext, onPrevious }) {
  const { data: session } = useSession();
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Set initial volume
    audio.volume = volume;
    
    // Event listeners
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        onNext();
      }
    };
    
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isRepeat, onNext]);
  
  // Handle track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack?.preview_url) return;
    
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
    }
  }, [currentTrack, setIsPlaying]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Playback failed:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setIsPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // If no track is selected
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--player-bg)] backdrop-blur-lg border-t border-[var(--accent)] p-4 z-50">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="w-1/3"></div>
          <div className="w-1/3 flex flex-col items-center">
            <div className="flex items-center gap-x-4">
              <button className="text-[var(--secondary)] hover:text-white transition">
                <Shuffle size={20} />
              </button>
              <button className="text-[var(--secondary)] hover:text-white transition">
                <SkipBack size={20} />
              </button>
              <button className="bg-white text-black rounded-full p-2 hover:scale-105 transition">
                <Play size={20} fill="currentColor" />
              </button>
              <button className="text-[var(--secondary)] hover:text-white transition">
                <SkipForward size={20} />
              </button>
              <button className="text-[var(--secondary)] hover:text-white transition">
                <Repeat size={20} />
              </button>
            </div>
            <div className="w-full mt-2 flex items-center gap-x-2">
              <span className="text-xs text-[var(--secondary)]">0:00</span>
              <div className="progress-bar flex-grow">
                <div className="progress-bar-fill" style={{ width: "0%" }}></div>
              </div>
              <span className="text-xs text-[var(--secondary)]">0:00</span>
            </div>
          </div>
          <div className="w-1/3 flex justify-end items-center gap-x-3">
            <button className="text-[var(--secondary)] hover:text-white transition">
              <ListMusic size={20} />
            </button>
            <button className="text-[var(--secondary)] hover:text-white transition">
              <Laptop2 size={20} />
            </button>
            <div className="relative flex items-center gap-x-2"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button 
                className="text-[var(--secondary)] hover:text-white transition"
                onClick={toggleMute}
              >
                <Volume2 size={20} />
              </button>
              {showVolumeSlider && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[var(--card)] p-2 rounded-lg shadow-lg w-32">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-[var(--primary)]"
                  />
                </div>
              )}
            </div>
            <button className="text-[var(--secondary)] hover:text-white transition">
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--player-bg)] backdrop-blur-lg border-t border-[var(--accent)] p-4 z-50">
      <audio 
        ref={audioRef} 
        src={currentTrack.preview_url} 
        preload="auto"
      />
      
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Track Info */}
        <div className="w-1/3 flex items-center gap-x-4">
          {currentTrack.album?.images?.[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={currentTrack.album.images[0].url} 
              alt={currentTrack.name}
              className="h-14 w-14 object-cover shadow-md"
            />
          ) : (
            <div className="h-14 w-14 bg-[var(--card)] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-[var(--secondary)]" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{currentTrack.name}</h3>
            <p className="text-xs text-[var(--secondary)] truncate">
              {currentTrack.artists?.map((artist, idx) => (
                <span key={artist.id || idx}>
                  {artist.name}
                  {idx < currentTrack.artists.length - 1 && ", "}
                </span>
              ))}
            </p>
          </div>
          
          <button 
            className={`text-[var(--secondary)] hover:text-white transition ${isLiked ? 'text-[var(--primary)]' : ''}`}
            onClick={toggleLike}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>
        
        {/* Player Controls */}
        <div className="w-1/3 flex flex-col items-center">
          <div className="flex items-center gap-x-4">
            <button 
              className={`text-[var(--secondary)] hover:text-white transition ${isShuffle ? 'text-[var(--primary)]' : ''}`}
              onClick={() => setIsShuffle(!isShuffle)}
            >
              <Shuffle size={20} />
            </button>
            <button 
              className="text-[var(--secondary)] hover:text-white transition"
              onClick={onPrevious}
            >
              <SkipBack size={20} />
            </button>
            <button 
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </button>
            <button 
              className="text-[var(--secondary)] hover:text-white transition"
              onClick={onNext}
            >
              <SkipForward size={20} />
            </button>
            <button 
              className={`text-[var(--secondary)] hover:text-white transition ${isRepeat ? 'text-[var(--primary)]' : ''}`}
              onClick={() => setIsRepeat(!isRepeat)}
            >
              <Repeat size={20} />
            </button>
          </div>
          
          <div className="w-full mt-2 flex items-center gap-x-2">
            <span className="text-xs text-[var(--secondary)]">
              {formatDuration(currentTime * 1000)}
            </span>
            <div 
              className="progress-bar flex-grow"
              ref={progressBarRef}
              onClick={handleProgressClick}
            >
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-[var(--secondary)]">
              {formatDuration(duration * 1000)}
            </span>
          </div>
        </div>
        
        {/* Volume Controls */}
        <div className="w-1/3 flex justify-end items-center gap-x-3">
          <button className="text-[var(--secondary)] hover:text-white transition">
            <ListMusic size={20} />
          </button>
          <button className="text-[var(--secondary)] hover:text-white transition">
            <Laptop2 size={20} />
          </button>
          <div 
            className="relative flex items-center gap-x-2"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button 
              className="text-[var(--secondary)] hover:text-white transition"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            {showVolumeSlider && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[var(--card)] p-2 rounded-lg shadow-lg w-32">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-[var(--primary)]"
                />
              </div>
            )}
          </div>
          <button className="text-[var(--secondary)] hover:text-white transition">
            <Maximize2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
} 