"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Button = forwardRef(({
  className,
  children,
  disabled,
  type = "button",
  variant = "default",
  size = "md",
  onClick,
  ...props
}, ref) => {
  const variants = {
    default: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
    outline: "bg-transparent border border-[var(--secondary)] text-[var(--foreground)] hover:border-white",
    ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--card-hover)]",
    link: "bg-transparent text-[var(--primary)] hover:underline p-0",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg",
    icon: "p-2",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        "rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed",
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