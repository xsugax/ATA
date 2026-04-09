import "./globals.css";

export const metadata = {
  title: "AURELUX Sovereign",
  description: "Global celebrity management and private booking ecosystem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-screen max-w-[1600px] px-6 py-6 md:px-10">{children}</div>
      </body>
    </html>
  );
}
