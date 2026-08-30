import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[560px] w-full items-end overflow-hidden sm:items-center">
      {/* Premium hero photo with slow zoom */}
      <img
        src="/hero.png"
        alt="Farm2Pot And Grill signature spread at sunset"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ animation: "heroZoom 18s ease-out forwards" }}
      />

      {/* Cinematic gradient for legible, moody text */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent sm:bg-gradient-to-r sm:from-charcoal/85 sm:via-charcoal/35 sm:to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-5 pb-10 sm:px-12 sm:py-0 lg:px-20">
        <span
          className="mb-3 block font-body text-xs uppercase tracking-[0.3em] text-ember sm:mb-4 sm:text-sm"
          style={{ animation: "heroFadeUp 0.8s ease-out 0.1s both" }}
        >
          Nigerian Kitchen &amp; Grill
        </span>
        <h1
          className="font-display text-5xl font-semibold uppercase leading-[0.95] text-cream xs:text-6xl sm:text-7xl lg:text-8xl"
          style={{ animation: "heroFadeUp 0.9s ease-out 0.25s both" }}
        >
          Taste
          <br />
          The <span className="text-terracotta">Best</span>
        </h1>
        <p
          className="mt-5 max-w-md font-body text-base text-cream/85 sm:mt-6 sm:text-lg"
          style={{ animation: "heroFadeUp 0.9s ease-out 0.45s both" }}
        >
          Fresh ingredients, real hospitality, and a menu that goes from
          Sunday soup pots to Friday-night cocktails.
        </p>
        <div
          className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4"
          style={{ animation: "heroFadeUp 0.9s ease-out 0.65s both" }}
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 font-body text-sm font-semibold text-cream transition duration-300 hover:scale-105 hover:bg-ember sm:px-8 sm:text-base"
          >
            View Menu
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-6 py-3 font-body text-sm font-semibold text-cream transition duration-300 hover:scale-105 hover:border-cream hover:bg-cream/10 sm:px-8 sm:text-base"
          >
            Order Now
          </Link>
        </div>
      </div>
    </section>
  );
}
