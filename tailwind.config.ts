import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        'xs': '480px',
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
        afghan: {
          purple: {
            light: "#9b87f5",
            DEFAULT: "#7E69AB",
            dark: "#1A1F2C",
          },
          background: {
            dark: "#0D0A1D", 
            DEFAULT: "#140F2D", 
            light: "#2A1F53"
          }
        },
        category: {
          blue: "bg-gradient-to-br from-blue-500/90 to-blue-600/90",
          purple: "bg-gradient-to-br from-purple-500/90 to-purple-600/90",
          green: "bg-gradient-to-br from-emerald-500/90 to-emerald-600/90",
          orange: "bg-gradient-to-br from-orange-500/90 to-orange-600/90",
          cyan: "bg-gradient-to-br from-cyan-400/90 to-cyan-500/90",
          red: "bg-gradient-to-br from-red-500/90 to-red-600/90",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px 0 rgba(123, 97, 255, 0.2)" },
          "50%": { boxShadow: "0 0 20px 0 rgba(123, 97, 255, 0.4)" },
        },
        "soft-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s infinite",
        "soft-bounce": "soft-bounce 3s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 3s infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'afghan-gradient': 'linear-gradient(135deg, #140F2D 0%, #2A1F53 100%)',
        'category-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
