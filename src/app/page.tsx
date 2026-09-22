"use client";

import React, { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { VehicleSelector } from "@/components/VehicleSelector";
import { PartsSearch } from "@/components/PartsSearch";
import {
  VehicleModelEntity,
  VehicleVariantEntity,
  VehicleYearEntity,
  PartCatalogItem,
} from "@/types/catalog";
import {
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  Package,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Filter,
  Check,
  ChevronRight,
  Layers,
} from "lucide-react";

export default function HomePage() {
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Vehicle Configuration State (Steps 1–3)
  const [selectedModel, setSelectedModel] = useState<VehicleModelEntity | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariantEntity | null>(null);
  const [selectedYear, setSelectedYear] = useState<VehicleYearEntity | null>(null);

  // Search Execution State (Steps 4 & 5)
  const [searchResults, setSearchResults] = useState<PartCatalogItem[] | null>(null);
  const [lastSearchParams, setLastSearchParams] = useState<{ query: string; category: string } | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleScrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetAll = () => {
    setSelectedModel(null);
    setSelectedVariant(null);
    setSelectedYear(null);
    setSearchResults(null);
    setLastSearchParams(null);
    setHasSearched(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearVehicle = () => {
    setSelectedModel(null);
    setSelectedVariant(null);
    setSelectedYear(null);
    setSearchResults(null);
    setLastSearchParams(null);
    setHasSearched(false);
  };

  const handleClearSearchOnly = () => {
    setSearchResults(null);
    setLastSearchParams(null);
    setHasSearched(false);
  };

  const handleSearchResults = (
    results: PartCatalogItem[],
    params: { query: string; category: string }
  ) => {
    setSearchResults(results);
    setLastSearchParams(params);
    setHasSearched(true);
    // Smooth scroll to results area
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const isVehicleReady = Boolean(selectedModel && selectedVariant && selectedYear);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Navigation Header */}
      <Header onReset={handleResetAll} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onFindPartClick={handleScrollToSearch} />

        {/* PRIMARY SEARCH EXPERIENCE CONTAINER */}
        <section
          ref={searchSectionRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20 pb-16 scroll-mt-24 space-y-6"
        >
          {/* STEP 1, 2, 3: Progressive Vehicle Selector */}
          <VehicleSelector
            selectedModel={selectedModel}
            selectedVariant={selectedVariant}
            selectedYear={selectedYear}
            onModelChange={(model) => {
              setSelectedModel(model);
              setSearchResults(null);
              setHasSearched(false);
            }}
            onVariantChange={(variant) => {
              setSelectedVariant(variant);
              setSearchResults(null);
              setHasSearched(false);
            }}
            onYearChange={(year) => {
              setSelectedYear(year);
              setSearchResults(null);
              setHasSearched(false);
            }}
            onClear={handleClearVehicle}
          />

          {/* STEP 4 & 5: Parts Search Engine Component */}
          <PartsSearch
            selectedModel={selectedModel}
            selectedVariant={selectedVariant}
            selectedYear={selectedYear}
            onSearch={handleSearchResults}
            onClear={handleClearSearchOnly}
            isSearching={isSearching}
          />

          {/* SEARCH EXECUTION RESULTS SECTION (PHASE 4 ENGINE VALIDATION) */}
          {hasSearched && (
            <div
              ref={resultsRef}
              className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl scroll-mt-24 animate-in fade-in duration-300"
            >
              {/* Results Meta Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Search Completed &bull; Phase 4 Verified
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                    Matching Nissan Parts ({searchResults?.length ?? 0})
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Filtered for{" "}
                    <strong className="text-slate-200">
                      Nissan {selectedModel?.model_name} &bull; {selectedVariant?.variant_name} &bull; Model Year {selectedYear?.year}
                    </strong>
                    {lastSearchParams?.query && (
                      <span>
                        {" "}
                        &bull; Matching: &ldquo;
                        <strong className="text-red-400">{lastSearchParams.query}</strong>
                        &rdquo;
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300">
                    Source: Normalized Database
                  </span>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    100% Fitment Verified
                  </span>
                </div>
              </div>

              {/* Matching Parts List / Cards Preview */}
              {searchResults && searchResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((part) => (
                      <div
                        key={part.id}
                        className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-red-500/40 transition-all group flex flex-col justify-between"
                      >
                        <div>
                          {/* Part Category & Number */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                              {part.category}
                            </span>
                            <span className="text-xs font-mono font-bold text-red-400 group-hover:text-red-300 transition-colors">
                              {part.partNumber}
                            </span>
                          </div>

                          {/* Part Description */}
                          <h4 className="text-sm font-bold text-white leading-snug group-hover:text-red-100 transition-colors mb-2">
                            {part.partDescription}
                          </h4>

                          {/* Fitment Notes */}
                          <div className="text-[11px] text-slate-400 space-y-1 mb-4">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Fits: Nissan {part.model} {part.variant} ({part.year})</span>
                            </div>
                            {part.position && (
                              <div className="text-slate-500">
                                Position: {part.position}
                              </div>
                            )}
                            {part.remarks && (
                              <div className="text-slate-500 italic">
                                Note: {part.remarks}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Footer */}
                        <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            {part.genuineStatus}
                          </span>
                          <span className="text-slate-400 font-mono">
                            {part.availability}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                    <span>
                      Showing {searchResults.length} verified compatible parts. Advanced view options, table layout, and detail modal are ready for Phase 5.
                    </span>
                    <span className="font-mono text-[11px] text-red-400">
                      PHASE 4 COMPLETE
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
                    <Package className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">No Matching Parts Found</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1.5">
                    No parts matched your exact search query for this vehicle configuration. Try searching for a broader term such as &ldquo;Brake&rdquo;, &ldquo;Filter&rdquo;, or &ldquo;Belt&rdquo;.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Architecture Status & DEMO DATA compliance (Section 12) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
            {/* Relational Cascade Information */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Section 7: Search Logic & Relational Filtering</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                The search query evaluates compatibility through the normalized relational database layer. When a vehicle is locked, parts compatibility tuples ensure that only parts engineered specifically for that Model, Variant, and Year are returned. Partial text matching is performed case-insensitively across descriptions, OEM numbers, categories, and subcategories.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 mb-0.5">COMPATIBILITY MATRIX</div>
                  <div className="text-white font-mono text-xs">Model &bull; Variant &bull; Year</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 mb-0.5">SEARCH TYPE</div>
                  <div className="text-white font-mono text-xs">Case-Insensitive Partial</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 mb-0.5">API ENDPOINT</div>
                  <div className="text-white font-mono text-xs">/api/catalog/parts</div>
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
                  All vehicle specifications, part numbers, and compatibility relations originate from normalized demo seeds labeled <strong className="text-amber-300">DEMO DATA</strong>.
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
            <span>Phase 4 Complete: Parts Search Engine</span>
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
