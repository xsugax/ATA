"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/explorer", label: "Explorer" },
  { href: "/portal", label: "Portal" },
  { href: "/login", label: "Access" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 20px",
      marginBottom: "20px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      backdropFilter: "blur(20px)",
    }}>
      <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
        <div style={{
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "0.18em",
          color: "#94B4D8",
          lineHeight: 1.2,
        }}>ALL TALENTS</div>
        <div style={{
          fontSize: "9px",
          letterSpacing: "0.3em",
          color: "rgba(230,236,244,0.3)",
          textTransform: "uppercase",
          marginTop: "1px",
        }}>Agency</div>
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "7px 14px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                background: active ? "#94B4D8" : "transparent",
                color: active ? "#070A14" : "rgba(230,236,244,0.5)",
                fontWeight: active ? 600 : 400,
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

