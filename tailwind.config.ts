import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Stripe-inspired neutrals (light)
        ink: {
          900: "#0A2540",
          800: "#1A1F36",
          700: "#2A2F45",
          600: "#425466",
          500: "#697386",
          400: "#8792A2",
          300: "#AAB7C4",
          200: "#E3E8EE",
          100: "#F6F9FC",
          50:  "#FAFBFD",
        },
        // Stripe-inspired dark slate
        slate: {
          950: "#0A0E27",
          900: "#0E1430",
          850: "#131A3A",
          800: "#1A2341",
          700: "#242D4E",
          600: "#3C4661",
          500: "#5D6780",
          400: "#8B94AD",
          300: "#B0B7CC",
        },
        brand: {
          50:  "#F1F0FF",
          100: "#E5E3FF",
          200: "#CBC7FF",
          300: "#A79FFF",
          400: "#8580FF",
          500: "#635BFF",  // Stripe indigo
          600: "#4F46E5",
          700: "#3F36C4",
          800: "#2E2A8F",
        },
        grub: { red: "#EB1700", redDark: "#B91200" },
        parafin: { primary: "#635BFF", accent: "#0A2540", soft: "#F1F0FF" },
        good: "#0F9D58",
        warn: "#F2A900",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(10,37,64,0.04), 0 1px 2px rgba(10,37,64,0.06)",
        cardHover: "0 4px 12px rgba(10,37,64,0.08)",
        pop: "0 12px 32px rgba(10,37,64,0.12)",
        glow: "0 0 0 4px rgba(99,91,255,0.12)",
      },
      borderRadius: { xl: "12px", "2xl": "16px", "3xl": "20px" },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        fadeIn: "fadeIn 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
