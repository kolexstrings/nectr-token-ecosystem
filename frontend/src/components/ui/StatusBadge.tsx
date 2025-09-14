"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status:
    | "success"
    | "error"
    | "warning"
    | "info"
    | "pending"
    | "connected"
    | "disconnected";
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

export function StatusBadge({
  status,
  children,
  className,
  animated = false,
}: StatusBadgeProps) {
  const baseClasses =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-cyber font-medium transition-all duration-300";

  const statusClasses = {
    success: "bg-cyber-500/20 text-cyber-400 border border-cyber-500/30",
    error: "bg-red-500/20 text-red-400 border border-red-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    info: "bg-electric-500/20 text-electric-400 border border-electric-500/30",
    pending: "bg-neon-500/20 text-neon-400 border border-neon-500/30",
    connected: "bg-cyber-500/20 text-cyber-400 border border-cyber-500/30",
    disconnected: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  };

  const animatedClasses = animated ? "animate-pulse" : "";

  return (
    <span
      className={cn(
        baseClasses,
        statusClasses[status],
        animatedClasses,
        className
      )}
    >
      {children}
    </span>
  );
}

export function ConnectionStatus({
  isConnected,
  address,
}: {
  isConnected: boolean;
  address?: string | null;
}) {
  return (
    <div className="flex items-center space-x-2">
      <StatusBadge
        status={isConnected ? "connected" : "disconnected"}
        animated={isConnected}
      >
        <div
          className={cn(
            "w-2 h-2 rounded-full mr-2",
            isConnected ? "bg-cyber-400 animate-pulse" : "bg-gray-400"
          )}
        />
        {isConnected ? "Connected" : "Disconnected"}
      </StatusBadge>
      {isConnected && address && (
        <span className="text-xs text-cyber-300 font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      )}
    </div>
  );
}
