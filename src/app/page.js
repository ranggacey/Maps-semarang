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
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh", 
      background: "#0f172a" 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "28rem", 
        padding: "2rem" 
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            marginBottom: "2rem" 
          }}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            marginBottom: "1rem" 
          }}>
            <svg viewBox="0 0 24 24" style={{ 
              height: "4rem", 
              width: "4rem", 
              color: "#8a7cff" 
            }} fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.85 14.35c-.2 0-.35-.1-.5-.2-1.35-.85-3.05-1.3-4.85-1.3-1.8 0-3.5.45-4.85 1.3-.15.1-.3.2-.5.2-.4 0-.75-.35-.75-.75 0-.35.2-.65.45-.75 1.65-1 3.6-1.5 5.65-1.5 2.05 0 4 .5 5.65 1.5.25.1.45.45.45.75 0 .4-.35.75-.75.75zm1.3-3.15c-.25 0-.45-.1-.6-.25-1.7-1.05-4.05-1.7-6.55-1.7s-4.85.65-6.55 1.7c-.15.15-.35.25-.6.25-.45 0-.85-.4-.85-.85 0-.35.2-.65.45-.8 2-1.25 4.75-2 7.55-2s5.55.75 7.55 2c.25.15.45.45.45.8 0 .45-.4.85-.85.85zm1.45-3.4c-.25 0-.45-.1-.65-.25-2.05-1.25-5.05-2-8.3-2-3.25 0-6.25.75-8.3 2-.2.15-.4.25-.65.25-.55 0-1-.45-1-1 0-.35.2-.7.45-.85 2.4-1.45 5.7-2.25 9.5-2.25 3.8 0 7.1.8 9.5 2.25.25.15.45.5.45.85 0 .55-.45 1-1 1z" />
            </svg>
          </div>
          <h1 style={{ 
            fontSize: "2.25rem", 
            fontWeight: "700", 
            color: "white", 
            marginBottom: "0.5rem" 
          }}>Spotitiy</h1>
          <p style={{ 
            color: "#94a3b8", 
            textAlign: "center" 
          }}>
            Listen to millions of songs and podcasts on your device.
          </p>
        </motion.div>

        {authError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              backgroundColor: "rgba(127, 29, 29, 0.3)", 
              borderColor: "#ef4444", 
              borderWidth: "1px", 
              color: "white", 
              padding: "1rem", 
              borderRadius: "0.375rem", 
              marginBottom: "1rem" 
            }}
          >
            <p style={{ fontSize: "0.875rem" }}>
              Authentication failed. Spotify OAuth requires a registered application with proper redirect URIs.
              In development mode, localhost authentication may not work correctly.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "1rem" 
          }}
        >
          <button
            onClick={handleSpotifySignIn}
            style={{ 
              backgroundColor: "#8a7cff", 
              color: "black", 
              fontWeight: "700", 
              padding: "0.75rem", 
              borderRadius: "0.375rem", 
              width: "100%", 
              border: "none", 
              cursor: "pointer" 
            }}
          >
            Continue with Spotify
          </button>
          
          {isDevelopment && (
            <button
              onClick={handleDemoSignIn}
              style={{ 
                backgroundColor: "#2563eb", 
                color: "white", 
                fontWeight: "700", 
                padding: "0.75rem", 
                borderRadius: "0.375rem", 
                width: "100%", 
                border: "none", 
                cursor: "pointer" 
              }}
            >
              Use Demo Account (Dev Mode)
            </button>
          )}
          
          <div style={{ 
            position: "relative", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "1rem 0" 
          }}>
            <div style={{ 
              position: "absolute", 
              borderTopWidth: "1px", 
              borderColor: "#334155", 
              width: "100%" 
            }}></div>
            <span style={{ 
              position: "relative", 
              backgroundColor: "#0f172a", 
              padding: "0 1rem", 
              fontSize: "0.875rem", 
              color: "#94a3b8" 
            }}>or</span>
          </div>
          
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "1rem" 
          }}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.5rem" 
            }}>
              <label style={{ 
                fontSize: "0.875rem", 
                color: "#94a3b8" 
              }} htmlFor="email">
                Email or username
              </label>
              <input
                type="text"
                id="email"
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  borderRadius: "0.375rem", 
                  backgroundColor: "#1e293b", 
                  borderColor: "#334155", 
                  borderWidth: "1px", 
                  color: "white", 
                  outline: "none" 
                }}
                placeholder="Email or username"
              />
            </div>
            
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.5rem" 
            }}>
              <label style={{ 
                fontSize: "0.875rem", 
                color: "#94a3b8" 
              }} htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  borderRadius: "0.375rem", 
                  backgroundColor: "#1e293b", 
                  borderColor: "#334155", 
                  borderWidth: "1px", 
                  color: "white", 
                  outline: "none" 
                }}
                placeholder="Password"
              />
            </div>
            
            <button
              onClick={handleSpotifySignIn}
              style={{ 
                width: "100%", 
                backgroundColor: "white", 
                color: "black", 
                fontWeight: "700", 
                padding: "0.75rem", 
                borderRadius: "0.375rem", 
                border: "none", 
                cursor: "pointer" 
              }}
            >
              Log In
            </button>
          </div>
          
          <div style={{ 
            marginTop: "1rem", 
            textAlign: "center" 
          }}>
            <a href="#" style={{ 
              color: "#94a3b8", 
              textDecoration: "underline", 
              fontSize: "0.875rem" 
            }}>
              Forgot your password?
            </a>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ 
          marginTop: "2rem", 
          textAlign: "center", 
          fontSize: "0.75rem", 
          color: "#94a3b8" 
        }}
      >
        <p>This is a demo application. Not affiliated with Spotify.</p>
        <p style={{ marginTop: "0.5rem" }}>© {new Date().getFullYear()} Spotitiy Clone</p>
      </motion.div>
    </div>
  );
}
