"use client";

import React, { useEffect } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Package,
  Car,
  GitBranch,
  Calendar,
  Layers,
  Info,
  ExternalLink,
  Wrench,
} from "lucide-react";
import { PartCatalogItem } from "@/types/catalog";

interface PartDetailModalProps {
  part: PartCatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PartDetailModal: React.FC<PartDetailModalProps> = ({
  part,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !part) return null;

  const handleCopyPartNumber = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(part.partNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="part-modal-title"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-red-400 uppercase">
                OEM Part Specification
              </span>
              <h3 id="part-modal-title" className="text-lg sm:text-xl font-black text-white uppercase font-sans">
                {part.partNumber}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPartNumber}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
              title="Copy Part Number"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Part #</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Part Title & Badge */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/60">
                {part.category}
              </span>
              {part.subcategory && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {part.subcategory}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50">
                <ShieldCheck className="w-3.5 h-3.5" />
                {part.genuineStatus}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {part.partDescription}
            </h2>
          </div>

          {/* Vehicle Compatibility Details Grid */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-red-500" />
              <span>Verified Fitment Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Vehicle Model:</span>
                <span className="font-bold text-white">Nissan {part.model}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Target Variant:</span>
                <span className="font-bold text-white">{part.variant}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Compatible Year:</span>
                <span className="font-bold text-white">{part.year}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Mounting Position:</span>
                <span className="font-bold text-white">{part.position || "Standard OEM"}</span>
              </div>
            </div>
          </div>

          {/* Additional Engineering Notes & Remarks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Technical Notes & Specifications</span>
            </h4>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>{part.remarks || "Standard Nissan factory component specifications apply."}</p>
              {part.supersedes && (
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-amber-400 font-mono">
                  <span>Supersedes Part #:</span>
                  <span className="font-bold">{part.supersedes}</span>
                </div>
              )}
            </div>
          </div>

          {/* DEMO DATA Compliance Notice (Section 12) */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 text-[11px] text-amber-300 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Section 12 Compliance:</strong> This part record is labeled <strong>DEMO DATA</strong> for development & testing. Verified OEM parts catalog will be imported in Phase 6.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Esc</kbd> or click outside to return
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 active:scale-95"
          >
            Back to Search Results
          </button>
        </div>
      </div>
    </div>
  );
};
