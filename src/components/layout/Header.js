"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  ChevronLeft, ChevronRight, Bell, Github, User,
  LogOut, Settings, HelpCircle, UserCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Track scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        styles.header,
        scrolled && styles.headerScrolled
      )}
    >
      <div className={styles.navButtons}>
        <button 
          onClick={() => router.back()}
          className={styles.navButton}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={() => router.forward()}
          className={styles.navButton}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      <div className={styles.userMenu}>
        <Link 
          href="https://github.com/ranggacaw/spotify-clone" 
          target="_blank"
          className={styles.githubLink}
        >
          <Github className="h-4 w-4" />
          <span>Source Code</span>
        </Link>
        
        <button className={styles.notificationButton}>
          <Bell className="h-5 w-5" />
          <span className={styles.notificationIndicator}></span>
        </button>
        
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={styles.userButton}
          >
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={session.user.image} 
                alt={session.user.name || "User"} 
                className={styles.userImage}
              />
            ) : (
              <div className={styles.userAvatar}>
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
          
          {showUserMenu && (
            <div className={styles.userMenuDropdown}>
              {session?.user && (
                <div className={styles.userInfo}>
                  <p className={styles.userName}>
                    {session.user.name || "User"}
                  </p>
                  <p className={styles.userEmail}>
                    {session.user.email || "user@example.com"}
                  </p>
                </div>
              )}
              
              <div className={styles.menuItems}>
                <Link href="/dashboard/account" className={styles.menuItem}>
                  <UserCircle className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button className={styles.menuItem}>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button className={styles.menuItem}>
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </button>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={styles.menuItem}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 