/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0F1419",
        sovereign: "#708FA8",
        platinum: "#E8EDF5",
      },
      boxShadow: {
        aura: "0 0 45px rgba(112, 143, 168, 0.18)",
      },
      backgroundImage: {
        "lux-gradient": "radial-gradient(circle at top left, rgba(112,143,168,0.12), transparent 45%), radial-gradient(circle at bottom right, rgba(232,237,245,0.06), transparent 35%)",
      },
    },
  },
  plugins: [],
};
