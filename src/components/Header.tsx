"use client";

import React from "react";
import { Wrench, ShieldCheck, RefreshCw, Car, Upload } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  onOpenImport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenImport }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-800 shadow-md shadow-red-950/50 border border-red-500/30">
              <Car className="w-6 h-6 text-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-red-500/50 flex items-center justify-center">
                <Wrench className="w-2.5 h-2.5 text-red-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase font-sans">
                  NISSAN <span className="text-red-500">PARTS FINDER</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950/80 text-red-300 border border-red-800/50 tracking-wide uppercase">
                  CATALOG SYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-tight">
                Dealership, Service & Workshop Catalog System
              </p>
            </div>
          </div>

          {/* Right Navigation / Controls */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Genuine & OEM Spec Verification</span>
            </div>

            {onOpenImport && (
              <button
                type="button"
                onClick={onOpenImport}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-300 hover:text-white bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/60 rounded-lg transition-all shadow-sm active:scale-95"
                title="Import parts data via CSV / Excel"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Import CSV</span>
              </button>
            )}

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all shadow-sm active:scale-95"
              title="Reset vehicle and part search filters"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset Form</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
