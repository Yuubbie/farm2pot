import Reveal from "./Reveal";

const ORDER_WHATSAPP_1 = "2348162470726"; // primary order line
const ORDER_WHATSAPP_2 = "2348176554823"; // secondary order line
const COMPLAINTS_WHATSAPP = "2348186304735";

export default function Contact() {
  return (
    <section className="bg-forest px-5 py-14 text-cream sm:px-12 sm:py-24 lg:px-20">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="font-body text-xs uppercase tracking-[0.2em] text-ember sm:text-sm">
            Find Us
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Get in Touch
          </h1>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-8 grid gap-6 text-left sm:mt-10 sm:grid-cols-2 sm:gap-8">
          <div>
            <h2 className="font-body text-sm font-semibold uppercase tracking-wide text-ember">
              Location
            </h2>
            <p className="mt-2 font-body text-cream/85">
              Kit Court Street, Harris Drive,
              <br />
              Ajah, Lagos
            </p>
          </div>

          <div>
            <h2 className="font-body text-sm font-semibold uppercase tracking-wide text-ember">
              Email
            </h2>
            <div className="mt-2 flex flex-col gap-1">
              <a
                href="mailto:farmtopotfood@gmail.com"
                className="font-body text-cream/85 underline decoration-dotted hover:text-cream"
              >
                farmtopotfood@gmail.com
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-body text-sm font-semibold uppercase tracking-wide text-ember">
              WhatsApp
            </h2>
            <div className="mt-2 flex flex-col gap-1">
              <a
                href={`https://wa.me/${ORDER_WHATSAPP_1}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-cream/85 underline decoration-dotted hover:text-cream"
              >
                Order — 0816 247 0726
              </a>
              <a
                href={`https://wa.me/${ORDER_WHATSAPP_2}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-cream/85 underline decoration-dotted hover:text-cream"
              >
                Order — 0817 655 4823
              </a>
              <a
                href={`https://wa.me/${COMPLAINTS_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-cream/85 underline decoration-dotted hover:text-cream"
              >
                For complaints — 0818 630 4735
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-body text-sm font-semibold uppercase tracking-wide text-ember">
              Follow Along
            </h2>
            <div className="mt-2 flex flex-col gap-1 font-body text-cream/85">
              <a
                href="https://instagram.com/Farm_2pot"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream"
              >
                Instagram — @Farm_2pot
              </a>
              <a
                href="https://tiktok.com/@Farm2pot"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream"
              >
                TikTok — @Farm2pot
              </a>
              <a
                href="https://facebook.com/Farm2pot"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream"
              >
                Facebook — Farm2pot
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-body text-sm font-semibold uppercase tracking-wide text-ember">
              Hours
            </h2>
            <p className="mt-2 font-body text-cream/85">
              Monday &mdash; Sunday
              <br />
              Open 24/7
            </p>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
