import "./globals.css";

export const metadata = {
  title: "AURELUX Sovereign",
  description: "Private celebrity booking, verification, and disclosure workspace platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-screen w-full max-w-[1440px] overflow-x-hidden px-4 py-4 sm:px-5 md:px-8 md:py-6">{children}</div>
      </body>
    </html>
  );
}
