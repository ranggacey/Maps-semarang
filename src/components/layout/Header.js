"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <header className={cn(
        "sticky top-0 z-50 flex items-center justify-between px-6 py-3 transition-colors",
        scrolled && "bg-[var(--background-dark)]"
      )}>
        <div className="flex items-center gap-x-4">
          <button 
            onClick={() => router.back()}
            className="rounded-full bg-black p-1 flex items-center justify-center hover:opacity-75 transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={() => router.forward()}
            className="rounded-full bg-black p-1 flex items-center justify-center hover:opacity-75 transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        <div className="flex items-center gap-x-4">
          <button 
            className="rounded-full p-1 flex items-center justify-center hover:opacity-75 transition"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button 
            onClick={() => router.push("/dashboard/account")}
            className="rounded-full bg-black p-1 flex items-center justify-center hover:opacity-75 transition"
          >
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <User className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 