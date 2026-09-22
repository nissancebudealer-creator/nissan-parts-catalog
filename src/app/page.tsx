"use client";

import React, { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { VehicleSelector } from "@/components/VehicleSelector";
import {
  VehicleModelEntity,
  VehicleVariantEntity,
  VehicleYearEntity,
} from "@/types/catalog";
import {
  Layers,
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  Package,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function HomePage() {
  const selectorRef = useRef<HTMLDivElement>(null);

  // Phase 3 Vehicle Configuration State
  const [selectedModel, setSelectedModel] = useState<VehicleModelEntity | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariantEntity | null>(null);
  const [selectedYear, setSelectedYear] = useState<VehicleYearEntity | null>(null);

  const handleScrollToSelector = () => {
    selectorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetAll = () => {
    setSelectedModel(null);
    setSelectedVariant(null);
    setSelectedYear(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSelector = () => {
    setSelectedModel(null);
    setSelectedVariant(null);
    setSelectedYear(null);
  };

  const isVehicleReady = Boolean(selectedModel && selectedVariant && selectedYear);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Navigation Header */}
      <Header onReset={handleResetAll} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onFindPartClick={handleScrollToSelector} />

        {/* PRIMARY VEHICLE SELECTION SECTION (PHASE 3) */}
        <section
          ref={selectorRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20 pb-16 scroll-mt-24"
        >
          {/* Vehicle Selector Interactive Card */}
          <VehicleSelector
            selectedModel={selectedModel}
            selectedVariant={selectedVariant}
            selectedYear={selectedYear}
            onModelChange={setSelectedModel}
            onVariantChange={setSelectedVariant}
            onYearChange={setSelectedYear}
            onClear={handleClearSelector}
          />

          {/* Phase 4 & 5 Search Gateway Preview */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isVehicleReady ? "bg-red-600 text-white shadow-lg shadow-red-900/40" : "bg-slate-800 text-slate-500"
                }`}>
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>STEP 4 & 5: Parts Search & Results</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Phase 4 & 5 Next
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isVehicleReady
                      ? `Vehicle locked: Nissan ${selectedModel?.model_name} ${selectedVariant?.variant_name} (${selectedYear?.year}). Ready for part search.`
                      : "Complete Steps 1–3 above to unlock part description search and verified compatibility matching."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  isVehicleReady ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-slate-800/80 text-slate-400 border border-slate-700"
                }`}>
                  {isVehicleReady ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Vehicle Ready
                    </>
                  ) : (
                    <>
                      <Filter className="w-3.5 h-3.5 mr-1" />
                      Awaiting Vehicle Configuration
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Inactive Search Bar Mock for Phase 3 */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3 opacity-60 pointer-events-none">
              <div className="sm:col-span-8">
                <input
                  type="text"
                  placeholder="Enter part description or OEM part number (e.g. Brake Pad, Oil Filter)..."
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
              <div className="sm:col-span-4">
                <button
                  disabled
                  className="w-full h-full py-3 px-4 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Parts (Phase 4)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Architecture Status & DEMO DATA compliance (Section 12) */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Relational Cascade Information */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Section 7: Progressive Cascading Architecture</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                The dropdowns above query the normalized database repository via live API endpoints. Selection of a model automatically filters variants, and selection of a variant filters active production years. Changing any parent level immediately resets downstream selections.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 mb-0.5">API ENDPOINT</div>
                  <div className="text-white font-mono text-xs">/api/catalog/models</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 mb-0.5">API ENDPOINT</div>
                  <div className="text-white font-mono text-xs">/api/catalog/variants</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 mb-0.5">API ENDPOINT</div>
                  <div className="text-white font-mono text-xs">/api/catalog/years</div>
                </div>
              </div>
            </div>

            {/* DEMO DATA Compliance Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900/60 to-slate-900/80 border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Section 12 Compliance</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Vehicle models, variants, and years currently rendered originate from normalized demo seeds labeled <strong className="text-amber-300">DEMO DATA</strong>.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[10px] text-amber-400">DEMO DATA MODE</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Automotive Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-bold text-slate-200">Nissan Automotive Parts Catalog</span>
            <span>&bull;</span>
            <span>Phase 3 Complete: Vehicle Selection UI</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-amber-400 font-medium">DEMO DATA MODE</span>
            <span>&bull;</span>
            <span>Next.js 14 &bull; TypeScript &bull; Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
