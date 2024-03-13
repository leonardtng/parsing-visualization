/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

const tailwindUtils = plugin(function ({ addUtilities }) {
  addUtilities({
    ".layout": {
      maxWidth: "1250px",
    },
    ".layout-padding": {
      paddingLeft: "8rem",
      paddingRight: "8rem",
    },
    ".layout-padding-tablet": {
      paddingLeft: "3rem",
      paddingRight: "3rem",
    },
    ".layout-padding-mobile": {
      paddingLeft: "1rem",
      paddingRight: "1rem",
    },
    ".no-scrollbar": {
      scrollbarWidth: "none" /* For Firefox */,
      msOverflowStyle: "none" /* For Internet Explorer and Edge */,
      "&::-webkit-scrollbar": {
        display: "none" /* For Chrome, Safari and Opera */,
      },
    },
  });
});

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
        primary: "#2C77F4",

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

      animation: {
        "ease-spin": "spin 1s ease",
      },
    },
  },
  plugins: [tailwindUtils],
};
