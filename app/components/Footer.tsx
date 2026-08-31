import Link from "next/link";

const DEVELOPER_WHATSAPP = "2347032352158";
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

          {/* Follow column, with icons */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
              Follow
            </h3>
            <ul className="mt-4 space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-body text-sm text-cream/60 transition hover:text-cream"
                  >
                    <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current">
                      {s.icon}
                    </svg>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
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
