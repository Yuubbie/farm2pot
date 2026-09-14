export type MenuItem = {
  name: string;
  price?: number; // in Naira, undefined if using category flatPrice, tiers, or still unconfirmed
  image?: string; // optional real dish photo path
  description?: string; // e.g. ingredient list for bulk/freezer items
  tiers?: { label: string; price: number }[]; // e.g. 2L/3L/5L, or a single "5 PCS" tier
};

export type MenuCategory = {
  id: string;
  name: string;
  group: "Food" | "Drinks" | "Experience";
  flatPrice?: number; // applies to every item in category if set
  smallPrice?: number; // for soups with big/small pricing
  bigPrice?: number;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "soups",
    name: "Soups",
    group: "Food",
    bigPrice: 2050,
    smallPrice: 1650,
    items: [
      { name: "Egusi Soup", image: "/menu-images/egusi-soup.jpg" },
      { name: "Ogbono Soup", image: "/menu-images/ogbono-soup.jpg" },
      { name: "Okro Soup", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Okro_Soup_Real_v2.jpg" },
      { name: "Fisherman Soup", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Fisherman%20Soup.jpg" },
      { name: "Oha Soup", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Oha%20soup.jpg" },
      { name: "Afia Efere (White Soup)", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/White%20soup.jpg" },
      { name: "Efo Soup", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Efo%20Soup.jpg" },
      { name: "Edikang Ikong Soup", image: "/menu-images/edikang-ikong.jpg" },
      { name: "Afang Soup", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Afang_Soup.jpg" },
    ],
  },
  {
    id: "swallows",
    name: "Swallows",
    group: "Food",
    flatPrice: 2500,
    items: [
      { name: "Eba", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Eba.jpg" },
      { name: "Semovita", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Semovita.jpg" },
      { name: "Poondo Yam", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Poondo%20Yam.jpg" },
      { name: "Wheat" },
    ],
  },
  {
    id: "proteins",
    name: "Proteins",
    group: "Food",
    items: [
      { name: "Turkey", price: 8000 },
      { name: "Chicken", price: 7000 },
      { name: "Goat Meat", price: 7000 },
      { name: "Catfish", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Catfish.jpg" }, // price TBC
      { name: "Croaker", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Croaker.jpg" }, // price TBC
      { name: "Beef" }, // price TBC
    ],
  },
  {
    id: "rice",
    name: "Rice",
    group: "Food",
    items: [
      { name: "Jollof Rice", image: "/menu-images/jollof-rice.jpg" },
      { name: "Fried Rice", image: "/menu-images/fried-rice.jpg" },
      { name: "Coconut Rice" },
      { name: "Wheat Rice + Stew" },
      { name: "Noodles + Egg", price: 4000 },
      { name: "Native Rice", image: "https://udjushobeawcltcotwrt.supabase.co/storage/v1/object/public/menu-images/Native_Rice.jpg" }, // price TBC
    ],
  },
  {
    id: "pepper-soups",
    name: "Pepper Soups",
    group: "Food",
    items: [
      { name: "Goat Meat Pepper Soup", price: 11500 },
      { name: "Beef Pepper Soup", price: 11500 },
      { name: "Chicken Pepper Soup", price: 11500 },
      { name: "Turkey Pepper Soup", price: 16500 },
      { name: "Catfish Pepper Soup", price: 25500 },
    ],
  },
  {
    id: "fries",
    name: "Fries",
    group: "Food",
    items: [
      { name: "Potatoes" },
      { name: "Plantain" },
      { name: "Yam Chips" },
    ],
  },
  {
    id: "grills",
    name: "Grills",
    group: "Food",
    items: [
      { name: "Grilled Chicken", price: 7000 },
      { name: "Grilled Turkey", price: 8000 },
      { name: "Suya", price: 2000 },
      { name: "Tozo", price: 2000 },
      { name: "Ram Suya (1kg)", price: 30000 },
      { name: "Ram Suya (half kg)", price: 15000 },
      { name: "Shaki", price: 1500 },
      { name: "Guinea Fowl", price: 13000 },
      { name: "Burger", image: "/menu-images/burger.jpg" }, // price TBC
    ],
  },
  {
    id: "shawarma",
    name: "Shawarma",
    group: "Food",
    items: [
      { name: "Beef Shawarma", price: 5000 },
      { name: "Beef Shawarma (Double Sausage)", price: 7000 },
      { name: "Chicken Shawarma", price: 5000 },
      { name: "Chicken Shawarma (Double Sausage)", price: 7000 },
      { name: "Suya Shawarma", price: 8000 },
      { name: "Ram Suya Shawarma", price: 11500 },
      { name: "Asun Shawarma", price: 11500 },
      { name: "Special Shawarma", price: 15000 },
      { name: "Cheese Chicken Shawarma", price: 15000 },
      { name: "Cheese Beef Shawarma", price: 11500 },
      { name: "Croaker Fish Shawarma", price: 25500 },
    ],
  },
  {
    id: "pasta",
    name: "Pasta",
    group: "Food",
    items: [
      { name: "Spaghetti", image: "/menu-images/spaghetti.jpg" }, // price TBC
    ],
  },
  {
    id: "snacks",
    name: "Snacks",
    group: "Food",
    items: [
      { name: "Egg Roll", image: "/menu-images/egg-roll.jpg" }, // price TBC
    ],
  },
  {
    id: "ramen-pepper-soup",
    name: "Ramen Pepper Soup",
    group: "Food",
    items: [
      { name: "Chicken Ramen Pepper Soup", price: 13500 },
      { name: "Beef Ramen Pepper Soup", price: 13500 },
      { name: "Goat Meat Ramen Pepper Soup", price: 15500 },
      { name: "Turkey Meat Ramen Pepper Soup", price: 16500 },
      { name: "Catfish Ramen Pepper Soup", price: 15500 },
      { name: "Seafood Ramen Pepper Soup", price: 20000, image: "/menu-images/Seafood_Ramen_Pepper_Soup.jpg" },
      {
        name: "Farm2Pot Special Ramen Pepper Soup",
        price: 22000,
      },
    ],
  },
  {
    id: "breakfast",
    name: "Breakfast",
    group: "Food",
    items: [
      { name: "Akara and Pap", image: "/menu-images/Akara_and_Pap.jpg" }, // price TBC
    ],
  },
  {
    id: "dessert",
    name: "Dessert",
    group: "Food",
    items: [{ name: "Parfait", price: 9000 }],
  },
  {
    id: "beers",
    name: "Beers & Cider",
    group: "Drinks",
    flatPrice: 2000,
    items: [
      { name: "Heineken" },
      { name: "Trophy" },
      { name: "Star" },
      { name: "Star Radler" },
      { name: "Gulder" },
      { name: "Goldberg" },
      { name: "Life" },
      { name: "33 Export" },
      { name: "Budweiser" },
      { name: "Small Stout" },
      { name: "Desperados" },
      { name: "Smirnoff Ice" },
      { name: "Origin Bitters" },
    ],
  },
  {
    id: "soft-drinks",
    name: "Soft Drinks",
    group: "Drinks",
    flatPrice: 1000,
    items: [
      { name: "Coca-Cola" },
      { name: "Fanta" },
      { name: "Sprite" },
      { name: "Schweppes" },
      { name: "Malt" },
    ],
  },
  {
    id: "water",
    name: "Water",
    group: "Drinks",
    items: [{ name: "Bottled Water", price: 700 }],
  },
  {
    id: "fresh-juice",
    name: "Fresh Juice",
    group: "Drinks",
    flatPrice: 4000,
    items: [
      { name: "Fresh Orange Juice" },
      { name: "Pineapple & Ginger" },
      { name: "Fresh Watermelon" },
      { name: "Pineapple & Orange" },
      { name: "Sugarcane & Ginger" },
      { name: "Zobo" },
      { name: "Pineapple, Carrot & Ginger" },
      { name: "Tigernut Drink" },
    ],
  },
  {
    id: "pack-juice",
    name: "Pack Juice",
    group: "Drinks",
    flatPrice: 4500,
    items: [
      { name: "Five Alive" },
      { name: "Berry Blast" },
      { name: "Chivita" },
      { name: "Hollandia" },
      { name: "Active" },
    ],
  },
  {
    id: "yogurt",
    name: "Yogurt",
    group: "Drinks",
    flatPrice: 6000,
    items: [
      { name: "Yogofura", image: "/menu-images/yogofura.jpg" },
      { name: "Plain Yogurt" },
      { name: "Yogurt with Chia Seed" },
      { name: "Banana Yogurt" },
    ],
  },
  {
    id: "cocktails",
    name: "Cocktails",
    group: "Drinks",
    items: [
      { name: "Mojito", price: 8000 },
      { name: "Strawberry Mojito", price: 9000 },
      { name: "Pineapple Mojito", price: 9000 },
      { name: "Long Island Iced Tea", price: 12000 },
      { name: "Sex on the Beach", price: 10000 },
      { name: "Tequila Sunrise", price: 9000 },
      { name: "Piña Colada", price: 10000 },
      { name: "Margarita", price: 10000 },
      { name: "Chapman", price: 7000 },
    ],
  },
  {
    id: "milkshakes",
    name: "Milkshakes",
    group: "Drinks",
    items: [
      { name: "Vanilla", price: 9000 },
      { name: "Chocolate", price: 9000 },
      { name: "Strawberry", price: 9000 },
      { name: "Oreo", price: 10000 },
      { name: "Lotus Biscoff", price: 11000 },
      { name: "Caramel", price: 10000 },
      { name: "Banana", price: 9000 },
      { name: "Nutella", price: 10000 },
      { name: "Peanut Butter", price: 11500 },
      { name: "Vanilla & Strawberry Swirl", price: 10000 },
    ],
  },
  {
    id: "shisha",
    name: "Shisha",
    group: "Experience",
    flatPrice: 10000,
    items: [
      { name: "Double Apple" },
      { name: "Mint" },
      { name: "Grape" },
      { name: "Watermelon" },
      { name: "Blueberry" },
      { name: "Peach" },
      { name: "Lemon & Mint" },
    ],
  },
];
