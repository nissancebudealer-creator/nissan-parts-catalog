"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Package,
  Car,
  User,
  Phone,
  Mail,
  FileText,
  Hash,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { PartCatalogItem, PartInquiryEntity } from "@/types/catalog";

interface QuoteRequestModalProps {
  part: PartCatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
  vehicleSummary?: string;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  part,
  isOpen,
  onClose,
  vehicleSummary,
}) => {
  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [vinPlate, setVinPlate] = useState("");
  const [notes, setNotes] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionResult, setTransactionResult] = useState<PartInquiryEntity | null>(null);
  const [copiedTxn, setCopiedTxn] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting]);

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

  // Reset form when modal opens with a new part
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setTransactionResult(null);
      setCopiedTxn(false);
      setQuantity(1);
    }
  }, [isOpen, part]);

  if (!isOpen || !part) return null;

  const resolvedVehicle =
    vehicleSummary ||
    `Nissan ${part.model} • ${part.variant} (${part.year})`;

  const handleClose = () => {
    setErrorMessage(null);
    setTransactionResult(null);
    onClose();
  };

  const handleCopyTransaction = () => {
    if (transactionResult?.transaction_ref && navigator.clipboard) {
      navigator.clipboard.writeText(transactionResult.transaction_ref);
      setCopiedTxn(true);
      setTimeout(() => setCopiedTxn(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage("Please enter your contact phone or WhatsApp number.");
      return;
    }
    if (quantity < 1) {
      setErrorMessage("Quantity must be at least 1.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          part_id: part.id,
          part_number: part.partNumber,
          part_description: part.partDescription,
          vehicle_summary: resolvedVehicle,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_email: customerEmail.trim() || undefined,
          quantity: quantity,
          vin_plate: vinPlate.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit quote inquiry");
      }

      setTransactionResult(data.data);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!transactionResult) return "#";
    const text = encodeURIComponent(
      `Hello Nissan Parts Counter! I submitted an inquiry.\n\n` +
      `*Transaction Ref:* ${transactionResult.transaction_ref}\n` +
      `*Part:* ${part.partNumber} - ${part.partDescription}\n` +
      `*Vehicle:* ${resolvedVehicle}\n` +
      `*Qty:* ${transactionResult.quantity}\n` +
      `*Customer:* ${transactionResult.customer_name} (${transactionResult.customer_phone})\n` +
      (transactionResult.vin_plate ? `*VIN/Plate:* ${transactionResult.vin_plate}\n` : "") +
      `Please provide price & availability confirmation.`
    );
    return `https://wa.me/?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={!isSubmitting ? handleClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-red-400 uppercase">
                Dealership Counter Transaction
              </span>
              <h3 id="quote-modal-title" className="text-lg font-bold text-white">
                Request Official OEM Quote
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Target Part Information Capsule */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-400">
                OEM Part #{part.partNumber}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>{part.genuineStatus}</span>
              </span>
            </div>
            <div className="text-sm font-semibold text-white">
              {part.partDescription}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-900">
              <Car className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{resolvedVehicle}</span>
            </div>
          </div>

          {/* SUCCESS SCREEN */}
          {transactionResult ? (
            <div className="space-y-5 py-2">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 animate-in zoom-in-50 duration-300">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">
                  Transaction Registered Successfully!
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your quote request has been routed to the Nissan Dealership Parts Counter ledger.
                </p>
              </div>

              {/* Reference Capsule */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-center space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Transaction Reference Number
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-lg font-bold text-emerald-400">
                    {transactionResult.transaction_ref}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTransaction}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copy Transaction Ref"
                  >
                    {copiedTxn ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Save this reference number when visiting or calling the dealership.
                </p>
              </div>

              {/* WhatsApp & Return Actions */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send to Parts Counter via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  <span>Return to Catalog</span>
                </button>
              </div>
            </div>
          ) : (
            /* TRANSACTION INPUT FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name <strong className="text-red-400">*</strong></span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              {/* Contact Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone / WhatsApp <strong className="text-red-400">*</strong></span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address (Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="juan@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              {/* Quantity & VIN/Plate Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span>Quantity Required <strong className="text-red-400">*</strong></span>
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 rounded-l-xl bg-slate-800 text-white text-xs hover:bg-slate-700 border border-slate-800"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full py-2.5 text-center bg-slate-950 border-y border-slate-800 text-white text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 rounded-r-xl bg-slate-800 text-white text-xs hover:bg-slate-700 border border-slate-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span>Plate # or Chassis VIN (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={vinPlate}
                    onChange={(e) => setVinPlate(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC 1234 / VIN"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500 transition-colors uppercase font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Special Notes / Pickup Preferences</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Need immediate counter pickup or installation schedule..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500 transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Registering Transaction...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Quote Inquiry Transaction</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

