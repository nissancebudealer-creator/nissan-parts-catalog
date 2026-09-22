"use client";

import React, { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { VehicleSelector } from "@/components/VehicleSelector";
import { PartsSearch } from "@/components/PartsSearch";
import { SearchResults } from "@/components/SearchResults";
import { PartDetailModal } from "@/components/PartDetailModal";
import { DataImportModal } from "@/components/DataImportModal";
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
  Upload,
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

  // Part Detail Modal State (Phase 5)
  const [selectedPartForModal, setSelectedPartForModal] = useState<PartCatalogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Data Import Modal State (Phase 6)
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

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
    setSelectedPartForModal(null);
    setIsModalOpen(false);
    setIsImportModalOpen(false);
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

  const handleOpenPartModal = (part: PartCatalogItem) => {
    setSelectedPartForModal(part);
    setIsModalOpen(true);
  };

  const handleClosePartModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Navigation Header with Reset & CSV Import */}
      <Header
        onReset={handleResetAll}
        onOpenImport={() => setIsImportModalOpen(true)}
      />

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

          {/* SEARCH RESULTS & PART DETAILS (PHASE 5) */}
          {hasSearched && searchResults !== null && (
            <div ref={resultsRef} className="scroll-mt-24">
              <SearchResults
                parts={searchResults}
                modelName={selectedModel?.model_name}
                variantName={selectedVariant?.variant_name}
                year={selectedYear?.year}
                searchQuery={lastSearchParams?.query}
                category={lastSearchParams?.category}
                onSelectPart={handleOpenPartModal}
              />
            </div>
          )}

          {/* Bulk Data Import Promotion Card (Phase 6) */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900/60 to-slate-900/80 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Dealership Parts Data Import</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
                    Phase 6 Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Import thousands of Nissan parts via CSV or Excel with automatic vehicle model, variant, and year compatibility mapping.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm self-start md:self-auto shrink-0 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Launch CSV Importer</span>
            </button>
          </div>

          {/* Architecture Status & DEMO DATA compliance (Section 12) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            {/* Relational Cascade Information */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Section 10: Scalable Parts Data Architecture</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                The database and API layer are engineered to scale to thousands of parts. The importer automatically resolves existing vehicle models and variants, creates missing year associations, and forms relational compatibility links without frontend code modification.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 mb-0.5">IMPORT FORMAT</div>
                  <div className="text-white font-mono text-xs">CSV / Excel UTF-8</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 mb-0.5">IMPORT API</div>
                  <div className="text-white font-mono text-xs">POST /api/admin/import</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 mb-0.5">VALIDATION</div>
                  <div className="text-white font-mono text-xs">Row-level sanitization</div>
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
                  The system enables replacing development demo data with verified factory Nissan parts spreadsheets at any time.
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

      {/* Part Detail Modal (Phase 5) */}
      <PartDetailModal
        part={selectedPartForModal}
        isOpen={isModalOpen}
        onClose={handleClosePartModal}
      />

      {/* Data Import Modal (Phase 6) */}
      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={() => {
          // Trigger catalog refresh
        }}
      />

      {/* Automotive Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-bold text-slate-200">Nissan Automotive Parts Catalog</span>
            <span>&bull;</span>
            <span>Phase 6 Complete: Bulk Data Import Engine</span>
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
