"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [authError, setAuthError] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Check if we're in development mode
    setIsDevelopment(process.env.NODE_ENV === "development");
    
    // Check for error in URL (after redirect back from failed auth)
    const url = new URL(window.location.href);
    const error = url.searchParams.get("error");
    if (error) {
      setAuthError(true);
    }

    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSpotifySignIn = () => {
    signIn("spotify", { callbackUrl: "/dashboard" })
      .catch(err => {
        console.error("Authentication error:", err);
        setAuthError(true);
      });
  };

  const handleDemoSignIn = () => {
    signIn("credentials", { 
      username: "demo", 
      password: "demo123",
      callbackUrl: "/dashboard" 
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="h-16 w-16 text-[var(--primary)]" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.85 14.35c-.2 0-.35-.1-.5-.2-1.35-.85-3.05-1.3-4.85-1.3-1.8 0-3.5.45-4.85 1.3-.15.1-.3.2-.5.2-.4 0-.75-.35-.75-.75 0-.35.2-.65.45-.75 1.65-1 3.6-1.5 5.65-1.5 2.05 0 4 .5 5.65 1.5.25.1.45.45.45.75 0 .4-.35.75-.75.75zm1.3-3.15c-.25 0-.45-.1-.6-.25-1.7-1.05-4.05-1.7-6.55-1.7s-4.85.65-6.55 1.7c-.15.15-.35.25-.6.25-.45 0-.85-.4-.85-.85 0-.35.2-.65.45-.8 2-1.25 4.75-2 7.55-2s5.55.75 7.55 2c.25.15.45.45.45.8 0 .45-.4.85-.85.85zm1.45-3.4c-.25 0-.45-.1-.65-.25-2.05-1.25-5.05-2-8.3-2-3.25 0-6.25.75-8.3 2-.2.15-.4.25-.65.25-.55 0-1-.45-1-1 0-.35.2-.7.45-.85 2.4-1.45 5.7-2.25 9.5-2.25 3.8 0 7.1.8 9.5 2.25.25.15.45.5.45.85 0 .55-.45 1-1 1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Spotitiy</h1>
          <p className="text-[var(--secondary)] text-center">
            Listen to millions of songs and podcasts on your device.
          </p>
        </motion.div>

        {authError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/30 border border-red-500 text-white p-4 rounded-md mb-4"
          >
            <p className="text-sm">
              Authentication failed. Spotify OAuth requires a registered application with proper redirect URIs.
              In development mode, localhost authentication may not work correctly.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <Button
            onClick={handleSpotifySignIn}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-black font-bold py-3"
          >
            Continue with Spotify
          </Button>
          
          {isDevelopment && (
            <Button
              onClick={handleDemoSignIn}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
            >
              Use Demo Account (Dev Mode)
            </Button>
          )}
          
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute border-t border-[var(--accent)] w-full"></div>
            <span className="relative bg-black px-4 text-sm text-[var(--secondary)]">or</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[var(--secondary)]" htmlFor="email">
                Email or username
              </label>
              <input
                type="text"
                id="email"
                className="w-full p-3 rounded-md bg-[var(--card)] border border-[var(--accent)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Email or username"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[var(--secondary)]" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 rounded-md bg-[var(--card)] border border-[var(--accent)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Password"
              />
            </div>
            
            <Button
              onClick={handleSpotifySignIn}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3"
            >
              Log In
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <a href="#" className="text-[var(--secondary)] hover:text-white underline text-sm">
              Forgot your password?
            </a>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 text-center text-xs text-[var(--secondary)]"
      >
        <p>This is a demo application. Not affiliated with Spotify.</p>
        <p className="mt-2">© {new Date().getFullYear()} Spotitiy Clone</p>
      </motion.div>
    </div>
  );
}
