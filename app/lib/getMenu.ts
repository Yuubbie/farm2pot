import { supabase } from "./supabase";
import { menu as staticMenu, MenuCategory } from "../data/menu";

/**
 * Fetches the full menu from Supabase, shaped to match the existing
 * MenuCategory[] structure. Falls back to the static app/data/menu.ts
 * data if Supabase isn't configured yet or the fetch fails for any
 * reason — the site should never break because the database hiccups.
 */
export async function getMenu(): Promise<MenuCategory[]> {
  if (!supabase) {
    return staticMenu;
  }

  try {
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");

    if (catError || !categories) {
      console.error("Supabase categories fetch failed, using fallback:", catError);
      return staticMenu;
    }

    const { data: items, error: itemError } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order");

    if (itemError || !items) {
      console.error("Supabase menu_items fetch failed, using fallback:", itemError);
      return staticMenu;
    }

    const shaped: MenuCategory[] = categories.map((c) => ({
      id: c.id,
      name: c.name,
      group: c.group_name as MenuCategory["group"],
      flatPrice: c.flat_price ?? undefined,
      bigPrice: c.big_price ?? undefined,
      smallPrice: c.small_price ?? undefined,
      items: items
        .filter((i) => i.category_id === c.id)
        .map((i) => ({
          name: i.name,
          price: i.price ?? undefined,
          image: i.image ?? undefined,
        })),
    }));

    // Safety net: if Supabase returned an empty menu (e.g. tables not seeded yet),
    // fall back rather than showing a blank menu page.
    if (shaped.length === 0) {
      return staticMenu;
    }

    return shaped;
  } catch (err) {
    console.error("Unexpected error fetching menu from Supabase, using fallback:", err);
    return staticMenu;
  }
}
