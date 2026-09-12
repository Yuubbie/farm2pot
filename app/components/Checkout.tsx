"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import Reveal from "./Reveal";

const WHATSAPP_NUMBER = "2347032727893";

// Manual bank transfer details — Paystack is switched off for now until the
// client sets up her own Paystack account. This is the fallback payment
// method: customer transfers here, then confirms via WhatsApp.
const BANK_NAME = "Moniepoint";
const ACCOUNT_NUMBER = "8246098181";
const ACCOUNT_NAME = "Farm2Pot Kitchen";

function formatPrice(n: number) {
  return `₦${n.toLocaleString()}`;
}

export default function Checkout() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const canSend =
    items.length > 0 &&
    name.trim() !== "" &&
    phone.trim() !== "" &&
    (deliveryType === "pickup" || address.trim() !== "");

  function buildWhatsAppMessage() {
    const lines = [
      "New order — Farm2Pot And Grill",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      deliveryType === "delivery" ? `Delivery to: ${address}` : "Pickup",
      "",
      "Items:",
      ...items.map(
        (item) => `- ${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})`
      ),
      "",
      `Total: ${formatPrice(total)}`,
      "",
      "Payment: Bank Transfer",
      `Bank: ${BANK_NAME}`,
      `Account Number: ${ACCOUNT_NUMBER}`,
      `Account Name: ${ACCOUNT_NAME}`,
      "",
      "I'll send proof of payment here to confirm my order.",
    ];
    return lines.join("\n");
  }

  const handleSendOrder = async () => {
    setError("");
    setSending(true);

    // Save the order (status: pending) so it isn't lost if the customer
    // never actually opens WhatsApp. Payment itself is confirmed manually
    // once the transfer and proof come in.
    try {
      await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone },
          items,
          total,
          deliveryType,
          address,
        }),
      });
    } catch (err) {
      console.error("Failed to save order record:", err);
      // Don't block the WhatsApp handoff just because the record didn't save.
    }

    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

    setSending(false);
    setSuccess(true);
    clearCart();
  };

  if (success) {
    return (
      <section className="bg-cream px-5 py-24 text-center sm:px-12">
        <h1 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
          Order sent 🎉
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-charcoal/70">
          We've opened WhatsApp with your order and our bank transfer
          details. Please complete the transfer and send proof of payment
          there so we can start preparing your order.
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-block rounded-full bg-terracotta px-8 py-3 font-body font-semibold text-cream transition hover:bg-ember"
        >
          Back to Menu
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="bg-cream px-5 py-14 sm:px-12 sm:py-24 lg:px-20">
        <Reveal>
          <div className="mx-auto max-w-2xl">
            <span className="font-body text-xs uppercase tracking-[0.2em] text-terracotta sm:text-sm">
              Checkout
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold text-charcoal sm:text-4xl lg:text-5xl">
              Let&rsquo;s get your pot ready
            </h1>

            {items.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-charcoal/10 p-8 text-center">
                <p className="font-body text-charcoal/70">
                  Your cart is empty. Browse the menu and add a few dishes to
                  get started.
                </p>
                <Link
                  href="/menu"
                  className="mt-6 inline-block rounded-full bg-terracotta px-6 py-2.5 font-body text-sm font-semibold text-cream transition hover:bg-ember"
                >
                  View Menu
                </Link>
                <p className="mt-6 font-body text-sm text-charcoal/50">
                  Prefer to order directly?{" "}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Chat with us on WhatsApp
                  </a>
                </p>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div className="mt-8 divide-y divide-charcoal/10 rounded-2xl border border-charcoal/10">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <div>
                        <p className="font-body font-medium text-charcoal">
                          {item.name}
                        </p>
                        <p className="font-body text-sm text-charcoal/50">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/70 transition hover:border-terracotta hover:text-terracotta"
                        >
                          −
                        </button>
                        <span className="w-5 text-center font-body">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-charcoal/20 text-charcoal/70 transition hover:border-terracotta hover:text-terracotta"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-2 font-body text-xs text-charcoal/40 transition hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t border-charcoal/10 pt-4 font-body">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-semibold text-terracotta">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Customer details form */}
                <div className="mt-10 space-y-4">
                  <div>
                    <label className="font-body text-sm font-medium text-charcoal">
                      Full Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-charcoal/20 px-4 py-2.5 font-body focus:border-terracotta focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-charcoal">
                      Email <span className="font-normal text-charcoal/40">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-charcoal/20 px-4 py-2.5 font-body focus:border-terracotta focus:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-charcoal">
                      Phone (WhatsApp)
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-charcoal/20 px-4 py-2.5 font-body focus:border-terracotta focus:outline-none"
                      placeholder="0803..."
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-charcoal">
                      Pickup or Delivery?
                    </label>
                    <div className="mt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType("pickup")}
                        className={`rounded-full px-5 py-2 font-body text-sm font-semibold transition ${
                          deliveryType === "pickup"
                            ? "bg-charcoal text-cream"
                            : "bg-charcoal/5 text-charcoal/70"
                        }`}
                      >
                        Pickup
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType("delivery")}
                        className={`rounded-full px-5 py-2 font-body text-sm font-semibold transition ${
                          deliveryType === "delivery"
                            ? "bg-charcoal text-cream"
                            : "bg-charcoal/5 text-charcoal/70"
                        }`}
                      >
                        Delivery
                      </button>
                    </div>
                    {deliveryType === "delivery" && (
                      <p className="mt-2 font-body text-xs text-charcoal/50">
                        Delivery via Bolt/InDrive, arranged separately at
                        their standard rate.
                      </p>
                    )}
                  </div>

                  {deliveryType === "delivery" && (
                    <div>
                      <label className="font-body text-sm font-medium text-charcoal">
                        Delivery Address
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-charcoal/20 px-4 py-2.5 font-body focus:border-terracotta focus:outline-none"
                        placeholder="Street, area, landmark"
                      />
                    </div>
                  )}
                </div>

                {error && (
                  <p className="mt-4 font-body text-sm text-red-600">{error}</p>
                )}

                <button
                  onClick={handleSendOrder}
                  disabled={!canSend || sending}
                  className="mt-8 w-full rounded-full bg-terracotta py-3.5 font-body font-semibold text-cream transition hover:bg-ember disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "Sending..." : `Send Order (${formatPrice(total)}) via WhatsApp`}
                </button>

                <p className="mt-4 text-center font-body text-xs text-charcoal/40">
                  You'll get our bank transfer details on WhatsApp — send
                  proof of payment there to confirm your order.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
