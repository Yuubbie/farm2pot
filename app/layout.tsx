import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";

export const metadata = {
  title: "Farm2Pot And Grill",
  description:
    "Nigerian meals, grills, fresh juices, cocktails, milkshakes and more — from Farm2Pot's pot to yours.",
  manifest: "/manifest.json",
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
        <SplashScreen />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
