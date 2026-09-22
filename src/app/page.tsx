"use client";

import React, { useRef } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import {
  Layers,
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  Car,
  GitBranch,
  Calendar,
  Package,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const roadmapRef = useRef<HTMLDivElement>(null);

  const handleScrollToRoadmap = () => {
    roadmapRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Navigation Header */}
      <Header onReset={handleReset} />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero onFindPartClick={handleScrollToRoadmap} />

        {/* Phase 1 Foundation Overview & Architectural Status */}
        <section
          ref={roadmapRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-800/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Phase 1 Active: Project Foundation
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Automotive Parts Catalog Foundation
              </h2>
              <p className="mt-1.5 text-sm text-slate-400">
                Architected with Next.js 14, TypeScript, Tailwind CSS, and a normalized schema ready for PostgreSQL / Supabase.
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300">
                <Smartphone className="w-3.5 h-3.5 mr-1.5 text-red-400" />
                Mobile-First Responsive
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-700 text-slate-300">
                <Database className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                PostgreSQL / Supabase Ready
              </span>
            </div>
          </div>

          {/* Core 5-Step Search Flow Preview (Section 4) */}
          <div className="mb-14">
            <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-4 flex items-center gap-2">
              <span>Section 4: Core User Search Flow</span>
              <span className="h-px flex-1 bg-slate-800"></span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Step 1 */}
              <div className="relative p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/80 border border-red-800/60 text-red-300">
                    Step 1
                  </span>
                  <Car className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Select Model</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Terra, Navara, Almera, Kicks, X-Trail, Livina, Patrol, Urvan
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Step 2
                  </span>
                  <GitBranch className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Select Variant</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Filters specifically based on selected vehicle model (e.g. 2.5 VL 4x4 AT)
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Step 3
                  </span>
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Select Year</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Active production years compatible with model & variant (e.g. 2024)
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Step 4
                  </span>
                  <Package className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Part Description</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Partial text matching (e.g. &quot;Brake Pad&quot;, &quot;Oil Filter&quot;, &quot;Belt&quot;)
                </p>
              </div>

              {/* Step 5 */}
              <div className="relative p-5 rounded-xl bg-slate-900/70 border border-red-900/40 bg-gradient-to-b from-red-950/20 to-slate-900/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white shadow-sm">
                    Step 5
                  </span>
                  <Search className="w-4 h-4 text-red-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Search & Fitment</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Display verified compatible parts without irrelevant components
                </p>
              </div>
            </div>
          </div>

          {/* Architecture & Compliance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Normalized Data Model Readiness (Section 6) */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Section 6: Normalized Master Data Architecture
                </h4>
                <span className="text-xs text-slate-400 font-mono">Phase 2 Prepared</span>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                The application schema is completely decoupled from the presentation layer. Five relational entities ensure zero hardcoded vehicle or part catalogs in the frontend:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-white mb-1 text-[13px]">1. Vehicle Models</div>
                  <div className="text-slate-400 text-[11px] font-mono">id, model_name, model_code, active, timestamps</div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-white mb-1 text-[13px]">2. Vehicle Variants</div>
                  <div className="text-slate-400 text-[11px] font-mono">id, model_id, variant_name, engine, drivetrain</div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-white mb-1 text-[13px]">3. Vehicle Years</div>
                  <div className="text-slate-400 text-[11px] font-mono">id, model_id, year, active</div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-white mb-1 text-[13px]">4. Parts Master</div>
                  <div className="text-slate-400 text-[11px] font-mono">id, part_number, description, category, active</div>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 sm:col-span-2">
                  <div className="font-semibold text-white mb-1 text-[13px]">5. Part Compatibility Matrix</div>
                  <div className="text-slate-400 text-[11px] font-mono">id, part_id, model_id, variant_id, year_id, notes, active</div>
                </div>
              </div>
            </div>

            {/* Strict Automotive Demo Data Notice (Section 12) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900/60 to-slate-900/80 border border-amber-500/30 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Section 12 Notice: Demo Data</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  In strict accordance with Section 12 requirements, fabricated data is never represented as official Nissan parts information.
                </p>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 font-mono">
                  LABEL: DEMO DATA<br />
                  STATUS: Development sample only<br />
                  MIGRATION: Ready for official parts CSV/DB import in Phase 6.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Genuine OEM Specs</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Phased Roadmap Timeline */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-500" />
              Phased Engineering Lifecycle (9 Phases)
            </h3>
            <p className="text-xs text-slate-400 mb-8 max-w-3xl">
              Following strict incremental engineering principles: each phase is built, tested, and validated with customer approval before moving to the next.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-emerald-500/50 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-400">Phase 1: Project Foundation</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">Active</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Next.js 14, TypeScript, Tailwind CSS, core layout, normalized types, and repository setup.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-300">Phase 2: Database Architecture</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Next</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  PostgreSQL/Supabase schema, migration scripts, normalized seed data & query abstraction layer.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-300">Phase 3: Vehicle Selection UI</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Pending</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Progressive dropdown filters (Model → Variant → Year) with auto-reset cascade logic.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-300">Phase 4: Parts Search</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Pending</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Case-insensitive partial matching on part description with category tags and instant lookup.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-300">Phase 5: Results & Details</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Pending</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  High-density cards, table views, OEM part numbers, fitment notes, and modal detail views.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-300">Phases 6–9: Production Ready</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Pending</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  CSV import, admin management, security hardening, and Vercel production deployment.
                </p>
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
            <span>Phased Engineering Build</span>
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
