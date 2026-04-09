/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#070A14",
        sovereign: "#94B4D8",
        platinum: "#E6ECF4",
      },
      boxShadow: {
        aura: "0 0 45px rgba(148, 180, 216, 0.18)",
      },
      backgroundImage: {
        "lux-gradient": "radial-gradient(circle at top left, rgba(148,180,216,0.12), transparent 45%), radial-gradient(circle at bottom right, rgba(230,236,244,0.06), transparent 35%)",
      },
    },
  },
  plugins: [],
};
