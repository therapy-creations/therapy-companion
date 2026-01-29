/** @type {import('tailwindcss').Config} */
module.exports = {
  // Remove dark mode configuration by omitting the 'darkMode' property
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure tailwind applies to your project files
  ],
  theme: {
    extend: {
      // Define consistent light colors
      colors: {
        border: "#e5e7eb",
        input: "#f3f4f6",
        ring: "#e0e7ff",
        background: "#ffffff",
        foreground: "#111827",
        primary: {
          DEFAULT: "#adb8ed",
          foreground: "#ffffff", // White text on primary color
        },
        secondary: {
          DEFAULT: "#6b7280", // Neutral secondary
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },
        accent: {
          DEFAULT: "#84d19f", // Accent green
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#f06565", // Red for error states
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff", // Card background (white)
          foreground: "#111827",
        },
      },
      // Set border radius sizes (optional)
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      // Optional animations
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
  plugins: [
    require("tailwindcss-animate"), // Optional: Helpful animations if needed
  ],
};
