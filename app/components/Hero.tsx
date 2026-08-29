import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[480px] w-full items-end overflow-hidden sm:h-[90vh] sm:min-h-[560px] sm:items-center">
      {/* Background photo */}
      <img
        src="/hero.png"
        alt="Farm2Pot And Grill signature spread at sunset — jollof rice, suya, and fresh juice"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient: bottom-up on mobile (text sits at the bottom), left-right on larger screens */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent sm:bg-gradient-to-r sm:from-charcoal/80 sm:via-charcoal/30 sm:to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-5 pb-8 pt-16 sm:px-12 sm:py-0 lg:px-20">
        <span className="mb-3 block font-body text-xs uppercase tracking-[0.2em] text-ember sm:mb-4 sm:text-sm">
          Nigerian Kitchen &amp; Grill
        </span>
        <h1 className="font-display text-4xl font-semibold leading-[1.05] text-cream xs:text-5xl sm:text-6xl lg:text-7xl">
          Farm2Pot
          <br />
          <span className="text-terracotta">&amp; Grill</span>
        </h1>
        <p className="mt-4 max-w-md font-body text-base text-cream/90 sm:mt-6 sm:text-lg">
          Fresh ingredients, real hospitality, and a menu that goes from
          Sunday soup pots to Friday-night cocktails — every dish prepared
          with love and served with purpose.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
          <Link
            href="/menu"
            className="rounded-full bg-terracotta px-6 py-2.5 font-body text-sm font-semibold text-cream transition hover:bg-ember sm:px-8 sm:py-3 sm:text-base"
          >
            View Menu
          </Link>
          <Link
            href="/checkout"
            className="rounded-full border border-cream/40 px-6 py-2.5 font-body text-sm font-semibold text-cream transition hover:border-cream hover:bg-cream/10 sm:px-8 sm:py-3 sm:text-base"
          >
            Order Now
          </Link>
        </div>
      </div>
    </section>
  );
}
