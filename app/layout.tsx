import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { Analytics } from "@vercel/analytics/next";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://www.brakenkie.co.za";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BrakEnKie French Bulldogs | Cradle of Humankind, South Africa",
    template: "%s | BrakEnKie French Bulldogs",
  },
  description:
    "Premium French Bulldog puppies raised with love on a 5-hectare farm in the Cradle of Humankind, South Africa. Health-tested, family-raised Frenchies available for adoption.",
  keywords: [
    "French Bulldog puppies South Africa",
    "French Bulldog breeder South Africa",
    "Frenchie puppies for sale",
    "French Bulldog puppies Gauteng",
    "French Bulldog puppies Johannesburg",
    "French Bulldog puppies Cradle of Humankind",
    "French Bulldog breeder Gauteng",
    "buy French Bulldog South Africa",
    "BrakEnKie French Bulldogs",
    "Frenchie breeder South Africa",
    "French Bulldog for sale Johannesburg",
    "French Bulldog for sale Cape Town",
    "French Bulldog for sale Pretoria",
    "quality French Bulldog puppies",
    "family-raised French Bulldogs",
  ],
  authors: [{ name: "BrakEnKie French Bulldogs" }],
  creator: "BrakEnKie French Bulldogs",
  publisher: "BrakEnKie French Bulldogs",
  category: "Pets & Animals",
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: "BrakEnKie French Bulldogs",
    title: "BrakEnKie French Bulldogs | Cradle of Humankind, South Africa",
    description:
      "Premium French Bulldog puppies raised with love on a 5-hectare farm in the Cradle of Humankind, South Africa.",
    images: [
      {
        url: "/Images/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "BrakEnKie French Bulldogs — Cradle of Humankind, South Africa",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (_) {}
})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AnimalShelter",
              "name": "BrakEnKie French Bulldogs",
              "description": "Premium French Bulldog puppies raised with love on a 5-hectare farm in the Cradle of Humankind, South Africa.",
              "url": "https://www.brakenkie.co.za",
              "logo": "https://www.brakenkie.co.za/Images/Logo.png",
              "image": "https://www.brakenkie.co.za/Images/hero.jpeg",
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "Gauteng",
                "addressCountry": "ZA",
                "addressLocality": "Cradle of Humankind"
              },
              "areaServed": {
                "@type": "Country",
                "name": "South Africa"
              },
              "sameAs": [
                "https://www.facebook.com/share/1FhgMQm5mx/?mibextid=wwXIfr",
                "https://www.instagram.com/brak_en_kie_frenchbulldogs"
              ],
              "breed": "French Bulldog",
              "knowsAbout": ["French Bulldog", "Frenchie", "French Bulldog breeding", "French Bulldog care"]
            }),
          }}
        />
      </head>
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
