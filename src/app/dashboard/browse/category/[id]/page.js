"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { getBrowseCategory, getCategoryPlaylists } from "@/lib/spotify/api";

export default function CategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const [category, setCategory] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken || !id) return;
      
      setLoading(true);
      try {
        const [categoryData, playlistsData] = await Promise.all([
          getBrowseCategory(session.user.accessToken, id),
          getCategoryPlaylists(session.user.accessToken, id, 50)
        ]);
        
        setCategory(categoryData);
        setPlaylists(playlistsData.playlists?.items || []);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-2">Category not found</h1>
        <p className="text-[var(--secondary)] mb-4">The category you're looking for doesn't exist or is not available.</p>
        <button 
          className="bg-[var(--primary)] text-black px-4 py-2 rounded-full font-medium"
          onClick={() => router.push('/dashboard/browse')}
        >
          Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-[var(--secondary)]">Playlists for {category.name}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <Card 
            key={playlist.id}
            data={playlist}
            type="playlist"
            onClick={() => router.push(`/dashboard/playlist/${playlist.id}`)}
          />
        ))}
        
        {playlists.length === 0 && (
          <div className="col-span-full flex items-center justify-center h-40">
            <p className="text-[var(--secondary)]">No playlists found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
} 