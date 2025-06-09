"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Button = forwardRef(({
  className,
  children,
  disabled,
  type = "button",
  variant = "default",
  size = "default",
  onClick,
  ...props
}, ref) => {
  const variantStyles = {
    default: "bg-[var(--primary)] text-black hover:bg-[var(--primary-hover)]",
    outline: "border border-[var(--accent)] hover:bg-[var(--hover-light)] text-white",
    secondary: "bg-[var(--card)] hover:bg-[var(--card-hover)] text-white",
    ghost: "hover:bg-[var(--hover-light)] text-white",
    link: "text-[var(--primary)] hover:text-[var(--primary-hover)] underline-offset-4 hover:underline p-0",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  };

  const sizeStyles = {
    default: "h-10 px-4 py-2 rounded-lg",
    sm: "h-8 px-3 py-1 text-sm rounded-md",
    lg: "h-12 px-6 py-3 text-lg rounded-lg",
    icon: "h-10 w-10 rounded-full p-2",
  };

  return (
    <button
      type={type}
      className={cn(
        "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      ref={ref}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}); 