"use client";

import { motion } from "framer-motion";
import { reviews } from "../data/reviews";
import { Star } from "lucide-react";

export default function Testimonials() {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-cream px-5 py-16 sm:px-12 sm:py-20 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-body text-xs uppercase tracking-[0.2em] text-terracotta">
            Testimonials
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            What our customers say
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              className="rounded-2xl border border-charcoal/10 bg-cream p-6 shadow-elevation-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-terracotta text-terracotta" />
                ))}
              </div>
              <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10">
                  <span className="font-display text-sm font-semibold text-terracotta">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-charcoal">
                    {review.name}
                  </p>
                  {review.source && (
                    <p className="text-xs text-charcoal/50">{review.source}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}