"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type AuthMode = "signin" | "signup" | "reset";

// Global state for modal visibility
let modalState: { isOpen: boolean; mode: AuthMode } = { isOpen: false, mode: "signin" };
const listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function openAuthModal(mode: AuthMode = "signin") {
  modalState = { isOpen: true, mode };
  notifyListeners();
}

export function closeAuthModal() {
  modalState = { isOpen: false, mode: "signin" };
  notifyListeners();
}

function useAuthModal() {
  const [state, setState] = useState(modalState);
  useEffect(() => {
    const listener = () => setState({ ...modalState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return state;
}

function getErrorMessage(error: { message: string } | null): string {
  if (!error) return "";
  const msg = error.message.toLowerCase();
  if (msg.includes("already registered") || msg.includes("already exists")) {
    return "This email is already registered. Try signing in instead.";
  }
  if (msg.includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  if (msg.includes("password") && msg.includes("short")) {
    return "Password must be at least 6 characters.";
  }
  if (msg.includes("invalid login credentials") || msg.includes("invalid email or password")) {
    return "Invalid email or password. Please try again.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please check your email and confirm your account before signing in.";
  }
  if (msg.includes("rate limit") || msg.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }
  return error.message;
}

export default function AuthModal() {
  const { signIn, signUp, resetPassword, loading: authLoading } = useAuth();
  const { isOpen, mode: initialMode } = useAuthModal();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Sync mode with global state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      setSuccess("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      let result;
      if (mode === "signin") {
        result = await signIn(email, password);
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setSubmitting(false);
          return;
        }
        result = await signUp(email, password, fullName);
      } else if (mode === "reset") {
        result = await resetPassword(email);
      }

      if (result.error) {
        setError(getErrorMessage(result.error));
      } else {
        if (mode === "reset") {
          setSuccess("Password reset email sent! Check your inbox.");
          setMode("signin");
        } else if (mode === "signup") {
          setSuccess("Account created! Please check your email to verify your account.");
          setMode("signin");
        } else {
          closeAuthModal();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
  };

  const handleClose = () => {
    closeAuthModal();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <motion.div
          className="relative w-full max-w-md rounded-3xl bg-cream overflow-hidden shadow-elevation-4"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/10 text-charcoal/60 transition-all hover:bg-charcoal/20 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 id="auth-modal-title" className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
                {mode === "signin" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
              </h2>
              <p className="mt-2 text-body text-charcoal/60">
                {mode === "signin" ? "Sign in to access your orders and favorites" : mode === "signup" ? "Join Farm2Pot for a personalized experience" : "Enter your email to receive a reset link"}
              </p>
            </motion.div>

            {/* Success message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-green-800"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-red-800"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode !== "reset" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label htmlFor="fullName" className="block text-sm font-medium text-charcoal/70 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={mode === "signup"}
                      className="w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-3 pl-11 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                      placeholder="Your name"
                      autoComplete="name"
                      disabled={submitting}
                    />
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mode !== "reset" ? 0.2 : 0.15 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-charcoal/70 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-3 pl-11 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={submitting}
                  />
                </div>
              </motion.div>

              {(mode === "signin" || mode === "signup") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-charcoal/70 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-3 pl-11 pr-11 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                      placeholder="••••••••"
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      disabled={submitting}
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
                </motion.div>
              )}

              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal/70 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-3 pl-11 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={submitting}
                    />
                  </div>
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={submitting || authLoading}
                className="w-full rounded-full bg-terracotta py-3.5 text-base font-body font-semibold text-cream transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(242,185,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {submitting || authLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Please wait...
                  </span>
                ) : mode === "signin" ? (
                  "Sign In"
                ) : mode === "signup" ? (
                  "Create Account"
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>

            {/* Mode switcher */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {mode === "signin" && (
                <p className="text-sm text-charcoal/60">
                  Don&rsquo;t have an account?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-terracotta hover:underline transition-colors"
                  >
                    Create one
                  </button>
                </p>
              )}
              {mode === "signin" && (
                <button
                  onClick={() => switchMode("reset")}
                  className="mt-3 block text-sm font-medium text-terracotta hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              )}
              {mode === "signup" && (
                <p className="text-sm text-charcoal/60">
                  Already have an account?{" "}
                  <button
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-terracotta hover:underline transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              )}
              {mode === "reset" && (
                <p className="text-sm text-charcoal/60">
                  Remember your password?{" "}
                  <button
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-terracotta hover:underline transition-colors"
                  >
                    Back to sign in
                  </button>
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}