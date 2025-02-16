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
      },
      animation: {
        blob: "blob 7s infinite",
        'equalizer-1': 'equalizer 1s ease-in-out infinite',
        'equalizer-2': 'equalizer 1.4s ease-in-out infinite',
        'equalizer-3': 'equalizer 0.8s ease-in-out infinite',
        'gradient': 'gradient 3s linear infinite',
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        equalizer: {
          '0%, 100%': {
            height: '4px',
          },
          '50%': {
            height: '16px',
          },
        },
        gradient: {
          '0%': {
            'background-position': '0% 50%',
          },
          '100%': {
            'background-position': '100% 50%',
          },
        },
      },
      perspective: {
        '1000': '1000px',
      },
      rotate: {
        'y-12': '12deg',
      },
    },
  },
  plugins: [],
};

export default config;
