"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/explorer", label: "Explorer" },
  { href: "/portal", label: "Portal" },
  { href: "/login", label: "Access" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="glass mb-4 flex items-center justify-between rounded-xl px-4 py-3">
      <Link href="/" className="shrink-0">
        <p className="text-sm font-semibold tracking-[0.2em] text-sovereign leading-tight">AURELUX</p>
        <p className="text-[10px] tracking-widest text-platinum/40 uppercase leading-tight">Sovereign</p>
      </Link>
      <nav className="grid grid-cols-3 gap-1.5 ml-4">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-lg px-3 py-1.5 text-[11px] text-center uppercase tracking-wider transition whitespace-nowrap",
              pathname === item.href
                ? "bg-sovereign text-black font-semibold"
                : "bg-white/5 text-platinum/60 hover:bg-white/10"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
