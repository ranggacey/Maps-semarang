"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Heart, Repeat, Shuffle,
  Maximize2, ListMusic, Laptop
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import styles from "./Player.module.css";

export function Player({ currentTrack: propTrack, onTrackChange }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(propTrack);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Mock data - in a real app this would come from Spotify's API
  const defaultTrack = {
    id: "blinding-lights",
    name: "Blinding Lights",
    artists: [{ id: "the-weeknd", name: "The Weeknd" }],
    album: {
      id: "after-hours",
      name: "After Hours",
      images: [{ url: "https://i.scdn.co/image/ab67616d00001e02ef12a4e3bcb7c777c4e00f0b" }]
    },
    duration_ms: 200000,
    preview_url: "https://p.scdn.co/mp3-preview/8bfdd577f59d982da2d99c8eb419a892a435210f"
  };

  useEffect(() => {
    // If a track is provided via props, use it
    if (propTrack) {
      setCurrentTrack(propTrack);
    } else {
      // Otherwise use the default track
      setCurrentTrack(defaultTrack);
    }
  }, [propTrack]);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Set initial volume
    audio.volume = volume;
    
    // Event listeners
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        // Go to next track if available
        if (onTrackChange) {
          onTrackChange('next');
        } else {
          setIsPlaying(false);
        }
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
  }, [isLooping, onTrackChange]);
  
  // Handle track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack?.preview_url) return;
    
    // Reset time
    setCurrentTime(0);
    
    // Load and play the new track
    audioRef.current.load();
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, isPlaying]);
  
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
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume > 0 ? prevVolume : 0.5);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };
  
  const handleVolumeChange = (e) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    
    // Clamp between 0 and 1
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    
    // Update mute state
    setIsMuted(newVolume === 0);
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
  
  const handlePrevious = () => {
    if (currentTime > 3) {
      // If more than 3 seconds into the song, restart it
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      // Otherwise go to previous track
      if (onTrackChange) {
        onTrackChange('previous');
      }
    }
  };
  
  const handleNext = () => {
    if (onTrackChange) {
      onTrackChange('next');
    }
  };

  // Toggle loop
  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className={styles.player}>
        <div className={styles.playerContent}>
          <div className={styles.trackInfo}></div>
          <div className={styles.controls}>
            <div className={styles.mainControls}>
              <button className={styles.controlButton}>
                <Shuffle className="h-4 w-4" />
              </button>
              <button className={styles.controlButton}>
                <SkipBack className="h-5 w-5" />
              </button>
              <button className={styles.playButton}>
                <Play className="h-5 w-5" />
              </button>
              <button className={styles.controlButton}>
                <SkipForward className="h-5 w-5" />
              </button>
              <button className={styles.controlButton}>
                <Repeat className="h-4 w-4" />
              </button>
            </div>
            <div className={styles.progressContainer}>
              <span className={styles.timeText}>0:00</span>
              <div className={styles.progressBar}>
                <div className={styles.progressBarFill} style={{ width: '0%' }}></div>
              </div>
              <span className={styles.timeText}>0:00</span>
            </div>
          </div>
          <div className={styles.volumeControls}>
            <button className={styles.volumeButton}>
              <Volume2 className="h-5 w-5" />
            </button>
            <div className={styles.volumeSlider}>
              <div className={styles.volumeSliderFill} style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.player}>
      <div className={styles.playerContent}>
        {/* Track info - Left side */}
        <div className={styles.trackInfo}>
          <div className={styles.albumArt}>
            {currentTrack.album?.images?.[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={currentTrack.album.images[0].url} 
                alt={currentTrack.name}
                className={styles.albumImage}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-[var(--card)]">
                <Laptop className="h-5 w-5 text-[var(--text-muted)]" />
              </div>
            )}
          </div>
          <div className={styles.trackDetails}>
            <h3 
              className={styles.trackTitle}
              onClick={() => currentTrack.id && router.push(`/dashboard/track/${currentTrack.id}`)}
            >
              {currentTrack.name}
            </h3>
            <p className={styles.trackArtist}>
              {currentTrack.artists?.map((artist, idx) => (
                <span key={artist.id || idx}>
                  <span 
                    className={styles.trackArtistName}
                    onClick={(e) => {
                      e.stopPropagation();
                      artist.id && router.push(`/dashboard/artist/${artist.id}`);
                    }}
                  >
                    {artist.name}
                  </span>
                  {idx < currentTrack.artists.length - 1 && ", "}
                </span>
              ))}
            </p>
          </div>
          <button 
            onClick={toggleLike}
            className={cn(
              styles.likeButton,
              isLiked && styles.liked
            )}
          >
            <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>
        
        {/* Playback controls - Center */}
        <div className={styles.controls}>
          <div className={styles.mainControls}>
            <button 
              onClick={toggleShuffle}
              className={cn(
                styles.controlButton,
                isShuffling && "text-[var(--primary)]"
              )}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button 
              onClick={handlePrevious}
              className={styles.controlButton}
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button 
              onClick={togglePlay}
              className={styles.playButton}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <button 
              onClick={handleNext}
              className={styles.controlButton}
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button 
              onClick={toggleLoop}
              className={cn(
                styles.controlButton,
                isLooping && "text-[var(--primary)]"
              )}
            >
              <Repeat className="h-4 w-4" />
            </button>
          </div>
          <div className={styles.progressContainer}>
            <span className={styles.timeText}>{formatDuration(currentTime * 1000)}</span>
            <div 
              ref={progressBarRef}
              className={styles.progressBar}
              onClick={handleProgressClick}
            >
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className={styles.timeText}>{formatDuration((duration || 0) * 1000)}</span>
          </div>
        </div>
        
        {/* Volume controls - Right side */}
        <div className={styles.volumeControls}>
          <button 
            onClick={toggleMute}
            className={styles.volumeButton}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <div 
            className={styles.volumeSlider}
            onClick={handleVolumeChange}
          >
            <div 
              className={styles.volumeSliderFill} 
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
          <button className={cn(styles.volumeButton, "hidden md:flex")}>
            <ListMusic className="h-5 w-5" />
          </button>
          <button className={cn(styles.volumeButton, "hidden md:flex")}>
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 