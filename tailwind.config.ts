import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          100: "#1E1F68",
          200: "#000000",
          300: "#1A207133",
          400: "#FBB03B",
          500: "#0E0D3D",
          600: "#A0A3AC",
          700: "#1E263D",
          800: "#DEE0E8",
          900: "#FBB03B4A",
          1000: "#DEE0E81A",
          1100: "#1E263D",
          1200: "#F4F4F4",
          1300: "#0B0B3F",
          1400: "#1A1942",
          1500: "#38D4FD",
          1600: "#38D4FD26",
          1700: "#00C927",
          1800: "#FC0900",
          1900: "#FBB03B",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        dark: {
          background: "#191D31",
          text: "#FFFFFF",
          accent: {
            100: "#FFA726",
            200: "#1A207133",
          },
        },
        light: {
          background: "#FFFFFF",
          text: "#1E1F68",
          accent: {
            100: "#FFA726",
            200: "#1A207133",
          },
        },
      },
      borderRadius: {
        lg: "0.5rem", 
        md: "0.375rem", 
        sm: "0.25rem", 
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
