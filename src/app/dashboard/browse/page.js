"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getBrowseCategories } from "@/lib/spotify/api";

export default function BrowsePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken) return;
      
      setLoading(true);
      try {
        const data = await getBrowseCategories(session.user.accessToken, 50);
        setCategories(data.categories?.items || []);
      } catch (error) {
        console.error("Error fetching browse categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Generate a random color for each category
  const getRandomColor = () => {
    const colors = [
      '#8c67ab', '#ba5d07', '#e61e32', '#dc148c', 
      '#608108', '#d84000', '#8d67ab', '#477d95', 
      '#1e3264', '#503750', '#777777', '#af2896'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <h1 className="text-3xl font-bold mb-6">Browse All</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="relative h-[200px] rounded-lg overflow-hidden cursor-pointer"
            style={{ backgroundColor: getRandomColor() }}
            onClick={() => router.push(`/dashboard/browse/category/${category.id}`)}
          >
            <div className="p-4">
              <h3 className="text-2xl font-bold">{category.name}</h3>
            </div>
            {category.icons?.[0]?.url && (
              <div className="absolute bottom-0 right-0 w-24 h-24 transform rotate-25 translate-x-4 translate-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={category.icons[0].url} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 