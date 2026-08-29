import Link from "next/link";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-12 lg:px-20">
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-xl font-semibold text-charcoal"
        >
          <img
            src="/logo.png"
            alt="Farm2Pot And Grill logo"
            className="h-11 w-11 rounded-full object-cover"
          />
          Farm2Pot <span className="text-terracotta">&amp; Grill</span>
        </Link>

        <nav className="hidden gap-8 font-body text-sm font-medium text-charcoal/70 sm:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-terracotta">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/checkout"
          className="rounded-full bg-terracotta px-5 py-2 font-body text-sm font-semibold text-cream transition hover:bg-ember"
        >
          Order Now
        </Link>
      </div>
    </header>
  );
}
