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
  ...props
}, ref) => {
  const variants = {
    default: "bg-[var(--primary)] text-black hover:bg-[var(--primary-hover)]",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-[var(--accent)] bg-transparent hover:bg-[var(--card)]",
    ghost: "bg-transparent hover:bg-[var(--card)]",
    link: "bg-transparent underline-offset-4 hover:underline"
  };

  const sizes = {
    default: "h-10 px-4 py-2 rounded-full",
    sm: "h-8 px-3 rounded-full text-sm",
    lg: "h-12 px-6 rounded-full text-lg",
    icon: "h-10 w-10 rounded-full p-2"
  };

  return (
    <button
      type={type}
      className={cn(
        "font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
}); 