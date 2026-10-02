"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "../../lib/supabase-browser";
import { formatPrice } from "../../lib/pricing";
import Image from "next/image";
import { Heart, Plus, Loader2, Trash2 } from "lucide-react";

interface Favorite {
  id: string;
  created_at: string;
  menu_items: {
    id: string;
    name: string;
    price: number | null;
    image: string | null;
    categories: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("favorites")
      .select(`
        id,
        created_at,
        menu_items (
          id,
          name,
          price,
          image,
          categories ( id, name )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
    } else {
      // Supabase returns menu_items as array, take first item
      const normalized = (data || []).map((fav: any) => ({
        ...fav,
        menu_items: Array.isArray(fav.menu_items) ? fav.menu_items[0] : fav.menu_items,
      }));
      setFavorites(normalized);
    }
    setLoading(false);
  };

  const removeFavorite = async (favoriteId: string) => {
    setRemoving(favoriteId);
    const supabase = createClient();
    const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
    if (!error) {
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    }
    setRemoving(null);
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="rounded-2xl border border-charcoal/10 bg-cream overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-charcoal/10" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-charcoal/10 rounded" />
              <div className="h-4 w-1/2 bg-charcoal/10 rounded" />
              <div className="h-6 w-24 bg-charcoal/10 rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Heart className="mx-auto h-16 w-16 text-charcoal/30" />
        <h2 className="mt-4 font-display text-xl font-semibold text-charcoal">No favorites yet</h2>
        <p className="mt-2 text-body text-charcoal/60 max-w-md mx-auto">
          Tap the heart icon on any dish to save it here for quick access
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {favorites.map((fav, index) => {
        const item = fav.menu_items;
        if (!item) return null;

        return (
          <motion.article
            key={fav.id}
            className="group relative rounded-2xl border border-charcoal/10 bg-cream overflow-hidden shadow-elevation-1 transition-shadow hover:shadow-elevation-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="relative aspect-square overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-charcoal/5">
                  <svg className="h-12 w-12 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              
              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-charcoal/80 px-2.5 py-1 text-xs font-medium text-cream backdrop-blur-sm">
                  {item.categories?.name || "Dish"}
                </span>
              </div>

              {/* Remove favorite */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.id);
                }}
                disabled={removing === fav.id}
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500/90 text-cream transition-all hover:bg-red-600 hover:scale-110 disabled:opacity-50"
                aria-label="Remove from favorites"
              >
                {removing === fav.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-charcoal line-clamp-1">{item.name}</h3>
              <p className="mt-1 text-sm text-terracotta font-semibold">
                {item.price ? formatPrice(item.price) : "Ask for price"}
              </p>
              <button className="mt-3 w-full rounded-full border border-terracotta py-2 text-sm font-semibold text-terracotta transition-all hover:bg-terracotta hover:text-cream">
                <Plus className="h-4 w-4 inline mr-1" />
                Add to Cart
              </button>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}