"use client";

import { ReactNode, useEffect, useState } from "react";
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
  const [swStatus, setSwStatus] = useState<string>("checking");

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      setSwStatus("unsupported");
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        setSwStatus("registered");
        console.log("SW registered:", registration.scope);

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // New content available
                console.log("New content available, refresh to update");
              }
            });
          }
        });
      } catch (error) {
        setSwStatus("error");
        console.error("SW registration failed:", error);
      }
    };

    // Register after page loads
    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
    }

    return () => {
      window.removeEventListener("load", registerSW);
    };
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