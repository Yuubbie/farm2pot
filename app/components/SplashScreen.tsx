"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("f2p_splash_seen");
    if (seen) {
      setVisible(false);
      return;
    }

    let cancelled = false;
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      if (!cancelled) setFadingOut(true);
    }, 3500);

    const removeTimer = setTimeout(() => {
      if (!cancelled) {
        setVisible(false);
        document.body.style.overflow = "";
        sessionStorage.setItem("f2p_splash_seen", "true");
      }
    }, 4300);

    return () => {
      cancelled = true;
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal transition-opacity duration-500 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src="/logo.png"
        alt="Farm2Pot And Grill"
        className="h-36 w-36 rounded-full object-cover shadow-2xl sm:h-44 sm:w-44"
        style={{ animation: "splashPop 0.8s ease-out" }}
      />
      <p
        className="mt-6 font-display text-2xl font-semibold text-cream sm:text-3xl"
        style={{ animation: "splashFadeIn 0.8s ease-out 0.5s both" }}
      >
        Farm2Pot <span className="text-terracotta">&amp; Grill</span>
      </p>
      <p
        className="mt-2 font-body text-xs uppercase tracking-[0.3em] text-ember sm:text-sm"
        style={{ animation: "splashFadeIn 0.8s ease-out 0.8s both" }}
      >
        Fresh. Real. Wholesome.
      </p>
    </div>
  );
}
