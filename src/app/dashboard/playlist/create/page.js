"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Music, Image, Save } from "lucide-react";

export default function CreatePlaylistPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // In a real app, we would call the Spotify API to create a playlist
      // For now, we'll just simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the playlists page
      router.push("/dashboard/collection/playlists");
    } catch (error) {
      console.error("Error creating playlist:", error);
      setError("Failed to create playlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Playlist</h1>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-md p-4 mb-6">
          <p className="text-white">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-6">
          <div className="w-48 h-48 bg-[var(--card)] rounded-md flex items-center justify-center">
            <Image className="h-12 w-12 text-[var(--text-muted)]" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-1" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Playlist"
                className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--accent)] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Give your playlist a catchy description"
                className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--accent)] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-24 resize-none"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="h-4 w-4 text-[var(--primary)] rounded border-[var(--accent)] focus:ring-[var(--primary)]"
          />
          <label className="ml-2 block text-sm" htmlFor="isPublic">
            Make this playlist public
          </label>
        </div>
        
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-full border border-[var(--accent)] hover:border-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors text-black font-semibold"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-black"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Create</span>
          </button>
        </div>
      </form>
    </div>
  );
} 