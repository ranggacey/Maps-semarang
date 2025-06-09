import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats milliseconds into a time string (MM:SS)
 */
export function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a date string
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Formats a number of followers
 */
export function formatFollowers(count) {
  if (!count) return '0';
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toLocaleString();
}

/**
 * Returns the time of day (morning, afternoon, evening)
 */
export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
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
 * Debounce function for search inputs
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