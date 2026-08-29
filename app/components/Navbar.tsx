"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-12 sm:py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-display text-base font-semibold text-charcoal sm:gap-3 sm:text-xl"
        >
          <img
            src="/logo.png"
            alt="Farm2Pot And Grill logo"
            className="h-9 w-9 rounded-full object-cover sm:h-11 sm:w-11"
          />
          <span className="hidden xs:inline">Farm2Pot</span>
          <span className="text-terracotta">&amp; Grill</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-8 font-body text-sm font-medium text-charcoal/70 sm:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-terracotta">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/checkout"
            onClick={() => setOpen(false)}
            className="rounded-full bg-terracotta px-3 py-1.5 font-body text-xs font-semibold text-cream transition hover:bg-ember sm:px-5 sm:py-2 sm:text-sm"
          >
            Order Now
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
          >
            <span
              className={`h-0.5 w-6 bg-charcoal transition-transform ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-charcoal transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-charcoal transition-transform ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="flex flex-col border-t border-charcoal/10 bg-cream px-4 py-2 font-body text-sm font-medium text-charcoal/80 sm:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-charcoal/5 py-3 last:border-none hover:text-terracotta"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
