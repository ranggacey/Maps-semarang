"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Player } from "@/components/layout/Player";
import React from "react";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Function to play a track
  const playTrack = (track, tracks = []) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // If tracks array is provided, set it as the queue
    if (tracks.length > 0) {
      setQueue(tracks);
    }
  };

  // Handle track changes in the player
  const handleTrackChange = (direction) => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % queue.length;
    } else {
      nextIndex = (currentIndex - 1 + queue.length) % queue.length;
    }
    
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  // Provide context to all children components
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { playTrack });
    }
    return child;
  });

  return (
    <div className="h-full">
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-24 pt-2">
          <div className="bg-gradient-to-b from-[var(--primary-hover)] to-[var(--background)] opacity-10 absolute top-0 left-0 right-0 h-60 z-0"></div>
          <Header />
          <div className="px-6 relative z-10">
            {childrenWithProps}
          </div>
        </main>
      </div>
      <Player 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying}
        onNext={() => handleTrackChange('next')}
        onPrevious={() => handleTrackChange('previous')}
      />
    </div>
  );
} 