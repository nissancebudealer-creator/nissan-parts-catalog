"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Layers,
  Database,
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Package,
  Wrench,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
import { PartEntity, VehicleModelEntity } from "@/types/catalog";
import { DataImportModal } from "@/components/DataImportModal";

const DEMO_PASSCODE = "nissan2024";

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"parts" | "vehicles" | "import-export">("parts");

  // Stats
  const [stats, setStats] = useState<any | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // Parts List Management
  const [parts, setParts] = useState<PartEntity[]>([]);
  const [partsSearchQuery, setPartsSearchQuery] = useState<string>("");
  const [partsCategoryFilter, setPartsCategoryFilter] = useState<string>("all");
  const [loadingParts, setLoadingParts] = useState<boolean>(false);

  // New Part Form
  const [showAddPartModal, setShowAddPartModal] = useState<boolean>(false);
  const [newPartNumber, setNewPartNumber] = useState("");
  const [newPartDescription, setNewPartDescription] = useState("");
  const [newPartCategory, setNewPartCategory] = useState("Brake System");
  const [newPartSubcategory, setNewPartSubcategory] = useState("");
  const [newPartNotes, setNewPartNotes] = useState("");
  const [addPartError, setAddPartError] = useState<string | null>(null);
  const [isSubmittingPart, setIsSubmittingPart] = useState(false);

  // Vehicle Models List
  const [models, setModels] = useState<VehicleModelEntity[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  // Data Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Load stats and parts upon login
  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadParts();
      loadModels();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === DEMO_PASSCODE) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError("Invalid access passcode. Hint: Use demo passkey 'nissan2024'");
    }
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success) setStats(json.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadParts = async () => {
    setLoadingParts(true);
    try {
      const params = new URLSearchParams();
      if (partsSearchQuery.trim()) params.append("query", partsSearchQuery.trim());
      if (partsCategoryFilter !== "all") params.append("category", partsCategoryFilter);

      const res = await fetch(`/api/admin/parts?${params.toString()}`);
      const json = await res.json();
      if (json.success) setParts(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingParts(false);
    }
  };

  const loadModels = async () => {
    setLoadingModels(true);
    try {
      const res = await fetch("/api/catalog/models");
      const json = await res.json();
      if (json.success) setModels(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartNumber || !newPartDescription || !newPartCategory) {
      setAddPartError("Please complete Part Number, Description, and Category.");
      return;
    }

    setIsSubmittingPart(true);
    setAddPartError(null);

    try {
      const res = await fetch("/api/admin/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          part_number: newPartNumber,
          part_description: newPartDescription,
          category: newPartCategory,
          subcategory: newPartSubcategory,
          notes: newPartNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create part");
      }

      setShowAddPartModal(false);
      setNewPartNumber("");
      setNewPartDescription("");
      setNewPartSubcategory("");
      setNewPartNotes("");
      loadParts();
      loadStats();
    } catch (err: any) {
      setAddPartError(err.message || "Failed to create part");
    } finally {
      setIsSubmittingPart(false);
    }
  };

  const handleDeletePart = async (id: string, partNumber: string) => {
    if (!confirm(`Are you sure you want to delete part ${partNumber}?`)) return;

    try {
      const res = await fetch(`/api/admin/parts?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        loadParts();
        loadStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/parts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      const json = await res.json();
      if (json.success) {
        loadParts();
        loadStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 1. Passcode Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="w-full max-w-md p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-center text-white">Dealership Admin Access</h2>
          <p className="text-xs text-center text-slate-400 mt-1 mb-6">
            Enter administrative passcode to manage Nissan catalog master data.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Admin Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Demo access code: <code className="text-red-400 font-mono">nissan2024</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              Sign In to Admin Console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customer Parts Finder</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/90 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  NISSAN <span className="text-red-500">ADMIN CONSOLE</span>
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800/50">
                  DEALERSHIP PORTAL
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              >
                <Car className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Parts Finder UI</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Vehicle Models
            </div>
            <div className="text-2xl font-black text-white">
              {stats?.totalModels ?? "--"}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              {stats?.activeModels ?? "--"} Active in Catalog
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Vehicle Variants
            </div>
            <div className="text-2xl font-black text-white">
              {stats?.totalVariants ?? "--"}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across All Models</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Master Parts
            </div>
            <div className="text-2xl font-black text-white">
              {stats?.totalParts ?? "--"}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              {stats?.activeParts ?? "--"} Active Parts
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Compatibility Links
            </div>
            <div className="text-2xl font-black text-white">
              {stats?.totalCompatibilities ?? "--"}
            </div>
            <div className="text-[11px] text-blue-400 mt-0.5">Relational Fitments</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-4 text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab("parts")}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === "parts"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Parts Master ({parts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("vehicles")}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === "vehicles"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Vehicle Models ({models.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("import-export")}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === "import-export"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Import / Export
          </button>
        </div>

        {/* TAB 1: PARTS MANAGER */}
        {activeTab === "parts" && (
          <div className="space-y-4">
            {/* Parts Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={partsSearchQuery}
                    onChange={(e) => setPartsSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadParts()}
                    placeholder="Search by part # or description..."
                    className="w-full px-3.5 py-2 pl-9 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                </div>

                <select
                  value={partsCategoryFilter}
                  onChange={(e) => {
                    setPartsCategoryFilter(e.target.value);
                    setTimeout(loadParts, 50);
                  }}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Brake System">Brake System</option>
                  <option value="Filters">Filters</option>
                  <option value="Engine">Engine</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Body">Body</option>
                  <option value="Air Conditioning">Air Conditioning</option>
                </select>

                <button
                  type="button"
                  onClick={loadParts}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                  title="Refresh Parts"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowAddPartModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Part Record</span>
              </button>
            </div>

            {/* Parts Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Part #</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Subcategory</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {parts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-red-400">
                        {p.part_number}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{p.part_description}</td>
                      <td className="py-3 px-4">{p.category}</td>
                      <td className="py-3 px-4 text-slate-400">{p.subcategory || "--"}</td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p.id, p.active)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                            p.active
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50"
                              : "bg-slate-900 text-slate-500 border border-slate-800"
                          }`}
                        >
                          {p.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeletePart(p.id, p.part_number)}
                          className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Delete part"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {parts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No parts match the selected query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: VEHICLES MASTER */}
        {activeTab === "vehicles" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              Normalized master vehicle models configured in PostgreSQL schema. Linked to dependent variants and production years.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {models.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-red-400">{m.model_code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                      Active
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Nissan {m.model_name}</h4>
                  <div className="text-[11px] text-slate-400 font-mono">ID: {m.id}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: IMPORT & EXPORT */}
        {activeTab === "import-export" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Import Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Bulk CSV / Excel Import</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload CSV or Excel spreadsheets containing vehicle models, variants, years, and part numbers. The importer automatically resolves relational integrity and inserts rows into the database.
              </p>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Launch CSV Importer</span>
              </button>
            </div>

            {/* Export Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Export Full Catalog</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download the entire Nissan automotive parts catalog including compatibility matrix records as standard CSV format compatible with Microsoft Excel.
              </p>
              <a
                href="/api/admin/export"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Export Catalog CSV</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Add Part Modal */}
      {showAddPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-500" />
                <span>Add New Part Record</span>
              </h3>
              <button
                onClick={() => setShowAddPartModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {addPartError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
                {addPartError}
              </div>
            )}

            <form onSubmit={handleCreatePart} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Part Number *</label>
                <input
                  type="text"
                  value={newPartNumber}
                  onChange={(e) => setNewPartNumber(e.target.value)}
                  placeholder="e.g. D1060-5X00A"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Part Description *</label>
                <input
                  type="text"
                  value={newPartDescription}
                  onChange={(e) => setNewPartDescription(e.target.value)}
                  placeholder="e.g. Front Brake Pad Set"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={newPartCategory}
                    onChange={(e) => setNewPartCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="Brake System">Brake System</option>
                    <option value="Filters">Filters</option>
                    <option value="Engine">Engine</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Body">Body</option>
                    <option value="Air Conditioning">Air Conditioning</option>
                    <option value="Lubricants">Lubricants</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={newPartSubcategory}
                    onChange={(e) => setNewPartSubcategory(e.target.value)}
                    placeholder="e.g. Pads & Rotors"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Engineering Notes</label>
                <textarea
                  rows={2}
                  value={newPartNotes}
                  onChange={(e) => setNewPartNotes(e.target.value)}
                  placeholder="Technical remarks, fitment instructions..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPartModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPart}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all"
                >
                  {isSubmittingPart ? "Creating..." : "Save Part"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={() => {
          loadParts();
          loadStats();
        }}
      />
    </div>
  );
}
