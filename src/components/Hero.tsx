"use client";

import React from "react";
import { ArrowDown, Search, Cpu, CheckCircle2, Shield } from "lucide-react";

interface HeroProps {
  onFindPartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onFindPartClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-slate-800/60">
      {/* Background radial accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -top-12 right-12 w-72 h-72 bg-blue-600/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-red-500/20 text-xs font-semibold text-red-400 mb-6 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Automotive Dealership & Service Catalog
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans">
          NISSAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-400">PARTS FINDER</span>
        </h1>

        {/* Required Subtitle */}
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-normal">
          Find the right Nissan part by vehicle and description.
        </p>

        {/* Primary Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onFindPartClick}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 rounded-xl shadow-xl shadow-red-900/40 hover:shadow-red-800/60 border border-red-500/40 transition-all duration-200 active:scale-[0.98] w-full sm:w-auto"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>FIND A PART</span>
            <ArrowDown className="w-4 h-4 text-rose-200 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Value Highlights */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-red-400 font-semibold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Accurate Fitment</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pinpoint parts by Model, Variant, and Year without automotive technical confusion.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-red-400 font-semibold text-sm mb-1">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Genuine OEM Standards</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access genuine Nissan factory part numbers, component supersessions, and specifications.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-red-400 font-semibold text-sm mb-1">
              <Cpu className="w-4 h-4 shrink-0" />
              <span>Advisor & Tech Ready</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed for rapid front-counter lookups by service advisors, parts specialists, and mechanics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
