# Farm2Pot And Grill — Website

## What's built so far
- Next.js + Tailwind project scaffold, now with **real multi-page routing**:
  - `/` — Home (hero + quick links)
  - `/menu` — full 111-item menu, tabbed Food/Drinks/Experience
  - `/about` — brand story + Meet the CEO
  - `/contact` — location, WhatsApp, socials
  - `/checkout` — order page (WhatsApp-based for now, Paystack next)
- Site-wide sticky Navbar and Footer on every page
- PWA manifest + icons so the site is installable from Chrome

## Before you go live, fill these in
1. **Developer WhatsApp number** — search for `234XXXXXXXXXX` in `app/components/Footer.tsx` and replace with your own number (Farm2Pot's ordering number is already wired in as +234 817 655 4823)
2. **CEO photo + bio** — `app/components/About.tsx` has two placeholder spots marked with TODO comments
3. **Address + hours** — `app/components/Contact.tsx` has two placeholder spots marked with TODO comments
4. **Remaining menu prices** — Catfish, Croaker, Beef, Shawarma, Burger are still blank in `app/data/menu.ts`

## What's next (in order)
1. **Supabase setup** — move menu from `app/data/menu.ts` into a real database (so Itoro can update prices herself)
2. **Real checkout** — build a cart (select items on `/menu`, review on `/checkout`) + Paystack integration, replacing the WhatsApp-only placeholder in `app/components/Checkout.tsx`
3. **Deploy** — see step-by-step below

## Running locally
```
npm install
npm run dev
```

## Environment variables needed (create `.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
```
