import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#711E00",
          hover: "#5a1800",
          50: "#fdf3f0",
          100: "#f5ddd6",
        },
      },
    },
  },
};

export default config;
