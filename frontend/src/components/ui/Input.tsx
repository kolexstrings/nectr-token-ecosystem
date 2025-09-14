"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "cyber" | "neon" | "electric" | "glass";
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant = "cyber", label, error, helperText, ...props },
    ref
  ) => {
    const baseClasses =
      "w-full px-4 py-3 bg-dark-800/50 border rounded-cyber text-cyber-100 placeholder-cyber-400 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900";

    const variants = {
      cyber:
        "border-cyber-500/30 focus:border-cyber-400 focus:ring-cyber-400/20 focus:shadow-cyber",
      neon: "border-neon-500/30 focus:border-neon-400 focus:ring-neon-400/20 focus:shadow-neon",
      electric:
        "border-electric-500/30 focus:border-electric-400 focus:ring-electric-400/20 focus:shadow-electric",
      glass: "glass border-white/20 focus:border-white/40 focus:ring-white/20",
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-cyber font-medium text-cyber-300">
            {label}
          </label>
        )}
        <input
          className={cn(
            baseClasses,
            variants[variant],
            error &&
              "border-red-500 focus:border-red-400 focus:ring-red-400/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-red-400 font-cyber">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-cyber-400 font-cyber">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
