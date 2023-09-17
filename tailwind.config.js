/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['"Figtree"', "sans-serif"],
      },
      colors: {
        primary: "#37B875",

        // backgrounds
        background: "#121212",
        card: "#1e1e1e",
        surface: "#2c2c2c",

        // alerts
        success: "#45B26B",
        warning: "#E7BC06",
        error: "#F12120",

        // light mode
        fontPrimary: "#FFFFFF",
        fontSecondary: "#9B9B9B",
        fontInverse: "#000000",

        // Strokes
        strokePrimary: "#353945",
        strokeSecondary: "#CBCBCB",
      },
    },
  },
  plugins: [],
};
