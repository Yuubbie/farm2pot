import Checkout from "../components/Checkout";

export const metadata = {
  title: "Order",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <main>
      <Checkout />
    </main>
  );
}