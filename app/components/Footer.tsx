import Link from "next/link";

const DEVELOPER_WHATSAPP = "234XXXXXXXXXX"; // TODO: replace with Yubbie's real WhatsApp number
const WHATSAPP_NUMBER = "2347032352158";

const columns = [
  {
    heading: "Menu",
    links: [
      { label: "Home", href: "/" },
      { label: "Menu", href: "/menu" },
      { label: "About", href: "/about" },
      { label: "Order Now", href: "/checkout" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "Chat on WhatsApp", href: `https://wa.me/${WHATSAPP_NUMBER}`, external: true },
      // TODO: add email once confirmed
    ],
  },
  {
    heading: "Follow",
    links: [
      { label: "Instagram", href: "https://instagram.com/Farm_2pot", external: true },
      { label: "TikTok", href: "https://tiktok.com/@Farm2pot", external: true },
      { label: "Facebook", href: "https://facebook.com/Farm2pot", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal px-5 pb-6 pt-14 sm:px-12 sm:pt-20 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5 sm:gap-6">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-lg font-semibold text-cream"
            >
              <img
                src="/logo.png"
                alt="Farm2Pot And Grill logo"
                className="h-9 w-9 rounded-full object-cover"
              />
              Farm2Pot <span className="text-terracotta">&amp; Grill</span>
            </Link>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-cream/50">
              Nigerian meals, grills, fresh juices, cocktails and more.
              Fresh ingredients, real hospitality, every dish served with
              purpose.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) =>
                  l.external ? (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm text-cream/60 transition hover:text-cream"
                      >
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="font-body text-sm text-cream/60 transition hover:text-cream"
                      >
                        {l.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 sm:flex-row sm:mt-16">
          <p className="font-body text-xs text-cream/40">
            &copy; {new Date().getFullYear()} Farm2Pot And Grill. All rights
            reserved.
          </p>
          <a
            href={`https://wa.me/${DEVELOPER_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-cream/30 underline decoration-dotted hover:text-cream/60"
          >
            Crafted by Yubbie Pen &amp; Pixel
          </a>
        </div>
      </div>
    </footer>
  );
}
