import "./globals.css";

export const metadata = {
  title: "AURELUX Sovereign",
  description: "Global celebrity management and private booking ecosystem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-screen max-w-[1600px] px-4 py-4 md:px-10 md:py-6">{children}</div>
      </body>
    </html>
  );
}
