import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[560px] w-full overflow-hidden">
      {/* Background photo */}
      <img
        src="/hero.png"
        alt="Farm2Pot And Grill signature spread at sunset — jollof rice, suya, and fresh juice"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Left-side gradient so text stays readable over the sunset sky */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/30 to-transparent" />

      {/* Content, positioned in the open left third of the photo */}
      <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-6 sm:px-12 lg:px-20">
        <span className="mb-4 font-body text-sm uppercase tracking-[0.2em] text-ember">
          Nigerian Kitchen &amp; Grill
        </span>
        <h1 className="font-display text-5xl font-semibold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
          Farm2Pot
          <br />
          <span className="text-terracotta">&amp; Grill</span>
        </h1>
        <p className="mt-6 max-w-md font-body text-lg text-cream/90">
          Fresh ingredients, real hospitality, and a menu that goes from
          Sunday soup pots to Friday-night cocktails — every dish prepared
          with love and served with purpose.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/menu"
            className="rounded-full bg-terracotta px-8 py-3 font-body font-semibold text-cream transition hover:bg-ember"
          >
            View Menu
          </Link>
          <Link
            href="/checkout"
            className="rounded-full border border-cream/40 px-8 py-3 font-body font-semibold text-cream transition hover:border-cream hover:bg-cream/10"
          >
            Order Now
          </Link>
        </div>
      </div>
    </section>
  );
}
