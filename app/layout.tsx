import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import { ClientProviders } from "./providers";

export const metadata = {
  metadataBase: new URL("https://www.farm2pot.com.ng"),
  title: {
    default: "Farm2Pot And Grill | Nigerian Kitchen & Grill in Ajah, Lagos",
    template: "%s | Farm2Pot And Grill",
  },
  description:
    "Nigerian soups, rice, grills, pepper soups, fresh juices and cocktails from Farm2Pot And Grill in Ajah, Lagos. Order online for pickup or delivery. Open 24/7.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://www.farm2pot.com.ng",
    siteName: "Farm2Pot And Grill",
    title: "Farm2Pot And Grill | Nigerian Kitchen & Grill in Ajah, Lagos",
    description:
      "Nigerian soups, rice, grills, pepper soups, fresh juices and cocktails from Farm2Pot And Grill in Ajah, Lagos. Order online for pickup or delivery. Open 24/7.",
    images: [
      {
        url: "/hero.png",
        width: 1920,
        height: 1080,
        alt: "Farm2Pot And Grill signature dishes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farm2Pot And Grill | Nigerian Kitchen & Grill in Ajah, Lagos",
    description:
      "Nigerian soups, rice, grills, pepper soups, fresh juices and cocktails from Farm2Pot And Grill in Ajah, Lagos. Order online for pickup or delivery. Open 24/7.",
    images: ["/hero.png"],
  },
};

export const viewport = {
  themeColor: "#1B4A32",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Farm2Pot And Grill",
  url: "https://www.farm2pot.com.ng",
  logo: "https://www.farm2pot.com.ng/logo.png",
  image: "https://www.farm2pot.com.ng/hero.png",
  telephone: "+2348162470726",
  email: "farmtopotfood@gmail.com",
  servesCuisine: "Nigerian",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kit Court Street, Harris Drive",
    addressLocality: "Ajah",
    addressRegion: "Lagos",
    addressCountry: "NG",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  sameAs: [
    "https://instagram.com/Farm_2pot",
    "https://tiktok.com/@Farm2pot",
    "https://facebook.com/Farm2pot",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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