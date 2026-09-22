import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nissan Parts Finder | Dealership & Service Catalog",
  description: "Find the right Nissan part by vehicle and description. Professional automotive parts catalog for dealership personnel and technicians.",
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
