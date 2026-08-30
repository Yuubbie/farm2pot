import Link from "next/link";
import Reveal from "./Reveal";

const cards = [
  {
    href: "/menu",
    title: "See the Menu",
    text: "111 dishes and drinks — soups, grills, cocktails, milkshakes, and more.",
  },
  {
    href: "/about",
    title: "Meet the Brand",
    text: "The story behind Farm2Pot, and the person who started it all.",
  },
  {
    href: "/contact",
    title: "Find Us",
    text: "Location, WhatsApp, and where to follow along.",
  },
];

export default function Highlights() {
  return (
    <section className="bg-cream px-6 py-20 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal key={c.href} delay={i * 120}>
            <Link
              href={c.href}
              className="group block rounded-2xl border border-charcoal/10 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta hover:shadow-xl"
            >
              <h3 className="font-display text-2xl font-semibold text-charcoal transition-colors group-hover:text-terracotta">
                {c.title}
              </h3>
              <p className="mt-3 font-body text-charcoal/70">{c.text}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
