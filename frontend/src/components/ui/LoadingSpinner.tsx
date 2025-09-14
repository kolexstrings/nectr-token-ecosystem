"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  variant?: "cyber" | "neon" | "electric";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LoadingSpinner({
  variant = "cyber",
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const variantClasses = {
    cyber: "border-cyber-500 border-t-transparent",
    neon: "border-neon-500 border-t-transparent",
    electric: "border-electric-500 border-t-transparent",
  };

  return (
    <div
      className={cn(
        "inline-block rounded-full animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-cyber-500 rounded-full animate-bounce" />
      <div
        className="w-2 h-2 bg-cyber-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      />
      <div
        className="w-2 h-2 bg-cyber-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />
    </div>
  );
}

export function LoadingPulse({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-cyber-500 rounded-full animate-pulse" />
      <div
        className="w-2 h-2 bg-cyber-500 rounded-full animate-pulse"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="w-2 h-2 bg-cyber-500 rounded-full animate-pulse"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
}
