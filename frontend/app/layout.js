import "./globals.css";

export const metadata = {
  title: "All Talents Agency",
  description: "Global celebrity booking and talent management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-4 sm:px-6 md:px-8 lg:px-10 md:py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
