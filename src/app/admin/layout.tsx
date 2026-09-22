import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Nissan Parts Finder",
  description: "Dealership & catalog administration console for Nissan automotive parts master data.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
}
