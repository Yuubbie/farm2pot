"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Share, Plus, ArrowUp } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if dismissed before
    const wasDismissed = sessionStorage.getItem("pwa_install_dismissed");
    if (wasDismissed) {
      setDismissed(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // For iOS or if beforeinstallprompt doesn't fire, show after delay
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        setShowPrompt(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(fallbackTimer);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    sessionStorage.setItem("pwa_install_dismissed", "true");
  };

  if (isInstalled || dismissed || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 left-6 right-6 z-[90] sm:left-auto sm:right-6 sm:max-w-sm"
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="rounded-2xl bg-cream border border-charcoal/10 shadow-elevation-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-charcoal">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/20">
                <Smartphone className="h-5 w-5 text-terracotta" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-cream">Install Farm2Pot</p>
                <p className="text-xs text-cream/60">Add to your home screen</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {showIOSInstructions ? (
              <>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                  To install Farm2Pot on your iOS device:
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-terracotta/10">
                      <Share className="h-4 w-4 text-terracotta" />
                    </div>
                    <p className="text-sm text-charcoal/70">Tap the Share button in Safari</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-terracotta/10">
                      <Plus className="h-4 w-4 text-terracotta" />
                    </div>
                    <p className="text-sm text-charcoal/70">Scroll down and tap "Add to Home Screen"</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-terracotta/10">
                      <ArrowUp className="h-4 w-4 text-terracotta" />
                    </div>
                    <p className="text-sm text-charcoal/70">Tap "Add" to confirm</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="mt-4 text-sm font-medium text-terracotta hover:underline"
                >
                  Back
                </button>
              </>
            ) : (
              <>
                <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                  Get faster access, offline support, and a native app experience. Install Farm2Pot on your device.
                </p>

                {/* Features */}
                <div className="mt-4 space-y-2">
                  {[
                    "Works offline",
                    "Faster loading",
                    "Native app feel",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-charcoal/60">
                      <svg className="h-4 w-4 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={handleInstall}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-4 py-2.5 text-sm font-semibold text-cream transition-all hover:bg-ember"
                  >
                    <Download className="h-4 w-4" />
                    {isIOS ? "How to Install" : "Install App"}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2.5 text-sm font-medium text-charcoal/60 transition-colors hover:text-charcoal"
                  >
                    Not now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}