import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import { CartProvider } from "./context/CartContext";

export const metadata = {
  title: "Farm2Pot And Grill",
  description:
    "Nigerian meals, grills, fresh juices, cocktails, milkshakes and more — from Farm2Pot's pot to yours.",
  manifest: "/manifest.json",
  icons: {
    // Android/Chrome read manifest.json for their icons already.
    // iOS Safari ignores the manifest for "Add to Home Screen" and needs
    // this dedicated tag instead — without it, iPhone users get a
    // screenshot of the page as their icon instead of the logo.
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#C6672B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body">
        <CartProvider>
          <SplashScreen />
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
