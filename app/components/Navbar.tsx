"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Package, Heart, Settings, ChevronDown, Menu, X } from "lucide-react";
import { openAuthModal } from "./auth/AuthModal";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const userLinks = [
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/favorites", label: "Favorites", icon: Heart },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { count } = useCart();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-charcoal/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80 transition-shadow duration-300 ${
        scrolled ? "shadow-elevation-1" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-12 sm:py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-display text-base font-semibold text-charcoal sm:gap-3 sm:text-xl"
        >
          <img
            src="/logo.png"
            alt="Farm2Pot And Grill logo"
            className="h-9 w-9 rounded-full object-cover sm:h-11 sm:w-11"
          />
          <span className="hidden xs:inline">Farm2Pot</span>
          <span className="text-terracotta">& Grill</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-8 font-body text-sm font-medium text-charcoal/70 sm:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-terracotta transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Cart Link */}
          <Link
            href="/checkout"
            onClick={() => setOpen(false)}
            className="relative rounded-full bg-terracotta px-3 py-1.5 font-body text-xs font-semibold text-cream transition-all hover:bg-ember hover:scale-[1.02] sm:px-5 sm:py-2 sm:text-sm"
          >
            Order Now
            {count > 0 && (
              <motion.span
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] font-bold text-cream"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {count}
              </motion.span>
            )}
          </Link>

          {/* Auth / User Menu */}
          <AnimatePresence>
            {loading ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/5">
                <svg className="h-5 w-5 text-charcoal/40 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : user ? (
              // User Menu Dropdown
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-charcoal/5 px-3 py-1.5 sm:px-4"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta/10">
                    <User className="h-5 w-5 text-terracotta" />
                  </div>
                  <span className="hidden sm:inline-block font-body text-sm font-medium text-charcoal">
                    {user.user_metadata?.full_name || user.email?.split("@")[0] || "Account"}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-charcoal/60 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <motion.div
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-charcoal/10 bg-cream py-2 shadow-elevation-3"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <div className="px-4 py-3 border-b border-charcoal/10">
                        <p className="font-body text-sm font-semibold text-charcoal">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="font-body text-xs text-charcoal/50 truncate">{user.email}</p>
                      </div>
                      <nav className="py-2">
                        {userLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-charcoal/70 hover:bg-charcoal/5 hover:text-terracotta transition-colors"
                          >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                          </Link>
                        ))}
                        <hr className="my-2 border-charcoal/10" />
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 px-4 py-2.5 font-body text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </nav>
                    </motion.div>
                  </>
                )}
              </div>
            ) : (
              // Sign In Button
              <button
                onClick={() => openAuthModal("signin")}
                className="hidden rounded-full border border-charcoal/20 bg-cream px-4 py-1.5 font-body text-sm font-medium text-charcoal/70 transition-all hover:border-terracotta hover:text-terracotta hover:bg-terracotta/5 sm:flex"
              >
                Sign In
              </button>
            )}
          </AnimatePresence>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
          >
            <span
              className={`h-0.5 w-6 bg-charcoal transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-charcoal transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`h-0.5 w-6 bg-charcoal transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <motion.nav
          className="flex flex-col border-t border-charcoal/10 bg-cream px-4 py-2 font-body text-sm font-medium text-charcoal/80 sm:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-charcoal/5 py-3 last:border-none hover:text-terracotta transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {!user && !loading && (
            <button
              onClick={() => {
                setOpen(false);
                openAuthModal("signin");
              }}
              className="mt-2 mb-2 mx-2 rounded-full bg-terracotta py-3 font-body font-semibold text-cream"
            >
              Sign In
            </button>
          )}
        </motion.nav>
      )}
    </header>
  );
}