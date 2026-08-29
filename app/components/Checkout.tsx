const WHATSAPP_NUMBER = "2348176554823"; // Farm2Pot ordering line

export default function Checkout() {
  return (
    <section className="bg-cream px-5 py-14 sm:px-12 sm:py-24 lg:px-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-body text-xs uppercase tracking-[0.2em] text-terracotta sm:text-sm">
          Ready to Order?
        </span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-charcoal sm:text-4xl lg:text-5xl">
          Let&rsquo;s get your pot ready
        </h1>
        <p className="mt-4 font-body text-base text-charcoal/70 sm:mt-6 sm:text-lg">
          Online cart and card payment are coming soon. For now, order
          directly on WhatsApp &mdash; just tell us what you&rsquo;d like
          from the menu.
        </p>

        <div className="mt-8">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-terracotta px-8 py-3 font-body font-semibold text-cream transition hover:bg-ember"
          >
            Order on WhatsApp
          </a>
        </div>

        <p className="mt-10 font-body text-sm text-charcoal/50">
          Delivery via Bolt or InDrive, arranged separately at their
          standard rate.
        </p>

        {/* TODO: once Paystack is integrated, replace this section with:
            - Cart (built from selected menu items)
            - Delivery/pickup toggle
            - Paystack checkout button
        */}
      </div>
    </section>
  );
}
