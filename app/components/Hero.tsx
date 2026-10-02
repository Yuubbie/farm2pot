"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Leaf, Truck, Shield } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-title"
      style={{ minHeight: "100svh" }}
    >
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-terracotta/15 blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{ filter: "blur(64px)" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-forest/15 blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
          style={{ filter: "blur(64px)" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-ember/10 blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.9, ease: "easeOut" }}
          style={{ filter: "blur(128px)" }}
        />
      </div>

      {/* Background video/image with gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
          style={{
            animation: "heroZoom 20s ease-out forwards",
            transformOrigin: "center center",
          }}
        />
        {/* Multi-layer gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/20 to-charcoal/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-transparent to-charcoal/40" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-charcoal/95 to-transparent" />
      </div>

      {/* Floating decorative particles */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-terracotta/30"
            style={{
              left: `${10 + i * 18}%`,
              top: `${20 + (i * 13) % 60}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              y: [0, -100, -200],
              x: [0, (i % 2 === 0 ? 50 : -50), (i % 2 === 0 ? 100 : -100)],
            }}
            transition={{
              duration: 8 + i,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 py-20 sm:px-12 lg:px-20">
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.2em] font-body">Scroll to explore</span>
          <motion.div
            className="w-1 h-8 rounded-full bg-terracotta/40 relative overflow-hidden"
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-cream"
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        <div className="relative z-10 w-full max-w-5xl">
          {/* Eyebrow with animated sparkles */}
          <motion.div
            className="inline-flex items-center gap-3 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 px-5 py-2 mb-6"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.span
              className="relative flex h-6 w-6 items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-terracotta" />
            </motion.span>
            <span className="font-body text-xs uppercase tracking-[0.25em] text-ember">
              Nigerian Kitchen & Grill
            </span>
            <motion.span
              className="relative flex h-6 w-6 items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-terracotta" />
            </motion.span>
          </motion.div>

          {/* Main headline - split lines for staggered animation */}
          <h1
            id="hero-title"
            className="flex flex-col gap-1 overflow-hidden"
          >
            {[
              { text: "Taste", delay: 0.4 },
              { text: "The", delay: 0.5 },
              { text: <span className="text-terracotta">Best</span>, delay: 0.6 },
            ].map(({ text, delay }, i) => (
              <motion.span
                key={i}
                className="font-display uppercase leading-[0.92] text-cream"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 6rem)",
                  lineHeight: "0.92",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
                initial={{ opacity: 0, y: 60, rotateX: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {text}
              </motion.span>
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            className="mt-6 max-w-2xl font-body text-cream/80 leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
          >
            Fresh ingredients, real hospitality, and a menu that goes from
            Sunday soup pots to Friday-night cocktails.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6, staggerChildren: 0.1 }}
          >
            {[
              { icon: Leaf, label: "Fresh Daily", delay: 0 },
              { icon: Truck, label: "24/7 Delivery", delay: 0.1 },
              { icon: Shield, label: "Quality Guaranteed", delay: 0.2 },
            ].map(({ icon: Icon, label, delay }, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-2 text-sm font-body text-cream/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + delay, duration: 0.5 }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/10 backdrop-blur-sm">
                  <Icon className="h-4 w-4 text-terracotta" />
                </div>
                <span>{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Group */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, type: "spring", stiffness: 100, damping: 15 }}
          >
            <Link
              href="/menu"
              className="group relative inline-flex items-center gap-3 rounded-full bg-terracotta px-8 py-4 text-base font-body font-semibold text-cream transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(242,185,11,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              <span>Explore Menu</span>
              <motion.span
                className="flex h-6 w-6 items-center justify-center"
                whileHover={{ x: 6, rotate: 45 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
            <Link
              href="/checkout"
              className="group relative inline-flex items-center gap-3 rounded-full border-2 border-cream/30 px-8 py-4 text-base font-body font-semibold text-cream transition-all duration-300 hover:border-cream hover:bg-cream/10 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              <span>Order Now</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.7 }}
          >
            {[
              { value: "50+", label: "Dishes" },
              { value: "5★", label: "Rating" },
              { value: "24/7", label: "Service" },
              { value: "100%", label: "Fresh" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + i * 0.08, duration: 0.5 }}
              >
                <div className="font-display text-3xl sm:text-4xl font-bold text-cream">
                  {stat.value}
                </div>
                <div className="mt-1 font-body text-xs uppercase tracking-[0.15em] text-cream/50">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}