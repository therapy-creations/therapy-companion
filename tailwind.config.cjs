/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#adb8ed", // Hardcoded periwinkle to ensure it beats build defaults
          foreground: "#ffffff",
        },
        // Re-adding your accent and destructive colors from your original config
        accent: {
          DEFAULT: "#84d19f",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#f06565",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#111827",
        },
      },
      borderRadius: {
        lg: "var(--radius)", // Changed to use your CSS variable for consistency
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  // Ensure tailwind-merge works correctly with your animations
  plugins: [require("tailwindcss-animate")],
};
