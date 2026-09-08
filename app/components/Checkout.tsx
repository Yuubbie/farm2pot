"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useCart } from "../context/CartContext";
import Reveal from "./Reveal";

const WHATSAPP_NUMBER = "2347032352158";

function formatPrice(n: number) {
  return `₦${n.toLocaleString()}`;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function Checkout() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const canPay =
    items.length > 0 &&
    name.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    (deliveryType === "pickup" || address.trim() !== "");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const handlePay = () => {
    setError("");

    if (!publicKey) {
      setError(
        "Online payment isn't switched on yet — please order via WhatsApp instead."
      );
      return;
    }
    if (!window.PaystackPop) {
      setError("Payment is still loading — please try again in a moment.");
      return;
    }

    setPaying(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: Math.round(total * 100), // Paystack expects kobo
      currency: "NGN",
      ref: `f2p_${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: name },
          { display_name: "Phone", variable_name: "phone", value: phone },
        ],
      },
      callback: (response: { reference: string }) => {
        fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: response.reference,
            customer: { name, phone },
            items,
            total,
            deliveryType,
            address,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setPaying(false);
            if (data.success) {
              setSuccess(true);
              clearCart();
            } else {
              setError(
                data.error ||
                  "We couldn't confirm your payment. Please contact us on WhatsApp with your reference."
              );
            }
          })
          .catch(() => {
            setPaying(false);
            setError(
              "Something went wrong confirming your payment. Please contact us on WhatsApp."
            );
          });
      },
      onClose: () => {
        setPaying(false);
      },
    });

    handler.openIframe();
  };

  if (success) {
    return (
      <section className="bg-cream px-5 py-24 text-center sm:px-12">
        <h1 className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
          Order confirmed 🎉
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-charcoal/70">
          Thank you! We've received your payment and your order. We'll reach
          out on WhatsApp shortly to confirm the details.
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
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
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
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-charcoal/20 px-4 py-2.5 font-body focus:border-terracotta focus:outline-none"
                      placeholder="you@example.com"
                    />
                    <p className="mt-1 font-body text-xs text-charcoal/40">
                      Needed for your payment receipt.
                    </p>
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
                  onClick={handlePay}
                  disabled={!canPay || paying}
                  className="mt-8 w-full rounded-full bg-terracotta py-3.5 font-body font-semibold text-cream transition hover:bg-ember disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {paying ? "Processing..." : `Pay ${formatPrice(total)} with Paystack`}
                </button>

                <p className="mt-4 text-center font-body text-xs text-charcoal/40">
                  Or{" "}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    order via WhatsApp
                  </a>{" "}
                  instead.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
