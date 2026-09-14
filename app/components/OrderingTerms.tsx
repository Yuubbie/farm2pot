import Link from "next/link";
import Reveal from "./Reveal";

const FREEZING_INFO = [
  "We do not accept urgent freezing orders.",
  "Meals require 4–5 days to freeze properly to maintain freshness and quality.",
  "All meals are freshly prepared and frozen only after payment has been confirmed.",
  "A ₦10,000 fee per meal applies for freezing and proper packaging for travel.",
  "Meals are carefully packed in ziplock bags and wrapped with bubble wrap to ensure they are well protected during transit.",
];

const TERMS = [
  {
    title: "1. Meal Preparation",
    body: "All meals are freshly prepared with care and tailored to each customer's preferences.",
  },
  {
    title: "2. Order Confirmation",
    body: "Orders are confirmed only upon receipt of payment.",
  },
  {
    title: "3. Storage Instructions",
    body: "Meals not intended for immediate consumption should be divided into portions and stored in the freezer immediately upon delivery, rather than freezing the entire container at once, to ensure optimal freshness and quality.",
  },
  {
    title: "4. Bowl Size Confirmation",
    body: "Customers can confirm their bowl size before order processing begins. First-time customers may request a video of the bowl to clearly see the portion size.",
  },
  {
    title: "5. Quality Concerns & Complaints",
    body: "We kindly request that you inspect your meals upon delivery and inform us of any concerns within 48 hours. For any errors or issues with your order, providing a short video or photo will help us verify the matter and resolve it quickly and accurately. Complaints reported after 48 hours, or those arising from storage or handling after delivery, may unfortunately be outside our ability to address. Your satisfaction is very important to us — we handle all feedback with professionalism, care, and attention.",
  },
  {
    title: "6. Meal Replacement",
    body: "If a meal gets bad while in transit, a replacement may be offered. Customers may choose the same meal or an alternative of equal value within the same price range. Replacement can only proceed after the affected meal has been picked up and verified.",
  },
  {
    title: "7. Allergies & Special Requests",
    body: "Customers with allergies or specific preferences should inform us before placing an order.",
  },
  {
    title: "8. Refund Policy",
    body: "Please note that we do not offer refunds.",
  },
  {
    title: "9. Delivery Times",
    body: "Delivery times may vary; we appreciate your patience as we strive to deliver fresh meals.",
  },
  {
    title: "10. Feedback",
    body: "We welcome all feedback and handle it professionally. Your satisfaction is important to us, and we are committed to ensuring you get full value for your money.",
  },
  {
    title: "11. Delivery Fees",
    body: "Delivery fees vary by location.",
  },
  {
    title: "12. Agreement",
    body: "By placing an order, customers acknowledge and accept these terms and conditions.",
  },
];

export default function OrderingTerms() {
  return (
    <section className="bg-cream px-5 py-14 sm:px-12 sm:py-24 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="font-body text-xs uppercase tracking-[0.2em] text-terracotta sm:text-sm">
            Please Read Before Ordering
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
            Freezing & Ordering Terms
          </h1>
          <p className="mt-3 font-body text-charcoal/70">
            This applies to bulk and freezer orders (soups, stews, rice, and
            similar items sold in 2L/3L/5L containers). Please read this
            fully before placing an order.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 rounded-2xl bg-forest p-6 text-cream sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ember">
              Freezing Orders — Important Information
            </h2>
            <ul className="mt-4 space-y-2.5 font-body text-cream/90">
              {FREEZING_INFO.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span className="text-ember">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-charcoal">
              Ordering Terms & Food Handling Policy
            </h2>
            <div className="mt-5 space-y-6">
              {TERMS.map((t) => (
                <div key={t.title}>
                  <h3 className="font-body text-sm font-semibold uppercase tracking-wide text-terracotta">
                    {t.title}
                  </h3>
                  <p className="mt-1 font-body text-charcoal/80">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-12 border-t border-charcoal/10 pt-6 text-center">
            <p className="font-body text-sm text-charcoal/60">
              Questions before you order?
            </p>
            <Link
              href="/contact"
              className="mt-2 inline-block font-body font-semibold text-terracotta underline"
            >
              Get in touch
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
