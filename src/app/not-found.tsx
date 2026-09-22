import React from "react";
import Link from "next/link";
import { Car, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-800 text-red-500 border border-slate-700 flex items-center justify-center mx-auto mb-4">
          <Car className="w-6 h-6" />
        </div>

        <div className="text-4xl font-black text-red-500 font-mono mb-1">404</div>
        <h2 className="text-xl font-bold text-white uppercase font-sans">
          Page Not Found
        </h2>
        <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
          The catalog page, vehicle model, or route you requested does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Go to Parts Finder</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
