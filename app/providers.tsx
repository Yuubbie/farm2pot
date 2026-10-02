"use client";

import { ReactNode, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/auth/AuthModal";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import { useAuth } from "./context/AuthContext";

function AuthModalWrapper() {
  const { user } = useAuth();

  if (user) return null;

  return <AuthModal />;
}

function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered:", registration.scope);
          })
          .catch((error) => {
            console.log("SW registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <AuthProvider>
        <ServiceWorkerRegistration />
        <AuthModalWrapper />
        <PWAInstallPrompt />
        {children}
      </AuthProvider>
    </CartProvider>
  );
}