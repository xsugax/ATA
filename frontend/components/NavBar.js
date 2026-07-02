"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/explorer",  label: "Explorer" },
  { href: "/crowd",     label: "Crowd Access" },
  { href: "/portal",    label: "Portal" },
  { href: "/login",     label: "Access" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="glass mb-5 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:px-5 sm:py-4">
      <Link href="/" className="shrink-0 flex flex-col justify-center min-w-0">
        <p className="text-sm font-semibold tracking-[0.15em] text-sovereign leading-snug whitespace-nowrap sm:text-base">ALL TALENTS</p>
        <p className="text-[9px] tracking-[0.3em] text-platinum/35 uppercase sm:text-[10px]">Agency</p>
      </Link>
      <nav className="flex items-center gap-0.5 sm:gap-1 flex-wrap justify-end">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-lg px-2.5 py-1.5 text-[10px] uppercase tracking-widest transition whitespace-nowrap sm:px-3 sm:py-2 sm:text-xs",
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
