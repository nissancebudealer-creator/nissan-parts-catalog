"use client";

import React, { useState } from "react";
import {
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Package,
  Phone,
  MessageSquare,
  Car,
  Hash,
  ExternalLink,
} from "lucide-react";
import { PartInquiryEntity } from "@/types/catalog";

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [referenceQuery, setReferenceQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<PartInquiryEntity | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRef = referenceQuery.trim().toUpperCase();
    if (!cleanRef) {
      setErrorMessage("Please enter your transaction reference number (e.g., TXN-NISSAN-123456).");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setHasSearched(true);
    setInquiryResult(null);

    try {
      const res = await fetch(`/api/inquiries?query=${encodeURIComponent(cleanRef)}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Find exact or closest match
        const exact = json.data.find(
          (i: PartInquiryEntity) => i.transaction_ref.toUpperCase() === cleanRef
        ) || json.data[0];
        setInquiryResult(exact);
      } else {
        setErrorMessage(`No order or reservation found with reference "${cleanRef}". Please verify your reference code.`);
      }
    } catch (err: any) {
      setErrorMessage("Failed to look up reservation. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Order Fulfilled / Ready",
          badgeClass: "bg-emerald-950 text-emerald-400 border-emerald-800/60",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          description: "Your parts reservation has been confirmed and is ready for pickup or dispatch.",
        };
      case "quoted":
        return {
          label: "Price Quoted & Confirmed",
          badgeClass: "bg-blue-950 text-blue-400 border-blue-800/60",
          icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
          description: "The dealership parts counter has verified stock and issued formal pricing.",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          badgeClass: "bg-slate-800 text-slate-400 border-slate-700",
          icon: <AlertCircle className="w-4 h-4 text-slate-400" />,
          description: "This reservation inquiry has been marked as cancelled.",
        };
      default:
        return {
          label: "Pending Verification",
          badgeClass: "bg-amber-950 text-amber-400 border-amber-800/60",
          icon: <Clock className="w-4 h-4 text-amber-400" />,
          description: "Your reservation has been received and is queued for parts counter stock verification.",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Track Part Reservation & Order Status
              </h3>
              <p className="text-[11px] text-slate-400">
                Check live dealership fulfillment status using your transaction code
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Transaction Reference Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={referenceQuery}
                  onChange={(e) => setReferenceQuery(e.target.value)}
                  placeholder="e.g. TXN-NISSAN-800291"
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono uppercase"
                />
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 inline-flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isLoading ? "Searching..." : "Track"}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Enter the reference code you received upon submitting your quote or reservation.
            </p>
          </form>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {inquiryResult && (
            <div className="space-y-4 pt-2">
              {/* Status Header */}
              {(() => {
                const statusInfo = getStatusBadge(inquiryResult.status);
                return (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {inquiryResult.transaction_ref}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {statusInfo.description}
                    </p>
                  </div>
                );
              })()}

              {/* Reserved Part & Vehicle Specs */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider block">
                      Confirmed OEM Part Number
                    </span>
                    <span className="font-mono text-base font-bold text-white">
                      {inquiryResult.part_number}
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {inquiryResult.part_description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Reserved Qty</span>
                    <span className="text-base font-bold text-white">{inquiryResult.quantity} units</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-slate-500" />
                    <span>Vehicle: <strong className="text-slate-300">{inquiryResult.vehicle_summary}</strong></span>
                  </div>
                  {inquiryResult.vin_plate && (
                    <div className="text-[11px] font-mono text-slate-500 pl-5">
                      Plate / VIN: {inquiryResult.vin_plate}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 pl-5 pt-1">
                    Submitted on: {new Date(inquiryResult.created_at).toLocaleDateString()} at {new Date(inquiryResult.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              {/* WhatsApp Action */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hello Nissan Parts Counter, I am following up on my Reservation ${inquiryResult.transaction_ref} for Part #${inquiryResult.part_number} (${inquiryResult.part_description}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Parts Counter via WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

