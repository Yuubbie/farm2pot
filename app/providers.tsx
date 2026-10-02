"use client";

import { ReactNode } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/auth/AuthModal";
import { useAuth } from "./context/AuthContext";

function AuthModalWrapper() {
  const { user } = useAuth();

  if (user) return null;

  return <AuthModal />;
}

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <AuthProvider>
        <AuthModalWrapper />
        {children}
      </AuthProvider>
    </CartProvider>
  );
}