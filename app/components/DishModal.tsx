"use client";

import { useState } from "react";
import { MenuCategory, MenuItem } from "../data/menu";
import { useCart } from "../context/CartContext";
import { formatPrice, getPricing, PAIRING_MAP } from "../lib/pricing";

export default function DishModal({
  item,
  category,
  allCategories,
  onClose,
}: {
  item: MenuItem;
  category: MenuCategory;
  allCategories: MenuCategory[];
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const pricing = getPricing(item, category);
  const [added, setAdded] = useState<string | null>(null);

  const flash = (label: string) => {
    setAdded(label);
    setTimeout(() => setAdded(null), 1200);
  };

  // Build up to 4 pairing suggestions from related categories
  const pairedCategoryIds = PAIRING_MAP[category.id] || [];
  const suggestions: { item: MenuItem; category: MenuCategory }[] = [];
  for (const catId of pairedCategoryIds) {
    const cat = allCategories.find((c) => c.id === catId);
    if (!cat) continue;
    const picks = [...cat.items]
      .sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0))
      .slice(0, 2);
    for (const p of picks) {
      suggestions.push({ item: p, category: cat });
      if (suggestions.length >= 4) break;
    }
    if (suggestions.length >= 4) break;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {item.image && (
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/60 text-cream backdrop-blur transition hover:bg-charcoal"
            >
              ✕
            </button>
          </div>
        )}

        <div className="p-6">
          {!item.image && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="float-right flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/10 text-charcoal transition hover:bg-charcoal/20"
            >
              ✕
            </button>
          )}

          <p className="font-body text-xs uppercase tracking-[0.15em] text-terracotta">
            {category.name}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-charcoal sm:text-3xl">
            {item.name}
          </h2>

          {/* Price / Add controls */}
          <div className="mt-5">
            {pricing.type === "none" && (
              <p className="font-body text-sm italic text-charcoal/50">
                Price not confirmed yet — ask staff or reach out on WhatsApp.
              </p>
            )}

            {pricing.type === "single" && (
              <button
                onClick={() => {
                  addItem({ id: `${category.id}-${item.name}`, name: item.name, price: pricing.price });
                  flash(item.name);
                }}
                className="w-full rounded-full bg-terracotta py-3 font-body font-semibold text-cream transition hover:bg-ember"
              >
                {added === item.name ? "Added ✓" : `Add to Cart — ${formatPrice(pricing.price)}`}
              </button>
            )}

            {pricing.type === "bigsmall" && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addItem({
                      id: `${category.id}-${item.name}-big`,
                      name: `${item.name} (Big)`,
                      price: pricing.big,
                    });
                    flash("big");
                  }}
                  className="flex-1 rounded-full border-2 border-terracotta py-3 font-body font-semibold text-terracotta transition hover:bg-terracotta hover:text-cream"
                >
                  {added === "big" ? "Added ✓" : `Big — ${formatPrice(pricing.big)}`}
                </button>
                <button
                  onClick={() => {
                    addItem({
                      id: `${category.id}-${item.name}-small`,
                      name: `${item.name} (Small)`,
                      price: pricing.small,
                    });
                    flash("small");
                  }}
                  className="flex-1 rounded-full border-2 border-terracotta py-3 font-body font-semibold text-terracotta transition hover:bg-terracotta hover:text-cream"
                >
                  {added === "small" ? "Added ✓" : `Small — ${formatPrice(pricing.small)}`}
                </button>
              </div>
            )}
          </div>

          {/* Pairing suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-8 border-t border-charcoal/10 pt-6">
              <h3 className="font-display text-lg font-semibold text-charcoal">
                Pairs well with
              </h3>
              <div className="mt-3 space-y-2">
                {suggestions.map(({ item: sItem, category: sCat }) => {
                  const sPricing = getPricing(sItem, sCat);
                  return (
                    <div
                      key={`${sCat.id}-${sItem.name}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-charcoal/5 px-4 py-2.5"
                    >
                      <span className="font-body text-sm text-charcoal/80">{sItem.name}</span>
                      <span className="whitespace-nowrap font-body text-xs text-charcoal/50">
                        {sPricing.type === "single" && formatPrice(sPricing.price)}
                        {sPricing.type === "bigsmall" &&
                          `From ${formatPrice(sPricing.small)}`}
                        {sPricing.type === "none" && "ask staff"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
