/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          dark: "#4338ca",
          light: "#6366f1",
        },
        secondary: {
          DEFAULT: "#0f172a",
          light: "#334155",
        },
        accent: {
          DEFAULT: "#06b6d4",
        },
        background: {
          light: "#f8fafc",
          dark: "#020617",
        },
        danger: "#ef4444",
        success: "#22c55e",
      },
      animation: {
        'float': 'float 10s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(-10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};