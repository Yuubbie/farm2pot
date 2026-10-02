import Link from "next/link";

const DEVELOPER_WHATSAPP = "2347032352158";
const WHATSAPP_NUMBER = "2348162470726";
const WHATSAPP_NUMBER_2 = "2348176554823";
const COMPLAINTS_WHATSAPP = "2348186304735";

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
];

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com/Farm_2pot",
    icon: (
      <path d="M16 3c-3.53 0-3.97.015-5.356.078-1.382.064-2.325.283-3.15.605a6.36 6.36 0 0 0-2.298 1.497 6.36 6.36 0 0 0-1.497 2.299c-.322.824-.541 1.767-.605 3.148C3.015 12.013 3 12.453 3 16s.015 3.987.078 5.373c.064 1.381.283 2.324.605 3.148a6.36 6.36 0 0 0 1.497 2.299 6.36 6.36 0 0 0 2.299 1.497c.824.322 1.767.541 3.148.605C11.987 28.985 12.453 29 16 29s3.987-.015 5.373-.078c1.381-.064 2.324-.283 3.148-.605a6.36 6.36 0 0 0 2.299-1.497 6.36 6.36 0 0 0 1.497-2.299c.322-.824.541-1.767.605-3.148C28.985 19.987 29 19.547 29 16s-.015-3.987-.078-5.373c-.064-1.381-.283-2.324-.605-3.148a6.36 6.36 0 0 0-1.497-2.299 6.36 6.36 0 0 0-2.299-1.497c-.824-.322-1.767-.541-3.148-.605C19.987 3.015 19.547 3 16 3Zm0 2.162c3.487 0 3.899.013 5.276.076 1.273.058 1.965.27 2.425.449.61.237 1.045.52 1.503.977.457.458.74.893.977 1.503.179.46.391 1.152.449 2.425.063 1.377.076 1.789.076 5.276s-.013 3.899-.076 5.276c-.058 1.273-.27 1.965-.449 2.425a4.16 4.16 0 0 1-.977 1.503 4.16 4.16 0 0 1-1.503.977c-.46.179-1.152.391-2.425.449-1.377.063-1.789.076-5.276.076s-3.899-.013-5.276-.076c-1.273-.058-1.965-.27-2.425-.449a4.16 4.16 0 0 1-1.503-.977 4.16 4.16 0 0 1-.977-1.503c-.179-.46-.391-1.152-.449-2.425-.063-1.377-.076-1.789-.076-5.276s.013-3.899.076-5.276c.058-1.273.27-1.965.449-2.425.237-.61.52-1.045.977-1.503a4.16 4.16 0 0 1 1.503-.977c.46-.179 1.152-.391 2.425-.449 1.377-.063 1.789-.076 5.276-.076ZM16 9.865A6.135 6.135 0 1 0 16 22.135 6.135 6.135 0 0 0 16 9.865Zm0 10.108a3.973 3.973 0 1 1 0-7.946 3.973 3.973 0 0 1 0 7.946Zm7.808-10.353a1.434 1.434 0 1 1-2.868 0 1.434 1.434 0 0 1 2.868 0Z" />
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@Farm2pot",
    icon: (
      <path d="M22.5 3h-4.2v18.2c0 1.9-1.5 3.4-3.4 3.4a3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4c.4 0 .7.05 1 .15v-4.3a7.6 7.6 0 0 0-1-.07 7.6 7.6 0 0 0-7.6 7.6 7.6 7.6 0 0 0 7.6 7.6 7.6 7.6 0 0 0 7.6-7.6v-9.3a10.1 10.1 0 0 0 5.9 1.9v-4.2a5.9 5.9 0 0 1-5.9-5.9Z" />
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/Farm2pot",
    icon: (
      <path d="M18.5 29V17.5h3.9l.6-4.5h-4.5v-2.9c0-1.3.36-2.2 2.23-2.2H23V4.4c-.34-.05-1.5-.15-2.86-.15-2.83 0-4.77 1.73-4.77 4.9v2.74H12v4.5h3.37V29h3.13Z" />
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal px-5 pb-6 pt-14 sm:px-12 sm:pt-20 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
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

          {/* Menu links */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-body text-sm text-cream/60 transition hover:text-cream"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-cream/60 transition hover:text-cream"
                >
                  WhatsApp: 0816 247 0726
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER_2}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-cream/60 transition hover:text-cream"
                >
                  WhatsApp: 0817 655 4823
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${COMPLAINTS_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-cream/60 transition hover:text-cream"
                >
                  Complaints: 0818 630 4735
                </a>
              </li>
              <li>
                <a
                  href="mailto:farmtopotfood@gmail.com"
                  className="font-body text-sm text-cream/60 transition hover:text-cream"
                >
                  farmtopotfood@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Address bar */}
        <div className="mt-10 rounded-2xl bg-cream/5 border border-cream/10 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-terracotta/10">
                <svg className="h-5 w-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-cream">Visit Us</p>
                <p className="mt-0.5 font-body text-sm text-cream/60">
                  Kit Court Street, Harris Drive, Ajah, Lagos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-cream/60">
                <svg className="h-4 w-4 text-terracotta/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Open 24/7</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kit+Court+Street+Harris+Drive+Ajah+Lagos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream transition-all hover:bg-ember"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-body text-sm text-cream/50 transition hover:text-cream"
            >
              <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current">
                {s.icon}
              </svg>
              {s.label}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 sm:flex-row">
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