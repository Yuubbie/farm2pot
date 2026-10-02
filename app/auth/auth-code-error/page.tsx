"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Mail, RefreshCw } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-charcoal">
          Authentication Error
        </h1>
        <p className="mt-3 text-body text-charcoal/60">
          We couldn&rsquo;t verify your email. The link may have expired or already been used.
        </p>
        <div className="mt-8 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 font-body font-semibold text-cream transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(242,185,11,0.4)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/20 bg-cream px-6 py-3 font-body font-semibold text-charcoal transition-all hover:border-terracotta hover:text-terracotta hover:bg-terracotta/5"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
        <p className="mt-6 text-sm text-charcoal/50">
          Still having issues?{" "}
          <a href="mailto:farmtopotfood@gmail.com" className="text-terracotta hover:underline font-medium">
            Contact support
          </a>
        </p>
      </motion.div>
    </div>
  );
}