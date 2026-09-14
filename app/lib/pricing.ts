import { MenuCategory, MenuItem } from "../data/menu";

export function formatPrice(n: number) {
  return `₦${n.toLocaleString()}`;
}

export type Pricing =
  | { type: "single"; price: number }
  | { type: "bigsmall"; big: number; small: number }
  | { type: "tiers"; tiers: { label: string; price: number }[] }
  | { type: "none" };

export function getPricing(item: MenuItem, category: MenuCategory): Pricing {
  if (item.tiers && item.tiers.length > 0) return { type: "tiers", tiers: item.tiers };
  if (item.price) return { type: "single", price: item.price };
  if (category.flatPrice) return { type: "single", price: category.flatPrice };
  if (category.bigPrice && category.smallPrice) {
    return { type: "bigsmall", big: category.bigPrice, small: category.smallPrice };
  }
  return { type: "none" };
}

// Which categories naturally pair with each other, for the "Pairs well
// with" suggestions in the dish detail view.
export const PAIRING_MAP: Record<string, string[]> = {
  soups: ["swallows"],
  swallows: ["soups", "pepper-soups"],
  proteins: ["rice", "fries"],
  rice: ["proteins", "grills"],
  fries: ["grills"],
  grills: ["fries", "soft-drinks", "beers"],
  shawarma: ["soft-drinks", "fresh-juice"],
  "pepper-soups": ["swallows"],
  "ramen-pepper-soup": ["soft-drinks"],
  pasta: ["soft-drinks"],
  snacks: ["fresh-juice"],
  dessert: ["milkshakes"],
  beers: ["grills", "shawarma"],
  "soft-drinks": ["grills", "shawarma"],
  water: ["grills"],
  "fresh-juice": ["snacks", "fries"],
  "pack-juice": ["grills"],
  yogurt: ["fresh-juice"],
  cocktails: ["shisha", "grills"],
  milkshakes: ["dessert"],
  shisha: ["cocktails"],
  beans: ["stew", "sauce"],
  stew: ["rice", "swallows"],
  sauce: ["rice", "swallows"],
  fingerfood: ["fresh-juice-bulk"],
  "small-chops": ["fresh-juice-bulk"],
  "grills-platter": ["fresh-juice-bulk"],
  "combo-deals": ["fresh-juice-bulk"],
  "fresh-juice-bulk": ["combo-deals"],
};
