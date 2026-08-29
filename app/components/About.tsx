export default function About() {
  return (
    <section className="bg-charcoal px-6 py-24 text-cream sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        {/* CEO photo placeholder */}
        <div className="aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-cream/10">
          {/* TODO: replace with Itoro's photo once received */}
          <div className="flex h-full w-full items-center justify-center font-body text-sm text-cream/40">
            CEO photo coming soon
          </div>
        </div>

        <div>
          <span className="font-body text-sm uppercase tracking-[0.2em] text-ember">
            Our Story &amp; The Face Behind the Brand
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
            About Farm2Pot
          </h1>
          <p className="mt-6 font-body text-lg leading-relaxed text-cream/85">
            Farm2Pot And Grill was born from a passion for good food, fresh
            ingredients, and creating memorable dining experiences. What
            started as a dream has grown into a food brand built on quality,
            flavour, and genuine hospitality.
          </p>
          <p className="mt-4 font-body text-lg leading-relaxed text-cream/85">
            From delicious Nigerian meals and grills to fresh juices,
            cocktails, milkshakes, and more, every dish is prepared with
            love and served with purpose. At Farm2Pot, it&rsquo;s more than
            just food &mdash; it&rsquo;s the experience, the taste, and the
            memories we create.
          </p>

          <div className="mt-10 border-t border-cream/15 pt-8">
            <h2 className="font-display text-2xl font-semibold text-ember">
              Meet the CEO
            </h2>
            <p className="mt-3 font-body text-cream/70">
              {/* TODO: drop in Itoro's personal bio once received */}
              Bio coming soon &mdash; the person behind Farm2Pot, in her own
              words.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
