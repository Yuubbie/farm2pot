import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import { ClientProviders } from "./providers";

export const metadata = {
  title: "Farm2Pot And Grill",
  description:
    "Nigerian meals, grills, fresh juices, cocktails, milkshakes and more — from Farm2Pot's pot to yours.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
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
        <ClientProviders>
          <SplashScreen />
          <Navbar />
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}