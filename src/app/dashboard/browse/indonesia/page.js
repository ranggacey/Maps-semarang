"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Play } from "lucide-react";

export default function IndonesiaPage() {
  const { data: session } = useSession();
  
  // Mock data for Indonesian content
  const featuredPlaylists = [
    {
      id: "1",
      title: "Hot Hits Indonesia",
      description: "Lagu hits terpanas di Indonesia saat ini. Cover: Mahalini",
      image: "https://i.scdn.co/image/ab67706f00000002009a9b43696c653bfad7c278",
      type: "playlist"
    },
    {
      id: "2",
      title: "Pop Indonesia",
      description: "Hits pop Indonesia terkini. Cover: Lyodra",
      image: "https://i.scdn.co/image/ab67706f00000002c0d5be6a5a0730efd6937d86",
      type: "playlist"
    },
    {
      id: "3",
      title: "Kopikustik",
      description: "Akustik Indonesia untuk menemani waktu ngopi kamu.",
      image: "https://i.scdn.co/image/ab67706f00000002d1ef213808d3531dba5cd098",
      type: "playlist"
    },
    {
      id: "4",
      title: "Indonesia Skena",
      description: "Musik indie terbaik dari Indonesia.",
      image: "https://i.scdn.co/image/ab67706f000000023f7f3ec0a6f1c111e1c44f9f",
      type: "playlist"
    }
  ];

  const topArtists = [
    {
      id: "1",
      name: "Tulus",
      image: "https://i.scdn.co/image/ab6761610000e5eb4a169c60b53e3a7fbb2a15f9",
      type: "artist"
    },
    {
      id: "2",
      name: "Tiara Andini",
      image: "https://i.scdn.co/image/ab6761610000e5eb7a487aeb39f1f4862da89cb0",
      type: "artist"
    },
    {
      id: "3",
      name: "Lyodra",
      image: "https://i.scdn.co/image/ab6761610000e5eb6e0261cc1d44a7388f0da2f4",
      type: "artist"
    },
    {
      id: "4",
      name: "Mahalini",
      image: "https://i.scdn.co/image/ab6761610000e5eb4f2d1c9c9f296f729da8f0aa",
      type: "artist"
    },
    {
      id: "5",
      name: "Rizky Febian",
      image: "https://i.scdn.co/image/ab6761610000e5eb8cba56962a2ed97929c16e7b",
      type: "artist"
    },
    {
      id: "6",
      name: "Raisa",
      image: "https://i.scdn.co/image/ab6761610000e5eb0c9d61f3264c472376a8fde7",
      type: "artist"
    }
  ];

  const newReleases = [
    {
      id: "1",
      title: "Monokrom",
      artist: "Tulus",
      image: "https://i.scdn.co/image/ab67616d0000b273c41f4e1133b0e6591a8f1d5a",
      type: "album"
    },
    {
      id: "2",
      title: "Pamer Bojo",
      artist: "Denny Caknan",
      image: "https://i.scdn.co/image/ab67616d0000b2738cb690f962592ec48c4401b0",
      type: "album"
    },
    {
      id: "3",
      title: "Takut",
      artist: "Idgitaf",
      image: "https://i.scdn.co/image/ab67616d0000b2735f2c77c5556c1e13e0c03bfb",
      type: "album"
    },
    {
      id: "4",
      title: "Melawan Restu",
      artist: "Mahalini",
      image: "https://i.scdn.co/image/ab67616d0000b273c7e5618d287c81f7e73d3d8c",
      type: "album"
    }
  ];

  const categories = [
    {
      id: "1",
      name: "Pop",
      image: "https://i.scdn.co/image/ab67706f00000002fe6d8d1019d5b302213e3730",
      color: "from-pink-500 to-purple-500"
    },
    {
      id: "2",
      name: "Dangdut",
      image: "https://i.scdn.co/image/ab67706f000000025f0ff9251e3cfe641160dc31",
      color: "from-orange-500 to-red-500"
    },
    {
      id: "3",
      name: "Rock",
      image: "https://i.scdn.co/image/ab67706f00000002fe6d8d1019d5b302213e3730",
      color: "from-red-600 to-red-900"
    },
    {
      id: "4",
      name: "Indie",
      image: "https://i.scdn.co/image/ab67706f000000025f0ff9251e3cfe641160dc31",
      color: "from-blue-500 to-purple-500"
    },
    {
      id: "5",
      name: "Hip-Hop",
      image: "https://i.scdn.co/image/ab67706f00000002fe6d8d1019d5b302213e3730",
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: "6",
      name: "Religi",
      image: "https://i.scdn.co/image/ab67706f000000025f0ff9251e3cfe641160dc31",
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Indonesia</h1>
        <p className="text-[var(--text-muted)]">Discover the best music from Indonesia</p>
      </div>
      
      {/* Featured Playlists */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Featured Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredPlaylists.map((playlist) => (
            <a 
              key={playlist.id}
              href={`/dashboard/${playlist.type}/${playlist.id}`}
              className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg overflow-hidden group"
            >
              <div className="relative">
                <img 
                  src={playlist.image} 
                  alt={playlist.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-[var(--primary)] rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
                    <Play className="h-6 w-6 text-black" fill="currentColor" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">{playlist.title}</h3>
                <p className="text-sm text-[var(--text-muted)] line-clamp-2">{playlist.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
      
      {/* Top Artists */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Top Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {topArtists.map((artist) => (
            <a 
              key={artist.id}
              href={`/dashboard/${artist.type}/${artist.id}`}
              className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer group"
            >
              <div className="relative mb-4">
                <img 
                  src={artist.image} 
                  alt={artist.name}
                  className="w-full aspect-square object-cover rounded-full shadow-md"
                />
                <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="h-5 w-5 text-black" fill="currentColor" />
                </div>
              </div>
              <h3 className="font-semibold truncate text-center">{artist.name}</h3>
              <p className="text-sm text-[var(--text-muted)] truncate text-center">Artist</p>
            </a>
          ))}
        </div>
      </section>
      
      {/* New Releases */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">New Releases</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {newReleases.map((release) => (
            <a 
              key={release.id}
              href={`/dashboard/${release.type}/${release.id}`}
              className="bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors rounded-lg p-4 cursor-pointer group"
            >
              <div className="relative mb-4">
                <img 
                  src={release.image} 
                  alt={release.title}
                  className="w-full aspect-square object-cover rounded-md shadow-md"
                />
                <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Play className="h-5 w-5 text-black" fill="currentColor" />
                </div>
              </div>
              <h3 className="font-semibold truncate">{release.title}</h3>
              <p className="text-sm text-[var(--text-muted)] truncate">{release.artist}</p>
            </a>
          ))}
        </div>
      </section>
      
      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <a 
              key={category.id}
              href={`/dashboard/genre/${category.id}`}
              className={`bg-gradient-to-br ${category.color} rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform`}
            >
              <h3 className="font-bold text-xl">{category.name}</h3>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
} 