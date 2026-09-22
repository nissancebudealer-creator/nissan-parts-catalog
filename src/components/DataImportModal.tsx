"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  FileText,
  Database,
  ArrowRight,
  Info,
} from "lucide-react";
import { parsePartsCsv, ParsedCsvRow } from "@/lib/importer/csv-parser";

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
}

const SAMPLE_CSV = `model,variant,year,part_number,part_description,category,subcategory,position,notes
Terra,2.5 VL 4x4 AT,2025,22401-ED815,Iridium Spark Plug Set,Engine,Ignition,Cylinder Head,OEM laser iridium spark plugs DEMO DATA
Terra,2.5 VL 4x4 AT,2025,21481-5X00A,Engine Cooling Fan Assembly,Engine,Cooling,Radiator Shroud,12V dual speed electric cooling fan DEMO DATA
Navara,VL 4x4 AT,2025,40206-4KH0A,Front Brake Rotor Vented Disc,Brake System,Pads & Rotors,Front Axle,Vented high thermal capacity rotor DEMO DATA
Patrol,Royale 5.6L V8,2024,AY040-NS130,Patrol Front Premium Brake Pad Set,Brake System,Pads & Rotors,Front Axle,Ceramic compound for VK56 V8 heavy duty DEMO DATA
X-Trail,e-POWER 4WD,2024,27277-6RR0A,e-POWER Bio-Functional Cabin Filter,Air Conditioning,Cabin Filtration,HVAC Housing,Anti-allergen PM2.5 multi-layer filter DEMO DATA
Livina,VL AT,2024,16546-1HK0A,Engine Air Filter Element,Filters,Air Intake,Engine Intake,High flow synthetic pleated filter DEMO DATA`;

export const DataImportModal: React.FC<DataImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<ParsedCsvRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importSummary, setImportSummary] = useState<any | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
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

  // Update preview when csvText changes
  useEffect(() => {
    if (!csvText.trim()) {
      setPreviewRows([]);
      setParseErrors([]);
      return;
    }
    const result = parsePartsCsv(csvText);
    setPreviewRows(result.rows);
    setParseErrors(result.errors.map((e) => `Row ${e.rowNumber}: ${e.message}`));
  }, [csvText]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setCsvText(content || "");
      setImportSummary(null);
      setGeneralError(null);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setCsvText(SAMPLE_CSV);
    setImportSummary(null);
    setGeneralError(null);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob(
      [
        "model,variant,year,part_number,part_description,category,subcategory,position,notes\nTerra,2.5 VL 4x4 AT,2024,D1060-5X00A,Front Brake Pad Set,Brake System,Pads & Rotors,Front Axle,OEM ceramic brake pads\n",
      ],
      { type: "text/csv;charset=utf-8;" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "nissan-parts-import-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteImport = async () => {
    if (previewRows.length === 0) {
      setGeneralError("No valid rows to import. Please provide CSV data.");
      return;
    }

    setIsImporting(true);
    setGeneralError(null);

    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: csvText }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Import failed");
      }

      setImportSummary(json.importSummary);
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (err: any) {
      setGeneralError(err.message || "An unexpected error occurred during import.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetModal = () => {
    setCsvText("");
    setPreviewRows([]);
    setParseErrors([]);
    setImportSummary(null);
    setGeneralError(null);
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
        aria-labelledby="import-modal-title"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase">
                  Phase 6: Data Import Engine
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  CSV / Excel Compatible
                </span>
              </div>
              <h3 id="import-modal-title" className="text-lg sm:text-xl font-black text-white uppercase font-sans">
                Import Parts Data
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95"
              title="Download CSV Template"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>CSV Template</span>
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

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section 10 Information Box */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1.5 leading-relaxed">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Section 10 Standard Automotive CSV Format</span>
            </div>
            <p>
              Expected columns:{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px]">
                model,variant,year,part_number,part_description,category,subcategory,position,notes
              </code>
            </p>
          </div>

          {/* Success Summary Banner if import succeeded */}
          {importSummary && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Import Completed Successfully!</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 rounded bg-slate-950/60 border border-emerald-800/40">
                  Total Processed: <strong>{importSummary.totalProcessed}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-emerald-800/40">
                  New Parts Added: <strong>{importSummary.newPartsCount}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-emerald-800/40">
                  Parts Updated: <strong>{importSummary.updatedPartsCount}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-emerald-800/40">
                  Compatibilities: <strong>{importSummary.newCompatibilitiesCount}</strong>
                </div>
              </div>
            </div>
          )}

          {/* General Error Banner */}
          {generalError && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Input Method: File Upload or Direct Paste */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-red-500" />
                <span>Select File or Paste CSV Data</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-[11px] font-semibold text-red-400 hover:text-red-300 underline underline-offset-2"
                >
                  Load Demo Data Sample
                </button>
                <span className="text-slate-600">&bull;</span>
                <button
                  type="button"
                  onClick={handleResetModal}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Dropzone & File Selector */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-xl border-2 border-dashed border-slate-800 hover:border-slate-600 bg-slate-950/50 hover:bg-slate-950 cursor-pointer transition-all text-center group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-red-400 mx-auto mb-2 transition-colors" />
              <div className="text-xs font-semibold text-slate-300">
                Click to upload a <span className="text-red-400">.csv</span> file
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                or paste comma-separated parts text directly in the box below
              </div>
            </div>

            {/* Direct CSV Text Area */}
            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                setImportSummary(null);
                setGeneralError(null);
              }}
              placeholder="Paste raw CSV lines here: model,variant,year,part_number,part_description,category,subcategory..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          {/* Parse Errors List (if any) */}
          {parseErrors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Found {parseErrors.length} format warnings/errors:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] max-h-24 overflow-y-auto space-y-0.5 font-mono">
                {parseErrors.slice(0, 5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
                {parseErrors.length > 5 && (
                  <li className="text-slate-400 italic">...and {parseErrors.length - 5} more issues</li>
                )}
              </ul>
            </div>
          )}

          {/* Live Preview Table */}
          {previewRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">
                  Live Preview: Ready to Import ({previewRows.length} parts)
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">Valid &bull; Ready</span>
              </div>

              <div className="max-h-48 overflow-x-auto overflow-y-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Model</th>
                      <th className="py-2.5 px-3">Variant</th>
                      <th className="py-2.5 px-3">Year</th>
                      <th className="py-2.5 px-3">Part #</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 font-mono text-[11px]">
                    {previewRows.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60">
                        <td className="py-2 px-3 text-white">{row.model}</td>
                        <td className="py-2 px-3 text-slate-400">{row.variant}</td>
                        <td className="py-2 px-3 text-slate-400">{row.year}</td>
                        <td className="py-2 px-3 text-red-400 font-bold">{row.part_number}</td>
                        <td className="py-2 px-3 text-white">{row.part_description}</td>
                        <td className="py-2 px-3 text-slate-400">{row.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewRows.length > 10 && (
                  <div className="p-2 text-center text-[10px] text-slate-500 bg-slate-950 border-t border-slate-800 italic">
                    Showing first 10 of {previewRows.length} rows...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DEMO DATA Compliance Notice (Section 12) */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-600/30 text-[11px] text-amber-300/90 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Section 12 Notice:</strong> When uploading official verified parts data from CSV/Excel, ensure part numbers and vehicle compatibility correspond with genuine Nissan factory catalogs.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            {previewRows.length > 0 ? (
              <span>Ready to import <strong>{previewRows.length}</strong> part records into normalized database.</span>
            ) : (
              <span>Upload or paste CSV to begin.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={previewRows.length === 0 || isImporting}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md ${
                previewRows.length === 0 || isImporting
                  ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border border-red-500/50 active:scale-95 cursor-pointer shadow-red-950/40"
              }`}
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Commit Import ({previewRows.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
