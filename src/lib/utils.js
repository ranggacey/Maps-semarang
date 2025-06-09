import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats milliseconds into a time string (mm:ss)
 */
export function formatDuration(ms) {
  if (!ms || isNaN(ms)) return "0:00";
  
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a number with commas for thousands
 */
export function formatNumber(num) {
  if (!num || isNaN(num)) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Debounces a function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Generates a random string
 */
export function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}

/**
 * Extracts the color from an image
 */
export async function getColorFromImage(imageUrl) {
  // This is a placeholder - in a real app, you would use a library like Vibrant.js
  // to extract colors from an image
  return {
    vibrant: "#8a7cff",
    darkVibrant: "#4f46e5",
    lightVibrant: "#c4b5fd",
    muted: "#6b7280",
    darkMuted: "#374151",
    lightMuted: "#9ca3af"
  };
}

/**
 * Formats a date string
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Creates a URL with query parameters
 */
export function createUrlWithParams(baseUrl, params) {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
}

/**
 * Shuffles an array
 */
export function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Gets the greeting based on time of day
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

/**
 * Gets a random item from an array
 */
export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a random color for category backgrounds
 */
export function getRandomColor() {
  const colors = [
    '#8c67ab', '#ba5d07', '#e61e32', '#dc148c', 
    '#608108', '#d84000', '#8d67ab', '#477d95', 
    '#1e3264', '#503750', '#777777', '#af2896'
  ];
  return getRandomItem(colors);
}

/**
 * Get callback URLs for Spotify OAuth
 */
export function getCallbackUrls() {
  // For development
  if (process.env.NODE_ENV === 'development') {
    return ['http://localhost:3000/api/auth/callback/spotify', 'http://localhost:3001/api/auth/callback/spotify', 'http://localhost:3002/api/auth/callback/spotify', 'http://localhost:3003/api/auth/callback/spotify'];
  }
  
  // For production
  return ['https://maps-semarang.vercel.app/api/auth/callback/spotify'];
} 