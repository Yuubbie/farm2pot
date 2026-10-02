"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "../../lib/supabase-browser";
import { formatPrice } from "../../lib/pricing";
import { Package, Truck, Clock, CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  delivery_type: "pickup" | "delivery";
  address: string | null;
  status: "pending" | "confirmed" | "fulfilled" | "cancelled";
  payment_method: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200", iconColor: "text-amber-600" };
      case "confirmed":
        return { label: "Confirmed", icon: Package, color: "text-blue-600 bg-blue-50 border-blue-200", iconColor: "text-blue-600" };
      case "fulfilled":
        return { label: "Delivered", icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200", iconColor: "text-green-600" };
      case "cancelled":
        return { label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-50 border-red-200", iconColor: "text-red-600" };
      default:
        return { label: status, icon: Clock, color: "text-charcoal/60 bg-charcoal/50 border-charcoal/200", iconColor: "text-charcoal/60" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="rounded-2xl border border-charcoal/10 bg-cream p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-48 bg-charcoal/10 rounded" />
              <div className="h-6 w-24 bg-charcoal/10 rounded" />
            </div>
            <div className="mt-4 h-4 w-64 bg-charcoal/10 rounded" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Package className="mx-auto h-16 w-16 text-charcoal/30" />
        <h2 className="mt-4 font-display text-xl font-semibold text-charcoal">No orders yet</h2>
        <p className="mt-2 text-body text-charcoal/60">Your order history will appear here</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => {
        const statusConfig = getStatusConfig(order.status);
        const StatusIcon = statusConfig.icon;
        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

        return (
          <motion.div
            key={order.id}
            className="rounded-2xl border border-charcoal/10 bg-cream overflow-hidden shadow-elevation-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Order Header */}
            <button
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              className="w-full p-6 flex items-center justify-between gap-4 hover:bg-charcoal/5 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/10 flex-shrink-0">
                  <Package className="h-6 w-6 text-terracotta" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-charcoal truncate">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-charcoal/50">{formatDate(order.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="font-display text-lg font-bold text-charcoal">{formatPrice(order.total)}</p>
                  <p className="text-xs text-charcoal/50">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                </div>
                <motion.div
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${statusConfig.color}`}
                >
                  <StatusIcon className={`h-3 w-3 ${statusConfig.iconColor}`} />
                  {statusConfig.label}
                </motion.div>
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/5 text-charcoal/50 transition-colors hover:bg-charcoal/10"
                  animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                >
                  {expandedOrder === order.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </motion.div>
              </div>
            </button>

            {/* Expanded Order Details */}
            <AnimatePresence>
              {expandedOrder === order.id && (
                <motion.div
                  className="border-t border-charcoal/10 bg-charcoal/5 p-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Items */}
                    <div>
                      <h4 className="font-body text-sm font-semibold uppercase tracking-wide text-charcoal/50 mb-3">Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-charcoal/10 last:border-0">
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-sm font-medium text-charcoal truncate">{item.name}</p>
                              <p className="text-xs text-charcoal/50">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                            <p className="font-body text-sm font-semibold text-charcoal whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Details */}
                    <div>
                      <h4 className="font-body text-sm font-semibold uppercase tracking-wide text-charcoal/50 mb-3">Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-charcoal/70">
                          <Truck className="h-5 w-5 text-charcoal/40 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-charcoal/50">Delivery</p>
                            <p className="font-medium capitalize">{order.delivery_type}</p>
                          </div>
                        </div>
                        {order.address && (
                          <div className="flex items-start gap-3 text-sm text-charcoal/70">
                            <Package className="h-5 w-5 text-charcoal/40 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-charcoal/50">Address</p>
                              <p className="font-medium">{order.address}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-sm text-charcoal/70">
                          <Clock className="h-5 w-5 text-charcoal/40 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-charcoal/50">Payment</p>
                            <p className="font-medium capitalize">{order.payment_method.replace("_", " ")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}