export const metadata = {
  title: "GOD MODE — AURELUX Command",
  description: "Restricted admin operations center",
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#070A14", color: "#E6ECF4", fontFamily: "inherit" }}>
      {children}
    </div>
  );
}
