import "./globals.css";

export const metadata = {
  title: "AURELUX Sovereign",
  description: "Global celebrity management and private booking ecosystem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "16px" }}
             className="md:px-10 md:py-6 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
