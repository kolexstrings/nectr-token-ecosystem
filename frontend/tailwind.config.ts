import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Web3 color palette
        cyber: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        neon: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },
        electric: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        cyber: ["Orbitron", "monospace"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        "cyber-pulse": "cyber-pulse 2s ease-in-out infinite",
        "neon-flicker": "neon-flicker 1.5s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #3b82f6, 0 0 10px #3b82f6" },
          "100%": { boxShadow: "0 0 20px #3b82f6, 0 0 30px #3b82f6" },
        },
        "cyber-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px #22c55e, 0 0 10px #22c55e",
            transform: "scale(1)",
          },
          "50%": {
            boxShadow: "0 0 20px #22c55e, 0 0 30px #22c55e",
            transform: "scale(1.05)",
          },
        },
        "neon-flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        cyber: "0 0 20px rgba(34, 197, 94, 0.3)",
        neon: "0 0 20px rgba(168, 85, 247, 0.3)",
        electric: "0 0 20px rgba(59, 130, 246, 0.3)",
      },
      borderRadius: {
        cyber: "12px",
        glass: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
