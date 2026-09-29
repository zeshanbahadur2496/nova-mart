import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1c1917",
        store: {
          bg: "var(--store-bg)",
          surface: "var(--store-surface)",
          muted: "var(--store-text-muted)",
          border: "var(--store-border)",
          primary: "var(--store-primary)",
          accent: "var(--store-accent)",
          deal: "var(--store-deal)",
          success: "var(--store-success)"
        },
        amazon: {
          navy: "#1c1917",
          blue: "#292524",
          light: "#44403c",
          gold: "#b45309",
          orange: "#9a3412",
          teal: "#9a3412",
          green: "#047857",
          red: "#c2410c",
          page: "var(--amazon-page)"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "var(--store-glow)",
        soft: "var(--store-shadow)",
        card: "0 2px 12px rgba(28, 25, 23, 0.05)",
        cardHover: "0 10px 28px rgba(28, 25, 23, 0.1)",
        dropdown: "0 16px 40px rgba(28, 25, 23, 0.12)",
        sticky: "0 4px 20px rgba(28, 25, 23, 0.06)"
      },
      maxWidth: {
        amazon: "1500px"
      },
      animation: {
        "fade-in": "fadeIn 0.55s ease-out both",
        shimmer: "shimmer 1.35s linear infinite",
        float: "float 6s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
