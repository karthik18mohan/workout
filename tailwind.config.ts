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
        background: "var(--background)",
        foreground: "var(--foreground)",
        bg: "#0D0D0D",
        "bg-card": "#1A1A1A",
        "bg-hover": "#252525",
        "accent-red": "#EF4444",
        "accent-orange": "#F97316",
        "accent-green": "#22C55E",
        muted: "#6B7280",
        "border-custom": "#2A2A2A",
      },
    },
  },
  plugins: [],
};
export default config;
