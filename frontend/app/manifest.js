export default function manifest() {
  return {
    name: "All Talents Agency",
    short_name: "ATA",
    description:
      "The world's most exclusive celebrity booking and talent management platform. 166+ verified A-list profiles. Book private events, corporate summits, and luxury brand experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F1419",
    theme_color: "#708FA8",
    categories: ["entertainment", "business", "lifestyle"],
    lang: "en",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
