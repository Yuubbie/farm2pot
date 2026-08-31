"use client";

import { useState } from "react";
import { MenuCategory, MenuItem } from "../data/menu";
import Reveal from "./Reveal";

const GROUPS = ["Food", "Drinks", "Experience"] as const;

function formatPrice(n: number) {
  return `₦${n.toLocaleString()}`;
}

function DishCard({ item }: { item: MenuItem }) {
  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-charcoal/5 shadow-md transition-shadow hover:shadow-xl">
      <img
        src={item.image}
        alt={item.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="font-display text-xl font-bold leading-tight text-cream sm:text-2xl">
          {item.name}
        </p>
        {item.price && (
          <p className="mt-1 font-body text-sm font-semibold text-ember sm:text-base">
            {formatPrice(item.price)}
          </p>
        )}
      </div>
    </div>
  );
}

function CategoryBlock({ category }: { category: MenuCategory }) {
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

      {/* Photographed items get a large, expressive card grid */}
      {withPhoto.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {withPhoto.map((item) => (
            <DishCard key={item.name} item={item} />
          ))}
        </div>
      )}

      {/* Everything else stays as a compact list */}
      {withoutPhoto.length > 0 && (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {withoutPhoto.map((item) => (
            <li
              key={item.name}
              className="flex items-baseline justify-between gap-4 font-body text-charcoal/90"
            >
              <span>{item.name}</span>
              {item.price && (
                <span className="whitespace-nowrap text-sm text-charcoal/60">
                  {formatPrice(item.price)}
                </span>
              )}
              {!item.price && !category.flatPrice && !category.bigPrice && (
                <span className="whitespace-nowrap text-sm italic text-charcoal/40">
                  ask staff
                </span>
              )}
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

  const categoriesInGroup = data.filter((c) => c.group === activeGroup);

  return (
    <section id="menu" className="bg-cream px-4 py-12 sm:px-12 sm:py-20 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <span className="font-body text-xs uppercase tracking-[0.2em] text-terracotta sm:text-sm">
          Our Menu
        </span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-charcoal sm:text-4xl lg:text-5xl">
          Something for every table
        </h2>

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
              <CategoryBlock category={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
