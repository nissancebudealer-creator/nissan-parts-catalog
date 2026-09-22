"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Table as TableIcon,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Package,
  Car,
  Layers,
  ArrowUpDown,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import { PartCatalogItem } from "@/types/catalog";

interface SearchResultsProps {
  parts: PartCatalogItem[];
  modelName?: string;
  variantName?: string;
  year?: number | string;
  searchQuery?: string;
  category?: string;
  onSelectPart: (part: PartCatalogItem) => void;
}

type ViewMode = "cards" | "table";
type SortOption = "partNumber" | "description" | "category";

export const SearchResults: React.FC<SearchResultsProps> = ({
  parts,
  modelName,
  variantName,
  year,
  searchQuery,
  category,
  onSelectPart,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [sortBy, setSortBy] = useState<SortOption>("partNumber");
  const [copiedPartId, setCopiedPartId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, partId: string, partNumber: string) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(partNumber);
      setCopiedPartId(partId);
      setTimeout(() => setCopiedPartId(null), 2000);
    }
  };

  // Sort parts
  const sortedParts = [...parts].sort((a, b) => {
    if (sortBy === "partNumber") {
      return a.partNumber.localeCompare(b.partNumber);
    }
    if (sortBy === "description") {
      return a.partDescription.localeCompare(b.partDescription);
    }
    if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md">
      {/* Results Header with View Mode & Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-6 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Compatible Nissan Parts ({parts.length})
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
              Verified Fitment
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {modelName && variantName ? (
              <span>
                Configured for:{" "}
                <strong className="text-slate-200">
                  Nissan {modelName} &bull; {variantName} ({year})
                </strong>
                {searchQuery && (
                  <span>
                    {" "}
                    &bull; Query: <strong className="text-red-400">&ldquo;{searchQuery}&rdquo;</strong>
                  </span>
                )}
              </span>
            ) : (
              "All matching compatible components."
            )}
          </p>
        </div>

        {/* View Toggle & Sort Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer text-xs"
              aria-label="Sort search results"
            >
              <option value="partNumber" className="bg-slate-950 text-white">
                Sort: Part #
              </option>
              <option value="description" className="bg-slate-950 text-white">
                Sort: Description
              </option>
              <option value="category" className="bg-slate-950 text-white">
                Sort: Category
              </option>
            </select>
          </div>

          {/* Cards vs Table View Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "cards"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Cards View (Touch friendly)"
              aria-label="Cards view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Table View (High density counter view)"
              aria-label="Table view"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* No Results Found State */}
      {sortedParts.length === 0 ? (
        <div className="py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3.5 text-slate-500">
            <Package className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white">No Compatible Parts Found</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1.5 leading-relaxed">
            No parts in our database matched this vehicle configuration and description query. Try searching for a broader term (e.g. &ldquo;Brake&rdquo;, &ldquo;Filter&rdquo;) or select another vehicle variant.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* CARDS VIEW (Section 5) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedParts.map((part) => (
            <div
              key={part.id}
              onClick={() => onSelectPart(part)}
              className="group p-5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-red-500/50 hover:bg-slate-950 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-red-950/20"
            >
              <div>
                {/* Header: Category & Part Number with Copy */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {part.category}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, part.id, part.partNumber)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40 transition-colors"
                    title="Click to copy Part Number"
                  >
                    {copiedPartId === part.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <span>{part.partNumber}</span>
                        <Copy className="w-3 h-3 text-slate-400 group-hover:text-red-300" />
                      </>
                    )}
                  </button>
                </div>

                {/* Part Description */}
                <h4 className="text-sm font-bold text-white leading-snug group-hover:text-red-100 transition-colors mb-3">
                  {part.partDescription}
                </h4>

                {/* Compatibility and Specs */}
                <div className="text-[11px] text-slate-400 space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Nissan {part.model} {part.variant} ({part.year})</span>
                  </div>
                  {part.position && (
                    <div className="text-slate-400">
                      Position: <span className="text-slate-300">{part.position}</span>
                    </div>
                  )}
                  {part.remarks && (
                    <div className="text-slate-500 line-clamp-1 italic">
                      {part.remarks}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Status & Open Details Affordance */}
              <div className="pt-3 border-t border-slate-900/90 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{part.genuineStatus}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-red-400 transition-colors">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW (Section 5 Dealership Counter Table) */
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Part Number</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Position / Fitment</th>
                <th className="py-3.5 px-4">OEM Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {sortedParts.map((part) => (
                <tr
                  key={part.id}
                  onClick={() => onSelectPart(part)}
                  className="hover:bg-slate-900/80 cursor-pointer transition-colors group"
                >
                  {/* Part Number */}
                  <td className="py-3.5 px-4 font-mono font-bold text-red-400 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{part.partNumber}</span>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(e, part.id, part.partNumber)}
                        className="p-1 rounded text-slate-500 hover:text-white transition-colors"
                        title="Copy Part Number"
                      >
                        {copiedPartId === part.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 font-semibold text-white group-hover:text-red-100 transition-colors">
                    {part.partDescription}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900 border border-slate-800 text-slate-400">
                      {part.category}
                    </span>
                  </td>

                  {/* Position / Fitment */}
                  <td className="py-3.5 px-4 text-slate-400">
                    <div>{part.position || "Standard OEM"}</div>
                    <div className="text-[10px] text-slate-500">
                      {part.model} {part.variant}
                    </div>
                  </td>

                  {/* OEM Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{part.genuineStatus}</span>
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300">
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info & DEMO DATA Notice */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Click any part to open full OEM specifications, superseded part numbers, and fitment notes.</span>
        </div>

        <div className="text-[11px] font-mono text-amber-400/90">
          DEMO DATA (SECTION 12)
        </div>
      </div>
    </div>
  );
};
