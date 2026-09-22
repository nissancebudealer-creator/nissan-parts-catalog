"use client";

import React, { useState, useEffect } from "react";
import {
  Car,
  GitBranch,
  Calendar,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  VehicleModelEntity,
  VehicleVariantEntity,
  VehicleYearEntity,
} from "@/types/catalog";

interface VehicleSelectorProps {
  selectedModel: VehicleModelEntity | null;
  selectedVariant: VehicleVariantEntity | null;
  selectedYear: VehicleYearEntity | null;
  onModelChange: (model: VehicleModelEntity | null) => void;
  onVariantChange: (variant: VehicleVariantEntity | null) => void;
  onYearChange: (year: VehicleYearEntity | null) => void;
  onClear: () => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedModel,
  selectedVariant,
  selectedYear,
  onModelChange,
  onVariantChange,
  onYearChange,
  onClear,
}) => {
  // State for dynamic options from database API
  const [models, setModels] = useState<VehicleModelEntity[]>([]);
  const [variants, setVariants] = useState<VehicleVariantEntity[]>([]);
  const [years, setYears] = useState<VehicleYearEntity[]>([]);

  // Loading states
  const [loadingModels, setLoadingModels] = useState<boolean>(true);
  const [loadingVariants, setLoadingVariants] = useState<boolean>(false);
  const [loadingYears, setLoadingYears] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch Models on mount (Step 1)
  useEffect(() => {
    let isMounted = true;
    async function loadModels() {
      setLoadingModels(true);
      setErrorMessage(null);
      try {
        const res = await fetch("/api/catalog/models");
        if (!res.ok) throw new Error("Failed to load vehicle models");
        const json = await res.json();
        if (isMounted && json.success) {
          setModels(json.data || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err.message || "Failed to load models");
        }
      } finally {
        if (isMounted) setLoadingModels(false);
      }
    }
    loadModels();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Variants when Model changes (Step 2)
  useEffect(() => {
    let isMounted = true;
    if (!selectedModel) {
      setVariants([]);
      return;
    }

    async function loadVariants() {
      setLoadingVariants(true);
      setErrorMessage(null);
      try {
        const res = await fetch(`/api/catalog/variants?modelId=${encodeURIComponent(selectedModel!.id)}`);
        if (!res.ok) throw new Error("Failed to load vehicle variants");
        const json = await res.json();
        if (isMounted && json.success) {
          setVariants(json.data || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err.message || "Failed to load variants");
        }
      } finally {
        if (isMounted) setLoadingVariants(false);
      }
    }
    loadVariants();
    return () => {
      isMounted = false;
    };
  }, [selectedModel]);

  // 3. Fetch Years when Variant changes (Step 3)
  useEffect(() => {
    let isMounted = true;
    if (!selectedModel || !selectedVariant) {
      setYears([]);
      return;
    }

    const currentModel = selectedModel;
    const currentVariant = selectedVariant;

    async function loadYears() {
      setLoadingYears(true);
      setErrorMessage(null);
      try {
        const res = await fetch(
          `/api/catalog/years?modelId=${encodeURIComponent(currentModel.id)}&variantId=${encodeURIComponent(currentVariant.id)}`
        );
        const json = await res.json();
        if (isMounted && json.success) {
          setYears(json.data || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err.message || "Failed to load years");
        }
      } finally {
        if (isMounted) setLoadingYears(false);
      }
    }
    loadYears();
    return () => {
      isMounted = false;
    };
  }, [selectedModel, selectedVariant]);

  // Handlers with automatic cascade reset (Section 7)
  const handleModelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    if (!modelId) {
      onModelChange(null);
      onVariantChange(null);
      onYearChange(null);
      return;
    }
    const found = models.find((m) => m.id === modelId) || null;
    onModelChange(found);
    onVariantChange(null); // Reset step 2 & 3 cascade
    onYearChange(null);
  };

  const handleVariantSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variantId = e.target.value;
    if (!variantId) {
      onVariantChange(null);
      onYearChange(null);
      return;
    }
    const found = variants.find((v) => v.id === variantId) || null;
    onVariantChange(found);
    onYearChange(null); // Reset step 3 cascade
  };

  const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const yearVal = e.target.value;
    if (!yearVal) {
      onYearChange(null);
      return;
    }
    const found = years.find((y) => y.year.toString() === yearVal) || null;
    onYearChange(found);
  };

  const isConfigurationComplete = Boolean(selectedModel && selectedVariant && selectedYear);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md">
      {/* Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Vehicle Configuration
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/50">
              Steps 1–3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Progressively specify vehicle to guarantee 100% accurate OEM fitment.
          </p>
        </div>

        {/* Secondary Action: Start Over / Clear (Section 8) */}
        {(selectedModel || selectedVariant || selectedYear) && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all active:scale-95 self-start sm:self-auto"
            title="Clear all selections and start over"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Start Over</span>
          </button>
        )}
      </div>

      {/* Error alert if API fails */}
      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3 Progressive Cascade Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* STEP 1: Select Model */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="model-select"
              className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
            >
              <Car className="w-3.5 h-3.5 text-red-500" />
              <span>STEP 1: Select Model</span>
            </label>
            {loadingModels && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
          </div>

          <div className="relative">
            <select
              id="model-select"
              value={selectedModel?.id || ""}
              onChange={handleModelSelect}
              disabled={loadingModels}
              className={`w-full appearance-none px-4 py-3.5 sm:py-4 rounded-xl text-sm font-medium bg-slate-950 border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                selectedModel
                  ? "border-red-500/60 text-white bg-red-950/10"
                  : "border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <option value="">
                {loadingModels ? "Loading Nissan models..." : "— Choose Nissan Model —"}
              </option>
              {models.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-950 text-white">
                  Nissan {m.model_name} ({m.model_code})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
          </div>
        </div>

        {/* STEP 2: Select Variant */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="variant-select"
              className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                selectedModel ? "text-slate-300" : "text-slate-500"
              }`}
            >
              <GitBranch className={`w-3.5 h-3.5 ${selectedModel ? "text-red-500" : "text-slate-600"}`} />
              <span>STEP 2: Select Variant</span>
            </label>
            {loadingVariants && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
          </div>

          <div className="relative">
            <select
              id="variant-select"
              value={selectedVariant?.id || ""}
              onChange={handleVariantSelect}
              disabled={!selectedModel || loadingVariants}
              className={`w-full appearance-none px-4 py-3.5 sm:py-4 rounded-xl text-sm font-medium bg-slate-950 border transition-all ${
                !selectedModel
                  ? "border-slate-800/40 text-slate-600 cursor-not-allowed bg-slate-950/50"
                  : selectedVariant
                  ? "border-red-500/60 text-white bg-red-950/10 cursor-pointer"
                  : "border-slate-800 text-slate-300 hover:border-slate-700 cursor-pointer focus:ring-2 focus:ring-red-500/50"
              }`}
            >
              <option value="">
                {!selectedModel
                  ? "— Select model first —"
                  : loadingVariants
                  ? "Loading variants..."
                  : `— Choose ${selectedModel.model_name} Variant —`}
              </option>
              {variants.map((v) => (
                <option key={v.id} value={v.id} className="bg-slate-950 text-white">
                  {v.variant_name} ({v.drivetrain})
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                selectedModel ? "text-slate-400" : "text-slate-700"
              }`}
            />
          </div>
        </div>

        {/* STEP 3: Select Year */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="year-select"
              className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                selectedVariant ? "text-slate-300" : "text-slate-500"
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${selectedVariant ? "text-red-500" : "text-slate-600"}`} />
              <span>STEP 3: Select Year</span>
            </label>
            {loadingYears && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
          </div>

          <div className="relative">
            <select
              id="year-select"
              value={selectedYear?.year.toString() || ""}
              onChange={handleYearSelect}
              disabled={!selectedVariant || loadingYears}
              className={`w-full appearance-none px-4 py-3.5 sm:py-4 rounded-xl text-sm font-medium bg-slate-950 border transition-all ${
                !selectedVariant
                  ? "border-slate-800/40 text-slate-600 cursor-not-allowed bg-slate-950/50"
                  : selectedYear
                  ? "border-red-500/60 text-white bg-red-950/10 cursor-pointer"
                  : "border-slate-800 text-slate-300 hover:border-slate-700 cursor-pointer focus:ring-2 focus:ring-red-500/50"
              }`}
            >
              <option value="">
                {!selectedVariant
                  ? "— Select variant first —"
                  : loadingYears
                  ? "Loading years..."
                  : `— Choose Production Year —`}
              </option>
              {years.map((y) => (
                <option key={y.id} value={y.year.toString()} className="bg-slate-950 text-white">
                  Model Year {y.year}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                selectedVariant ? "text-slate-400" : "text-slate-700"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Configuration Status Banner */}
      <div className="mt-6 pt-5 border-t border-slate-800/80">
        {isConfigurationComplete ? (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  Vehicle Configured & Fitment Locked
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Nissan {selectedModel?.model_name} &bull; {selectedVariant?.variant_name} &bull; Year {selectedYear?.year}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Engine: {selectedVariant?.engine} &bull; Transmission: {selectedVariant?.transmission}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/30 text-emerald-300">
                READY FOR PART SEARCH (PHASE 4)
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {!selectedModel
                  ? "Select a vehicle model above to begin filtering compatible parts."
                  : !selectedVariant
                  ? `Select a variant for Nissan ${selectedModel.model_name}.`
                  : "Select the model year to complete vehicle configuration."}
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              PROGRESS: {selectedModel ? "1/3" : "0/3"} {selectedVariant ? "→ 2/3" : ""} {selectedYear ? "→ 3/3" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
