"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ChevronLeft, ChevronRight, User, Search, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { twMerge } from "tailwind-merge";

export function Header({ children, className }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div
      className={twMerge(
        "h-fit bg-gradient-to-b from-[#121212]/80 via-[#121212]/60 to-transparent backdrop-blur-sm sticky top-0 z-10 transition-all",
        isScrolled && "bg-[#121212]/90",
        className
      )}
    >
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => router.back()}
                className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={() => router.forward()}
                className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            {session?.user ? (
              <div className="flex items-center gap-x-4 relative">
                <Button
                  onClick={() => router.push('/dashboard/search')}
                  className="bg-white p-2"
                  size="icon"
                >
                  <Search className="h-5 w-5 text-black" />
                </Button>
                <Button
                  onClick={() => {}}
                  className="bg-black p-2"
                  size="icon"
                >
                  <Bell className="h-5 w-5 text-white" />
                </Button>
                <div className="relative">
                  <Button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="bg-black flex items-center gap-x-2 px-2"
                  >
                    <div className="flex items-center justify-center rounded-full bg-[var(--accent)] h-7 w-7">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-medium">
                      {session.user.name || "User"}
                    </p>
                  </Button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-[var(--card)] rounded-md shadow-lg p-1 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            router.push('/dashboard/account');
                          }}
                          className="flex w-full items-center gap-x-2 px-3 py-2 text-sm text-white hover:bg-[var(--card-hover)] rounded-md"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-x-2 px-3 py-2 text-sm text-white hover:bg-[var(--card-hover)] rounded-md"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-x-4">
                <Button
                  onClick={() => router.push('/sign-up')}
                  className="bg-transparent text-[var(--secondary)] font-medium"
                >
                  Sign up
                </Button>
                <Button onClick={() => router.push('/')}>Log in</Button>
              </div>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
} 