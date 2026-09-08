import Reveal from "./Reveal";

export default function About() {
  return (
    <section className="bg-charcoal px-5 py-14 text-cream sm:px-12 sm:py-24 lg:px-20">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-12">
        {/* CEO photo */}
        <Reveal>
          <div className="aspect-square w-full max-w-xs overflow-hidden rounded-2xl bg-cream/10 sm:max-w-sm">
            <img
              src="https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/CEO%20farm2pot.png"
              alt="Farm2Pot And Grill — Meet the CEO"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div>
            <span className="font-body text-xs uppercase tracking-[0.2em] text-ember sm:text-sm">
              Our Story &amp; The Face Behind the Brand
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">
              About Farm2Pot
            </h1>
            <p className="mt-4 font-body text-base leading-relaxed text-cream/85 sm:mt-6 sm:text-lg">
              Farm2Pot And Grill was born from a passion for good food, fresh
              ingredients, and creating memorable dining experiences. What
              started as a dream has grown into a food brand built on quality,
              flavour, and genuine hospitality.
            </p>
            <p className="mt-4 font-body text-base leading-relaxed text-cream/85 sm:text-lg">
              From delicious Nigerian meals and grills to fresh juices,
              cocktails, milkshakes, and more, every dish is prepared with
              love and served with purpose. At Farm2Pot, it&rsquo;s more than
              just food &mdash; it&rsquo;s the experience, the taste, and the
              memories we create.
            </p>

            <div className="mt-8 border-t border-cream/15 pt-6 sm:mt-10 sm:pt-8">
              <h2 className="font-display text-xl font-semibold text-ember sm:text-2xl">
                Meet the CEO
              </h2>
              <p className="mt-3 font-body text-sm text-cream/70 sm:text-base">
                {/* TODO: drop in Itoro's personal bio once received */}
                Bio coming soon &mdash; the person behind Farm2Pot, in her own
                words.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
