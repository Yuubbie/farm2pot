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
      {/* Organic gradient background - natural earth tones */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 10%, rgba(27, 74, 50, 0.9) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 80% 90%, rgba(34, 100, 64, 0.7) 0%, transparent 50%),
              radial-gradient(ellipse 40% 40% at 50% 50%, rgba(242, 185, 11, 0.08) 0%, transparent 60%),
              linear-gradient(160deg, #1B4A32 0%, #0F2D1F 40%, #1B4A32 70%, #0A1F14 100%)
            `,
          }}
        />
      </div>

      {/* Subtle grain texture overlay - natural feel */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* Organic floating shapes - natural movement */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Large soft blob - top left */}
        <motion.div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(242, 185, 11, 0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Medium blob - bottom right */}
        <motion.div
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(34, 100, 64, 0.25) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small accent blob - center right */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(246, 217, 92, 0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating leaf particles - natural movement */}
        {[
          { x: "15%", y: "20%", size: 8, delay: 0 },
          { x: "75%", y: "30%", size: 6, delay: 2 },
          { x: "25%", y: "70%", size: 10, delay: 4 },
          { x: "85%", y: "60%", size: 7, delay: 1 },
          { x: "50%", y: "15%", size: 5, delay: 3 },
          { x: "60%", y: "80%", size: 9, delay: 5 },
        ].map((leaf, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: leaf.x,
              top: leaf.y,
              width: leaf.size,
              height: leaf.size,
              background: "rgba(242, 185, 11, 0.15)",
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, rgba(10, 31, 20, 0.4) 100%)",
        }}
      />

      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 py-20 sm:px-12 lg:px-20">
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.2em] font-body">Scroll to explore</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-terracotta/60 to-transparent"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="relative z-10 w-full max-w-5xl">
          {/* Eyebrow - natural, understated */}
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <span className="h-px w-8 bg-terracotta/40" />
            <span className="font-body text-xs uppercase tracking-[0.3em] text-ember/80">
              Nigerian Kitchen & Grill
            </span>
            <span className="h-px w-8 bg-terracotta/40" />
          </motion.div>

          {/* Main headline - elegant, natural typography */}
          <h1
            id="hero-title"
            className="flex flex-col gap-2 overflow-hidden"
          >
            {[
              { text: "Taste", delay: 0.4 },
              { text: "The", delay: 0.55 },
              { text: <span className="text-terracotta">Best</span>, delay: 0.7 },
            ].map(({ text, delay }, i) => (
              <motion.span
                key={i}
                className="font-display uppercase leading-[0.95] text-cream"
                style={{
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                  lineHeight: "0.95",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {text}
              </motion.span>
            ))}
          </h1>

          {/* Subheadline - warm, inviting */}
          <motion.p
            className="mt-8 max-w-xl font-body text-cream/70 leading-relaxed"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
          >
            Fresh ingredients, real hospitality, and a menu that goes from
            Sunday soup pots to Friday-night cocktails.
          </motion.p>

          {/* Trust badges - subtle, natural */}
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            {[
              { icon: Leaf, label: "Fresh Daily" },
              { icon: Truck, label: "24/7 Service" },
              { icon: Shield, label: "Quality Guaranteed" },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-2 text-sm font-body text-cream/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
              >
                <Icon className="h-4 w-4 text-terracotta/60" />
                <span>{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Group - natural, inviting buttons */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
          >
            <Link
              href="/menu"
              className="group relative inline-flex items-center gap-3 rounded-full bg-terracotta px-8 py-4 text-base font-body font-semibold text-cream transition-all duration-500 hover:bg-ember hover:shadow-[0_0_50px_rgba(242,185,11,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              <span>Explore Menu</span>
              <motion.span
                className="flex h-5 w-5 items-center justify-center"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
            <Link
              href="/checkout"
              className="group inline-flex items-center gap-3 rounded-full border border-cream/20 px-8 py-4 text-base font-body font-semibold text-cream/80 transition-all duration-500 hover:border-cream/40 hover:text-cream hover:bg-cream/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              <span>Order Now</span>
            </Link>
          </motion.div>

          {/* Stats bar - understated elegance */}
          <motion.div
            className="mt-24 grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + i * 0.1, duration: 0.5 }}
              >
                <div className="font-display text-3xl sm:text-4xl font-semibold text-cream/90">
                  {stat.value}
                </div>
                <div className="mt-1 font-body text-xs uppercase tracking-[0.15em] text-cream/40">
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