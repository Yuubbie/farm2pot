"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { Package, Users, ShoppingBag, Settings, LogOut, ChevronLeft } from "lucide-react";

const ADMIN_EMAILS = ["admin@farm2pot.com.ng", "farmtopotfood@gmail.com", "ubongemmanuel2107@gmail.com"]; // Add admin emails here

const navItems = [
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/menu", label: "Menu", icon: ShoppingBag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-terracotta border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-12 lg:px-20">
        {/* Back to site */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-charcoal/60 hover:text-terracotta transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Farm2Pot
        </Link>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="rounded-2xl border border-charcoal/10 bg-cream p-6 shadow-elevation-1">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-charcoal/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta/10">
                  <Package className="h-7 w-7 text-terracotta" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-charcoal">Admin Panel</p>
                  <p className="text-sm text-charcoal/50 truncate max-w-[140px]">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal/70 hover:bg-terracotta/5 hover:text-terracotta transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <button
                onClick={handleSignOut}
                className="mt-6 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}