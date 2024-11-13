import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#8F2802",
          foreground: "#FFECE5",
        },
        secondary: {
          DEFAULT: "#000",
          foreground: "#fff",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
