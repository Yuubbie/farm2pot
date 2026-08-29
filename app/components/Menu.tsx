"use client";

import { useState } from "react";
import { menu, MenuCategory } from "../data/menu";

const GROUPS = ["Food", "Drinks", "Experience"] as const;

function formatPrice(n: number) {
  return `₦${n.toLocaleString()}`;
}

function CategoryBlock({ category }: { category: MenuCategory }) {
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
      <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {category.items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-4 font-body text-charcoal/90"
          >
            <span className="flex items-center gap-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                />
              )}
              {item.name}
            </span>
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
    </div>
  );
}

export default function Menu() {
  const [activeGroup, setActiveGroup] =
    useState<(typeof GROUPS)[number]>("Food");

  const categoriesInGroup = menu.filter((c) => c.group === activeGroup);

  return (
    <section id="menu" className="bg-cream px-6 py-20 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <span className="font-body text-sm uppercase tracking-[0.2em] text-terracotta">
          Our Menu
        </span>
        <h2 className="mt-2 font-display text-4xl font-semibold text-charcoal sm:text-5xl">
          Something for every table
        </h2>

        {/* Group tabs */}
        <div className="mt-8 flex gap-2">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`rounded-full px-6 py-2 font-body font-semibold transition ${
                activeGroup === g
                  ? "bg-charcoal text-cream"
                  : "bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sticky category jump nav */}
        <div className="sticky top-[73px] z-10 -mx-6 mt-6 flex gap-2 overflow-x-auto bg-cream/95 px-6 py-3 backdrop-blur sm:-mx-12 sm:px-12 lg:-mx-20 lg:px-20">
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
        <div className="mt-10 space-y-14">
          {categoriesInGroup.map((c) => (
            <CategoryBlock key={c.id} category={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
