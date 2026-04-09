"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/explorer", label: "Intelligence Explorer" },
  { href: "/portal", label: "Client Portal" },
  { href: "/login", label: "Access" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="glass mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
      <div>
        <h1 className="text-xl font-semibold tracking-[0.2em] text-sovereign">AURELUX Sovereign</h1>
        <p className="text-xs text-platinum/70">Private Wealth Booking Institution</p>
      </div>
      <nav className="flex flex-wrap gap-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-xl px-3 py-2 text-xs uppercase tracking-wider transition",
              pathname === item.href ? "bg-sovereign text-black" : "bg-white/5 text-platinum/80 hover:bg-white/10"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
