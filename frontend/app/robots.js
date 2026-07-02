export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/portal/", "/api/"],
      },
    ],
    sitemap: "https://www.alltalentsagency.com/sitemap.xml",
    host: "https://www.alltalentsagency.com",
  };
}
