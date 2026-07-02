import "./globals.css";

const SITE = "https://www.alltalentsagency.com";

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "All Talents Agency (ATA) — Global Celebrity Booking & Talent Management",
    template: "%s | All Talents Agency",
  },
  description:
    "All Talents Agency (ATA) is the world's premier celebrity booking and talent management platform. Book A-list celebrities, billionaires, athletes, and icons for private events, corporate summits, and exclusive brand experiences. 166+ verified global profiles.",
  keywords: [
    "All Talents Agency",
    "ATA",
    "ATA booking",
    "celebrity booking agency",
    "book a celebrity",
    "hire celebrity for event",
    "celebrity talent management",
    "private celebrity events",
    "luxury celebrity booking",
    "corporate celebrity appearance",
    "celebrity keynote speaker",
    "exclusive talent agency",
    "A-list talent booking",
    "celebrity appearance fee",
    "celebrity management agency",
    "celebrity entertainment agency",
    "book Beyonce",
    "book Elon Musk",
    "private event celebrity",
    "alltalentsagency.com",
  ],
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "All Talents Agency",
    title: "All Talents Agency (ATA) — Global Celebrity Booking",
    description:
      "The world's most exclusive celebrity booking platform. 166+ verified A-list profiles. Private events, corporate summits, luxury brand experiences.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@alltalentsagency",
    creator: "@alltalentsagency",
    title: "All Talents Agency (ATA) — Global Celebrity Booking",
    description:
      "The world's most exclusive celebrity booking platform. 166+ verified A-list profiles across entertainment, business, and culture.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE,
  },
  authors: [{ name: "All Talents Agency", url: SITE }],
  creator: "All Talents Agency",
  publisher: "All Talents Agency",
  category: "Entertainment, Talent Management, Celebrity Booking",
  applicationName: "All Talents Agency",
  referrer: "origin-when-cross-origin",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "All Talents Agency",
      alternateName: ["ATA", "All Talents Agency Inc.", "ATA Bookings"],
      url: SITE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/icon-512.png`,
        width: 512,
        height: 512,
      },
      description:
        "All Talents Agency (ATA) is a premier global celebrity booking and talent management platform connecting ultra-high-net-worth clients with 166+ verified A-list celebrities, billionaires, musicians, athletes, and industry icons.",
      foundingDate: "2020",
      areaServed: "Worldwide",
      serviceType: [
        "Celebrity Booking",
        "Talent Management",
        "Private Events",
        "Corporate Keynotes",
        "Brand Endorsements",
        "Exclusive Appearances",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Inquiries",
        url: `${SITE}/portal`,
        availableLanguage: ["English"],
      },
      sameAs: [
        "https://www.instagram.com/alltalentsagency",
        "https://twitter.com/alltalentsagency",
        "https://www.linkedin.com/company/alltalentsagency",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "All Talents Agency",
      alternateName: "ATA",
      description:
        "Global celebrity booking and talent management — 166+ verified profiles, private events, corporate summits, luxury brand experiences.",
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE}/explorer?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-4 sm:px-6 md:px-8 lg:px-10 md:py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
