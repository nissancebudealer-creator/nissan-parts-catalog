import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0f19",
};

export const metadata: Metadata = {
  title: "Nissan Parts Finder | Automotive Parts Catalog",
  description:
    "Find the right Nissan automotive part based on vehicle model, variant, year, and part description. Dealership and service center parts catalog.",
  keywords: [
    "Nissan Parts",
    "Nissan Automotive Parts",
    "Parts Finder",
    "Nissan Terra",
    "Nissan Navara",
    "Nissan Almera",
    "Nissan Kicks",
    "OEM Parts",
    "Nissan Catalog",
  ],
  authors: [{ name: "Nissan Parts Finder Engineering" }],
  openGraph: {
    title: "Nissan Parts Finder | Automotive Parts Catalog",
    description: "Find the right Nissan automotive part based on vehicle configuration.",
    siteName: "Nissan Parts Finder",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nissan Parts Finder",
    description: "Find the right Nissan automotive part by Model, Variant, and Year.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-rose-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
