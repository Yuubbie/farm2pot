import { MenuCategory } from "../data/menu";
import Reveal from "./Reveal";

export default function FeaturedGallery({ data }: { data: MenuCategory[] }) {
  // Pull every item across the whole menu that has a real photo
  const featured = data
    .flatMap((category) => category.items.map((item) => ({ ...item, category: category.name })))
    .filter((item) => item.image);

  if (featured.length === 0) return null;

  return (
    <section className="bg-charcoal px-5 py-14 sm:px-12 sm:py-20 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="font-body text-xs uppercase tracking-[0.2em] text-ember sm:text-sm">
            From the Pot
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-cream sm:text-4xl lg:text-5xl">
            A taste of what's cooking
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((item, i) => (
            <Reveal key={item.name} delay={Math.min(i * 70, 350)}>
              <div className="group relative aspect-square overflow-hidden rounded-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/0 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <p className="font-display text-sm font-semibold text-cream sm:text-base">
                    {item.name}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
