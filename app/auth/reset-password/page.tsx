"use client";

import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "../../lib/supabase-browser";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [validToken, setValidToken] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Check if we have a valid session from the email link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidToken(true);
      } else {
        setMessage({ type: "error", text: "This reset link has expired or is invalid. Please request a new one." });
      }
    });
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password updated successfully! Redirecting..." });
      setTimeout(() => {
        router.push("/account/orders");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-charcoal/60 hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Farm2Pot
        </Link>

        <div className="rounded-3xl bg-cream p-6 sm:p-8 shadow-elevation-2 border border-charcoal/10">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta/10">
              <Lock className="h-7 w-7 text-terracotta" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-semibold text-charcoal">
              Set New Password
            </h1>
            <p className="mt-2 text-body text-charcoal/60">
              Enter your new password below. It must be at least 6 characters.
            </p>
          </div>

          {message && (
            <motion.div
              className={`mb-6 flex items-center gap-3 rounded-xl p-4 ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{message.text}</p>
            </motion.div>
          )}

          {validToken && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-charcoal/70 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    className="w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-3 pl-11 pr-11 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal/60 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal/70 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    required
                    className="w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-3 pl-11 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={loading}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-terracotta py-3.5 text-base font-body font-semibold text-cream transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(242,185,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </motion.button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-charcoal/50">
            Remember your password?{" "}
            <Link href="/auth/callback?mode=signin" className="text-terracotta hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream px-5 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-cream p-6 sm:p-8 shadow-elevation-2 border border-charcoal/10 animate-pulse">
            <div className="text-center mb-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta/10">
                <Lock className="h-7 w-7 text-terracotta" />
              </div>
              <div className="mt-5 h-6 w-3/4 bg-charcoal/10 rounded mx-auto" />
              <div className="mt-2 h-4 w-1/2 bg-charcoal/10 rounded mx-auto" />
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-charcoal/10 rounded-xl" />
              <div className="h-12 bg-charcoal/10 rounded-xl" />
              <div className="h-12 bg-charcoal/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}