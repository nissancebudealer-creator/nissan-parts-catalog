"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  Tag,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import {
  VehicleModelEntity,
  VehicleVariantEntity,
  VehicleYearEntity,
  PartCatalogItem,
} from "@/types/catalog";

interface PartsSearchProps {
  selectedModel: VehicleModelEntity | null;
  selectedVariant: VehicleVariantEntity | null;
  selectedYear: VehicleYearEntity | null;
  onSearch: (results: PartCatalogItem[], searchParams: { query: string; category: string }) => void;
  onClear: () => void;
  isSearching: boolean;
}

// Common automotive parts for quick 1-click selection (accessible for non-technical customers)
const QUICK_SEARCH_CHIPS = [
  "Brake Pad",
  "Brake Disc",
  "Oil Filter",
  "Air Filter",
  "Cabin Filter",
  "Drive Belt",
  "Shock Absorber",
  "Front Bumper",
];

const CATEGORIES = [
  "All Categories",
  "Brake System",
  "Filters",
  "Engine",
  "Suspension",
  "Body",
  "Air Conditioning",
  "Lubricants",
];

export const PartsSearch: React.FC<PartsSearchProps> = ({
  selectedModel,
  selectedVariant,
  selectedYear,
  onSearch,
  onClear,
  isSearching,
}) => {
  const [descriptionQuery, setDescriptionQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [validationError, setValidationError] = useState<string | null>(null);

  const isVehicleConfigured = Boolean(selectedModel && selectedVariant && selectedYear);

  // Clear validation error when vehicle or query changes
  useEffect(() => {
    if (isVehicleConfigured) {
      setValidationError(null);
    }
  }, [isVehicleConfigured]);

  const handlePerformSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!selectedModel) {
      setValidationError("Please select a Nissan Model in Step 1 before searching.");
      return;
    }
    if (!selectedVariant) {
      setValidationError("Please select a Variant in Step 2 before searching.");
      return;
    }
    if (!selectedYear) {
      setValidationError("Please select a Year Model in Step 3 before searching.");
      return;
    }

    setValidationError(null);

    try {
      const params = new URLSearchParams();
      params.append("modelId", selectedModel.id);
      params.append("modelName", selectedModel.model_name);
      params.append("variantId", selectedVariant.id);
      params.append("variantName", selectedVariant.variant_name);
      params.append("year", selectedYear.year.toString());

      if (descriptionQuery.trim()) {
        params.append("description", descriptionQuery.trim());
      }

      if (selectedCategory && selectedCategory !== "All Categories") {
        params.append("category", selectedCategory);
      }

      const res = await fetch(`/api/catalog/parts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to search parts catalog");

      const json = await res.json();
      if (json.success) {
        onSearch(json.data || [], {
          query: descriptionQuery.trim(),
          category: selectedCategory,
        });
      } else {
        throw new Error(json.error || "Search error");
      }
    } catch (err: any) {
      setValidationError(err.message || "Failed to retrieve parts.");
    }
  };

  const handleChipClick = (chipText: string) => {
    setDescriptionQuery(chipText);
  };

  const handleClearForm = () => {
    setDescriptionQuery("");
    setSelectedCategory("All Categories");
    setValidationError(null);
    onClear();
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Part Description & Compatibility Search
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/50">
              Steps 4 & 5
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Search by part description, keyword, or OEM part number with partial matching.
          </p>
        </div>

        {/* Secondary Action: Clear Search (Section 8) */}
        {(descriptionQuery || selectedCategory !== "All Categories") && (
          <button
            type="button"
            onClick={handleClearForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all active:scale-95 self-start sm:self-auto"
            title="Clear search query and category"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear Search</span>
          </button>
        )}
      </div>

      {/* Validation or Error Message */}
      {validationError && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Search Form */}
      <form onSubmit={handlePerformSearch} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* STEP 4: Enter Part Description (Input Field) */}
          <div className="lg:col-span-8 space-y-2">
            <label
              htmlFor="part-description-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-red-500" />
              <span>STEP 4: Part Description or Part Number</span>
            </label>

            <div className="relative">
              <input
                id="part-description-input"
                type="text"
                value={descriptionQuery}
                onChange={(e) => setDescriptionQuery(e.target.value)}
                placeholder="Enter description (e.g. Brake Pad, Oil Filter, Rotor, D1060)..."
                className="w-full px-4 py-3.5 sm:py-4 pr-10 rounded-xl text-sm font-medium bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all shadow-inner"
              />
              {descriptionQuery && (
                <button
                  type="button"
                  onClick={() => setDescriptionQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Selector */}
          <div className="lg:col-span-4 space-y-2">
            <label
              htmlFor="category-select"
              className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Category Filter (Optional)</span>
            </label>

            <div className="relative">
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none px-4 py-3.5 sm:py-4 rounded-xl text-sm font-medium bg-slate-950 border border-slate-800 text-slate-200 hover:border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-950 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips (1-Click for Non-Technical Users) */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Tag className="w-3 h-3 text-red-400" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Common Service & Replacement Parts:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_SEARCH_CHIPS.map((chip) => {
              const isSelected = descriptionQuery.toLowerCase() === chip.toLowerCase();
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 ${
                    isSelected
                      ? "bg-red-600 text-white font-semibold shadow-sm shadow-red-900/40"
                      : "bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 5: Primary Action: Find Parts (Section 8) */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isVehicleConfigured
                ? `Ready to search genuine parts for Nissan ${selectedModel?.model_name} ${selectedVariant?.variant_name} (${selectedYear?.year}).`
                : "Configure your vehicle in Steps 1–3 above to enable precise OEM fitment matching."}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-lg active:scale-[0.98] ${
              isSearching
                ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-950/50 hover:shadow-red-800/40 border border-red-500/40 cursor-pointer"
            }`}
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                <span>Searching Parts...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find Parts</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
