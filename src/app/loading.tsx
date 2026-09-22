import React from "react";
import { Loader2, Car } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 mb-4 shadow-inner">
        <Car className="w-7 h-7 animate-pulse" />
        <Loader2 className="w-12 h-12 text-red-500 animate-spin absolute" />
      </div>

      <div className="text-sm font-bold text-white uppercase tracking-wider">
        Loading Nissan Parts Catalog...
      </div>
      <p className="text-xs text-slate-500 mt-1">
        Accessing normalized master specifications & fitment database
      </p>
    </div>
  );
}
