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
    <header className="glass mb-5 flex items-center justify-between rounded-2xl px-5 py-4">
      <Link href="/" className="shrink-0 flex flex-col justify-center">
        <p className="text-base font-semibold tracking-[0.15em] text-sovereign leading-snug">ALL TALENTS</p>
        <p className="text-[10px] tracking-[0.3em] text-platinum/35 uppercase">Agency</p>
      </Link>
      <nav className="flex items-center gap-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-lg px-4 py-2 text-xs uppercase tracking-widest transition whitespace-nowrap",
              pathname === item.href
                ? "bg-sovereign text-black font-semibold"
                : "text-platinum/50 hover:text-platinum"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
