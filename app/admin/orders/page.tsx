"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "../../lib/supabase-browser";
import { formatPrice } from "../../lib/pricing";
import { Package, Truck, Clock, CheckCircle, XCircle, Search, Filter, ChevronLeft, ChevronRight, MoreVertical, Download } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  delivery_type: "pickup" | "delivery";
  address: string | null;
  status: "pending" | "confirmed" | "fulfilled" | "cancelled";
  payment_method: string;
}

const STATUSES = ["pending", "confirmed", "fulfilled", "cancelled"] as const;

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
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  const fetchOrders = async () => {
    const supabase = createClient();
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
      if (count !== null) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, search]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o))
      );
    } else {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
    setUpdating(null);
  };

  const filteredOrders = orders;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
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

  if (filteredOrders.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Package className="mx-auto h-16 w-16 text-charcoal/30" />
        <h2 className="mt-4 font-display text-xl font-semibold text-charcoal">No orders found</h2>
        <p className="mt-2 text-body text-charcoal/60">Try adjusting your search or filters</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Orders</h1>
          <p className="mt-1 text-body text-charcoal/60">Manage and track customer orders</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
            <input
              type="search"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-64 sm:w-80 rounded-xl border border-charcoal/20 bg-cream pl-10 pr-4 py-2.5 text-body text-charcoal placeholder-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-xl border border-charcoal/20 bg-cream px-4 py-2.5 text-body text-charcoal focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        className="rounded-2xl border border-charcoal/10 bg-cream overflow-hidden shadow-elevation-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal/10 bg-charcoal/5">
                <th className="px-5 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-charcoal/50">Order</th>
                <th className="px-5 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-charcoal/50">Customer</th>
                <th className="px-5 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-charcoal/50">Items</th>
                <th className="px-5 py-3 text-right font-body text-xs font-semibold uppercase tracking-wide text-charcoal/50">Total</th>
                <th className="px-5 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-charcoal/50">Status</th>
                <th className="px-5 py-3 text-left font-body text-xs font-semibold uppercase tracking-wide text-charcoal/50">Date</th>
                <th className="px-5 py-3 text-right font-body text-xs font-semibold uppercase tracking-wide text-charcoal/50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              {filteredOrders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <motion.tr
                    key={order.id}
                    className="hover:bg-charcoal/5 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-5 py-4">
                      <p className="font-display text-sm font-semibold text-charcoal">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-charcoal/50 capitalize">{order.delivery_type}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm font-medium text-charcoal">{order.customer_name || "—"}</p>
                      <p className="text-xs text-charcoal/50">{order.customer_phone || "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-charcoal/70">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                      <p className="text-xs text-charcoal/50">
                        {order.items.slice(0, 2).map((i) => i.name).join(", ")}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="font-display text-lg font-bold text-charcoal">{formatPrice(order.total)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border ${statusConfig.color}`}
                      >
                        <StatusIcon className={`h-3 w-3 ${statusConfig.iconColor}`} />
                        {statusConfig.label}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-charcoal/70">{formatDate(order.created_at)}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-charcoal/40 hover:text-terracotta transition-colors" aria-label="More actions">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-charcoal/10">
            <p className="text-sm text-charcoal/50">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/50 transition-colors hover:bg-charcoal/5 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/50 transition-colors hover:bg-charcoal/5 hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}