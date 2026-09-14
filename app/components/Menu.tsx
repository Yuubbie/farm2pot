"use client";

import { useState } from "react";
import { MenuCategory, MenuItem } from "../data/menu";
import Reveal from "./Reveal";
import DishModal from "./DishModal";
import { useCart } from "../context/CartContext";
import { formatPrice, getPricing } from "../lib/pricing";

const GROUPS = ["Food", "Drinks", "Experience"] as const;

function AddControls({
  item,
  category,
  compact = false,
}: {
  item: MenuItem;
  category: MenuCategory;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const pricing = getPricing(item, category);
  const [added, setAdded] = useState(false);

  const flash = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (pricing.type === "none") {
    return (
      <span className="whitespace-nowrap text-sm italic text-charcoal/40">
        ask staff
      </span>
    );
  }

  if (pricing.type === "tiers") {
    const first = pricing.tiers[0];
    return (
      <span
        className={
          compact
            ? "whitespace-nowrap font-body text-sm text-ember"
            : "whitespace-nowrap text-sm text-charcoal/60"
        }
      >
        {first.label} {formatPrice(first.price)}
        {pricing.tiers.length > 1 ? "+" : ""}
      </span>
    );
  }

  if (pricing.type === "bigsmall") {
    return (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addItem({
              id: `${category.id}-${item.name}-big`,
              name: `${item.name} (Big)`,
              price: pricing.big,
            });
            flash();
          }}
          className="whitespace-nowrap rounded-full border border-terracotta/40 px-2.5 py-1 font-body text-xs font-semibold text-terracotta transition hover:bg-terracotta hover:text-cream"
        >
          Big {formatPrice(pricing.big)}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addItem({
              id: `${category.id}-${item.name}-small`,
              name: `${item.name} (Small)`,
              price: pricing.small,
            });
            flash();
          }}
          className="whitespace-nowrap rounded-full border border-terracotta/40 px-2.5 py-1 font-body text-xs font-semibold text-terracotta transition hover:bg-terracotta hover:text-cream"
        >
          Small {formatPrice(pricing.small)}
        </button>
        {added && <span className="font-body text-xs text-forest">Added ✓</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {!compact && (
        <span className="whitespace-nowrap text-sm text-charcoal/60">
          {formatPrice(pricing.price)}
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          addItem({
            id: `${category.id}-${item.name}`,
            name: item.name,
            price: pricing.price,
          });
          flash();
        }}
        aria-label={`Add ${item.name} to cart`}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-terracotta font-body text-cream transition hover:bg-ember"
      >
        {added ? "✓" : "+"}
      </button>
      {compact && (
        <span className="whitespace-nowrap font-body text-sm text-ember">
          {formatPrice(pricing.price)}
        </span>
      )}
    </div>
  );
}

function DishCard({
  item,
  category,
  onOpen,
}: {
  item: MenuItem;
  category: MenuCategory;
  onOpen: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl bg-charcoal/5 shadow-md transition-shadow hover:shadow-xl"
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
        <p className="font-display text-lg font-bold leading-tight text-cream sm:text-xl">
          {item.name}
        </p>
        <AddControls item={item} category={category} compact />
      </div>
    </div>
  );
}

function CategoryBlock({
  category,
  onOpenItem,
}: {
  category: MenuCategory;
  onOpenItem: (item: MenuItem, category: MenuCategory) => void;
}) {
  const withPhoto = category.items.filter((i) => i.image);
  const withoutPhoto = category.items.filter((i) => !i.image);

  return (
    <div id={category.id} className="scroll-mt-24">
      <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-charcoal/10 pb-2">
        <h3 className="font-display text-2xl font-semibold text-charcoal">
          {category.name}
        </h3>
        {category.flatPrice && (
          <span className="whitespace-nowrap font-body text-sm font-semibold text-terracotta">
            {formatPrice(category.flatPrice)} each
          </span>
        )}
        {category.bigPrice && (
          <span className="whitespace-nowrap font-body text-sm font-semibold text-terracotta">
            Big {formatPrice(category.bigPrice)} · Small{" "}
            {formatPrice(category.smallPrice!)}
          </span>
        )}
      </div>

      {withPhoto.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {withPhoto.map((item) => (
            <DishCard
              key={item.name}
              item={item}
              category={category}
              onOpen={() => onOpenItem(item, category)}
            />
          ))}
        </div>
      )}

      {withoutPhoto.length > 0 && (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {withoutPhoto.map((item) => (
            <li
              key={item.name}
              onClick={() => onOpenItem(item, category)}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-2 py-1 font-body text-charcoal/90 transition hover:bg-charcoal/5"
            >
              <span>{item.name}</span>
              <AddControls item={item} category={category} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Menu({ data }: { data: MenuCategory[] }) {
  const [activeGroup, setActiveGroup] =
    useState<(typeof GROUPS)[number]>("Food");
  const [openItem, setOpenItem] = useState<{ item: MenuItem; category: MenuCategory } | null>(
    null
  );

  const categoriesInGroup = data.filter((c) => c.group === activeGroup);

  return (
    <section id="menu" className="bg-cream px-4 py-8 sm:px-12 sm:py-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <span className="font-body text-xs uppercase tracking-[0.2em] text-terracotta sm:text-sm">
          Our Menu
        </span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-charcoal sm:text-4xl lg:text-5xl">
          Something for every table
        </h2>
        <p className="mt-2 font-body text-sm text-charcoal/50">
          Tap any dish to see the price and what pairs well with it.
        </p>

        {/* Group tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto sm:mt-8">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`whitespace-nowrap rounded-full px-5 py-2 font-body text-sm font-semibold transition-all duration-300 sm:px-6 ${
                activeGroup === g
                  ? "scale-105 bg-charcoal text-cream"
                  : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sticky category jump nav */}
        <div className="sticky top-[57px] z-10 -mx-4 mt-4 flex gap-2 overflow-x-auto bg-cream/95 px-4 py-3 backdrop-blur sm:top-[73px] sm:-mx-12 sm:mt-6 sm:px-12 lg:-mx-20 lg:px-20">
          {categoriesInGroup.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="whitespace-nowrap rounded-full border border-charcoal/15 px-4 py-1.5 font-body text-sm text-charcoal/70 transition hover:border-terracotta hover:text-terracotta"
            >
              {c.name}
            </a>
          ))}
        </div>

        {/* Category sections */}
        <div
          key={activeGroup}
          className="mt-10 space-y-14"
          style={{ animation: "fadeTab 0.4s ease-out both" }}
        >
          {categoriesInGroup.map((c, i) => (
            <Reveal key={c.id} delay={Math.min(i * 80, 320)}>
              <CategoryBlock
                category={c}
                onOpenItem={(item, category) => setOpenItem({ item, category })}
              />
            </Reveal>
          ))}
        </div>
      </div>

      {openItem && (
        <DishModal
          item={openItem.item}
          category={openItem.category}
          allCategories={data}
          onClose={() => setOpenItem(null)}
        />
      )}
    </section>
  );
}
