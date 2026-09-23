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
  MessageSquare,
  Phone,
  Mail,
  User,
  Users,
  UserPlus,
  UserCheck,
  ShieldAlert,
  Edit2,
} from "lucide-react";
import {
  PartEntity,
  VehicleModelEntity,
  PartInquiryEntity,
  StaffRole,
  StaffUserPublic,
} from "@/types/catalog";
import { DataImportModal } from "@/components/DataImportModal";

const DEMO_PASSCODE = "nissan2024";

export default function AdminPage() {
  // Authentication & RBAC State (Phase 11)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<StaffUserPublic | null>(null);
  const [loginUsername, setLoginUsername] = useState<string>("admin");
  const [passcode, setPasscode] = useState<string>("nissan2024");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"parts" | "inquiries" | "users" | "vehicles" | "import-export">("parts");

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

  // Customer Inquiries & Transactions Management (Phase 10)
  const [inquiries, setInquiries] = useState<PartInquiryEntity[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState<boolean>(false);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>("all");
  const [inquirySearchQuery, setInquirySearchQuery] = useState<string>("");

  // Staff User Management & RBAC State (Phase 11)
  const [staffUsers, setStaffUsers] = useState<StaffUserPublic[]>([]);
  const [loadingStaffUsers, setLoadingStaffUsers] = useState<boolean>(false);
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>("all");
  const [staffSearchQuery, setStaffSearchQuery] = useState<string>("");

  // Add Staff Modal Form State
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [newStaffUsername, setNewStaffUsername] = useState("");
  const [newStaffFullName, setNewStaffFullName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>("counter_clerk");
  const [newStaffDepartment, setNewStaffDepartment] = useState("Parts Counter");
  const [newStaffPassword, setNewStaffPassword] = useState("nissan2024");
  const [addStaffError, setAddStaffError] = useState<string | null>(null);
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);

  // Edit Staff Modal Form State
  const [editingStaffUser, setEditingStaffUser] = useState<StaffUserPublic | null>(null);
  const [editStaffFullName, setEditStaffFullName] = useState("");
  const [editStaffEmail, setEditStaffEmail] = useState("");
  const [editStaffDepartment, setEditStaffDepartment] = useState("");
  const [editStaffRole, setEditStaffRole] = useState<StaffRole>("counter_clerk");
  const [editStaffPassword, setEditStaffPassword] = useState("");
  const [editStaffError, setEditStaffError] = useState<string | null>(null);
  const [isSubmittingEditStaff, setIsSubmittingEditStaff] = useState(false);

  // Data Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Check existing session and URL query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["parts", "inquiries", "users", "vehicles", "import-export"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }

      const stored = localStorage.getItem("nissan_staff_session");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
            setIsAuthenticated(true);
          }
        } catch (e) {}
      }
    }

    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.user) {
            setCurrentUser(json.user);
            setIsAuthenticated(true);
            if (typeof window !== "undefined") {
              localStorage.setItem("nissan_staff_session", JSON.stringify(json.user));
            }
          }
        }
      } catch (err) {}
    };

    checkSession();
  }, []);

  // Load stats, parts, models, inquiries, and staff upon login
  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadParts();
      loadModels();
      loadInquiries();
      if (!currentUser || currentUser.role === "admin") {
        loadStaffUsers();
      }
    }
  }, [isAuthenticated, currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername.trim() || "admin",
          password: passcode.trim() || "nissan2024",
        }),
      });

      const json = await res.json();
      if (json.success && json.user) {
        setCurrentUser(json.user);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        // Fallback backward compatibility for plain DEMO_PASSCODE
        if (passcode.trim() === DEMO_PASSCODE) {
          setCurrentUser({
            id: "usr-admin-01",
            username: "admin",
            email: "admin@nissan-dealer.ph",
            full_name: "Dealership Parts Director",
            role: "admin",
            department: "Executive & Inventory Control",
            active: true,
            created_at: new Date().toISOString(),
          });
          setIsAuthenticated(true);
          setAuthError(null);
        } else {
          setAuthError(json.error || "Invalid access passcode. Hint: Use demo passkey 'nissan2024'");
        }
      }
    } catch (err: any) {
      if (passcode.trim() === DEMO_PASSCODE) {
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setAuthError("Failed to authenticate. Hint: Use demo passkey 'nissan2024'");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickLogin = (role: StaffRole) => {
    if (role === "admin") {
      setLoginUsername("admin");
      setPasscode("nissan2024");
    } else if (role === "counter_clerk") {
      setLoginUsername("clerk");
      setPasscode("nissan2024");
    } else if (role === "service_advisor") {
      setLoginUsername("advisor");
      setPasscode("nissan2024");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // ignore
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab("parts");
  };

  const loadStaffUsers = async (roleOverride?: string, queryOverride?: string) => {
    setLoadingStaffUsers(true);
    try {
      const activeRole = roleOverride !== undefined ? roleOverride : staffRoleFilter;
      const activeQuery = queryOverride !== undefined ? queryOverride : staffSearchQuery;
      const params = new URLSearchParams();
      if (activeRole !== "all") params.append("role", activeRole);
      if (activeQuery.trim()) params.append("query", activeQuery.trim());

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: currentUser?.role
          ? { "x-staff-role": currentUser.role, "x-staff-id": currentUser.id }
          : { "x-staff-role": "admin" },
      });
      const json = await res.json();
      if (json.success) setStaffUsers(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStaffUsers(false);
    }
  };

  const handleCreateStaffUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffUsername || !newStaffFullName || !newStaffEmail) {
      setAddStaffError("Please complete Username, Full Name, and Email.");
      return;
    }

    setIsSubmittingStaff(true);
    setAddStaffError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(currentUser?.role ? { "x-staff-role": currentUser.role, "x-staff-id": currentUser.id } : { "x-staff-role": "admin" }),
        },
        body: JSON.stringify({
          username: newStaffUsername,
          full_name: newStaffFullName,
          email: newStaffEmail,
          role: newStaffRole,
          department: newStaffDepartment,
          password: newStaffPassword,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setAddStaffError(json.error || "Failed to create staff member");
      } else {
        setShowAddStaffModal(false);
        setNewStaffUsername("");
        setNewStaffFullName("");
        setNewStaffEmail("");
        setNewStaffDepartment("Parts Counter");
        loadStaffUsers();
      }
    } catch (err: any) {
      setAddStaffError(err.message || "Failed to create staff member");
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  const handleToggleStaffActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(currentUser?.role ? { "x-staff-role": currentUser.role, "x-staff-id": currentUser.id } : { "x-staff-role": "admin" }),
        },
        body: JSON.stringify({ id: userId, active: !currentActive }),
      });
      const json = await res.json();
      if (json.success) {
        setStaffUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, active: !currentActive } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStaffRole = async (userId: string, newRole: StaffRole) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(currentUser?.role ? { "x-staff-role": currentUser.role, "x-staff-id": currentUser.id } : { "x-staff-role": "admin" }),
        },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setStaffUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStaffUser = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to remove staff member '${username}'?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
        headers: {
          ...(currentUser?.role ? { "x-staff-role": currentUser.role, "x-staff-id": currentUser.id } : { "x-staff-role": "admin" }),
        },
      });
      const json = await res.json();
      if (json.success) {
        setStaffUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        alert(json.error || "Failed to remove staff user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEditStaffModal = (user: StaffUserPublic) => {
    setEditingStaffUser(user);
    setEditStaffFullName(user.full_name);
    setEditStaffEmail(user.email);
    setEditStaffDepartment(user.department || "Parts Counter");
    setEditStaffRole(user.role);
    setEditStaffPassword("");
    setEditStaffError(null);
  };

  const handleUpdateStaffUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaffUser) return;

    setIsSubmittingEditStaff(true);
    setEditStaffError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(currentUser?.role ? { "x-staff-role": currentUser.role, "x-staff-id": currentUser.id } : { "x-staff-role": "admin" }),
        },
        body: JSON.stringify({
          id: editingStaffUser.id,
          full_name: editStaffFullName,
          email: editStaffEmail,
          department: editStaffDepartment,
          role: editStaffRole,
          ...(editStaffPassword.trim() ? { password: editStaffPassword.trim() } : {}),
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setEditStaffError(json.error || "Failed to update staff user");
      } else {
        setStaffUsers((prev) =>
          prev.map((u) => (u.id === editingStaffUser.id ? { ...u, ...json.data } : u))
        );
        setEditingStaffUser(null);
      }
    } catch (err: any) {
      setEditStaffError(err.message || "Failed to update staff user");
    } finally {
      setIsSubmittingEditStaff(false);
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

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const params = new URLSearchParams();
      if (inquiryStatusFilter !== "all") params.append("status", inquiryStatusFilter);
      if (inquirySearchQuery.trim()) params.append("query", inquirySearchQuery.trim());
      const res = await fetch(`/api/inquiries?${params.toString()}`);
      const json = await res.json();
      if (json.success) setInquiries(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus as any } : inq))
        );
      }
    } catch (err) {
      console.error(err);
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
          <p className="text-xs text-center text-slate-400 mt-1 mb-5">
            Sign in with your staff account or use administrative passcode.
          </p>

          {/* Quick Demo Role Selectors */}
          <div className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block">
              1-Click Demo Staff Role Selector:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                  loginUsername === "admin"
                    ? "bg-red-950/80 text-red-300 border-red-700 shadow-sm"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("counter_clerk")}
                className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                  loginUsername === "clerk"
                    ? "bg-blue-950/80 text-blue-300 border-blue-700 shadow-sm"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                Counter Clerk
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("service_advisor")}
                className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                  loginUsername === "advisor"
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-700 shadow-sm"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                Advisor
              </button>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Staff Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin, clerk, or advisor..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Password or Admin Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Default demo passkey: <code className="text-red-400 font-mono">nissan2024</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? "Authenticating..." : "Sign In to Admin Console"}
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
              {currentUser && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
                    {currentUser.full_name ? currentUser.full_name.charAt(0) : "U"}
                  </div>
                  <div>
                    <div className="font-semibold text-white leading-tight">{currentUser.full_name}</div>
                    <div className="text-[10px] text-slate-400">{currentUser.department}</div>
                  </div>
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      currentUser.role === "admin"
                        ? "bg-red-950 text-red-300 border border-red-800/50"
                        : currentUser.role === "counter_clerk"
                        ? "bg-blue-950 text-blue-300 border border-blue-800/50"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                    }`}
                  >
                    {currentUser.role.replace("_", " ")}
                  </span>
                </div>
              )}

              {(!currentUser || currentUser.role === "admin") && (
                <Link
                  href="/admin/users"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  title="Open Dedicated User Management Module"
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden md:inline">User Management</span>
                </Link>
              )}

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              >
                <Car className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Parts Finder UI</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
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

          {(!currentUser || currentUser.role === "admin") && (
            <div
              onClick={() => setActiveTab("users")}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-red-400 transition-colors">
                  Staff Accounts
                </div>
                <Users className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 transition-colors" />
              </div>
              <div className="text-2xl font-black text-white">
                {stats?.totalStaff ?? staffUsers.length ?? "--"}
              </div>
              <div className="text-[11px] text-red-400 mt-0.5 flex items-center gap-1">
                <span>Manage Users & RBAC</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          )}
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
            onClick={() => setActiveTab("inquiries")}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "inquiries"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Inquiries & Orders ({inquiries.length})</span>
            {inquiries.some((i) => i.status === "pending") && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
          {(!currentUser || currentUser.role === "admin") && (
            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === "users"
                  ? "border-red-500 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Staff Users ({staffUsers.length})</span>
            </button>
          )}
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
          {(!currentUser || currentUser.role === "admin") && (
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
          )}
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

              {(!currentUser || currentUser.role === "admin") && (
                <button
                  type="button"
                  onClick={() => setShowAddPartModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Part Record</span>
                </button>
              )}
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
                        {currentUser?.role !== "service_advisor" ? (
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
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.active
                                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50"
                                : "bg-slate-900 text-slate-500 border border-slate-800"
                            }`}
                          >
                            {p.active ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {(!currentUser || currentUser.role === "admin") ? (
                          <button
                            type="button"
                            onClick={() => handleDeletePart(p.id, p.part_number)}
                            className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="Delete part"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-600 font-mono">Protected</span>
                        )}
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

        {/* TAB: INQUIRIES & TRANSACTIONS (PHASE 10) */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {/* Inquiries Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={inquirySearchQuery}
                    onChange={(e) => setInquirySearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadInquiries()}
                    placeholder="Search ref #, customer, part #..."
                    className="w-full px-3.5 py-2 pl-9 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                </div>

                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="quoted">Quoted</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={loadInquiries}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Filter
                </button>
              </div>

              <button
                type="button"
                onClick={loadInquiries}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingInquiries ? "animate-spin" : ""}`} />
                <span>Refresh Inquiries</span>
              </button>
            </div>

            {/* Inquiries Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Transaction Ref</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Part & Specification</th>
                    <th className="py-3.5 px-4">Vehicle Fitment</th>
                    <th className="py-3.5 px-4 text-center">Qty</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loadingInquiries ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Loading customer transactions...
                      </td>
                    </tr>
                  ) : inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No customer transactions or quote inquiries recorded yet.
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-900/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-red-400 whitespace-nowrap">
                          {inq.transaction_ref}
                          <div className="text-[10px] font-normal text-slate-500">
                            {new Date(inq.created_at).toLocaleDateString()} {new Date(inq.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{inq.customer_name}</div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{inq.customer_phone}</span>
                          </div>
                          {inq.customer_email && (
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>{inq.customer_email}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-200">{inq.part_number}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{inq.part_description}</div>
                          {inq.notes && (
                            <div className="text-[10px] text-amber-400/80 italic mt-0.5">Note: {inq.notes}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-xs">
                          <div>{inq.vehicle_summary}</div>
                          {inq.vin_plate && (
                            <div className="text-[10px] font-mono text-slate-500">Plate/VIN: {inq.vin_plate}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-white whitespace-nowrap">
                          {inq.quantity}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              inq.status === "completed"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                                : inq.status === "quoted"
                                ? "bg-blue-950 text-blue-400 border border-blue-800/40"
                                : inq.status === "cancelled"
                                ? "bg-slate-800 text-slate-400 border border-slate-700"
                                : "bg-amber-950 text-amber-400 border border-amber-800/40"
                            }`}
                          >
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                              disabled={currentUser?.role === "service_advisor"}
                              className={`px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px] focus:outline-none ${
                                currentUser?.role === "service_advisor" ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="quoted">Mark Quoted</option>
                              <option value="completed">Mark Completed</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                            <a
                              href={`https://wa.me/${inq.customer_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Hello ${inq.customer_name}, regarding your Nissan Parts inquiry (${inq.transaction_ref}) for part ${inq.part_number}...`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800/50 transition-colors"
                              title="Message Customer on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
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

        {/* TAB 5: STAFF USER MANAGEMENT & RBAC */}
        {activeTab === "users" && (!currentUser || currentUser.role === "admin") && (
          <div className="space-y-6">
            {/* RBAC Permission Hierarchy Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-red-900/40 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-xs">Parts Manager (Admin)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-red-950 text-red-300 border border-red-800/40">
                    Full Access
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Full control over staff accounts, user creation/deactivation, parts catalog modifications, hard deletions, and CSV bulk import/export.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-900/40 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-xs">Counter Clerk</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800/40">
                    Fulfillment
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Manages customer quote requests, updates inquiry statuses (pending/quoted/completed), and toggles part stock availability. Cannot manage staff or import catalog CSVs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-900/40 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                      <Search className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-xs">Service Advisor</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    Read-Only
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Vehicle catalog and compatibility search for workshop quotes. Read-only permissions on parts and inquiry statuses. Cannot alter inventory records or manage staff.
                </p>
              </div>
            </div>

            {/* Staff Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={staffSearchQuery}
                    onChange={(e) => setStaffSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadStaffUsers()}
                    placeholder="Search name, username, email..."
                    className="w-full px-3.5 py-2 pl-9 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                </div>

                <select
                  value={staffRoleFilter}
                  onChange={(e) => {
                    const role = e.target.value;
                    setStaffRoleFilter(role);
                    loadStaffUsers(role);
                  }}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Staff Roles</option>
                  <option value="admin">Administrator / Parts Manager</option>
                  <option value="counter_clerk">Parts Counter Clerk</option>
                  <option value="service_advisor">Service Advisor</option>
                </select>

                <button
                  type="button"
                  onClick={() => loadStaffUsers()}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Filter
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => loadStaffUsers()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingStaffUsers ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Staff Member</span>
                </button>
              </div>
            </div>

            {/* Staff Users Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Staff Member</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4">Last Login</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loadingStaffUsers ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Loading dealership staff directory...
                      </td>
                    </tr>
                  ) : staffUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No staff user accounts found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    staffUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-900/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{user.full_name}</span>
                                {currentUser?.id === user.id && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-300 font-mono">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                @{user.username}
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-600" />
                                <span>{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {user.department || "General Operations"}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateStaffRole(user.id, e.target.value as StaffRole)}
                            className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer focus:outline-none ${
                              user.role === "admin"
                                ? "bg-red-950/80 text-red-300 border-red-800/60"
                                : user.role === "counter_clerk"
                                ? "bg-blue-950/80 text-blue-300 border-blue-800/60"
                                : "bg-emerald-950/80 text-emerald-300 border-emerald-800/60"
                            }`}
                          >
                            <option value="admin">Administrator (Admin)</option>
                            <option value="counter_clerk">Counter Clerk</option>
                            <option value="service_advisor">Service Advisor</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleStaffActive(user.id, user.active)}
                            disabled={currentUser?.id === user.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              user.active
                                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/60"
                                : "bg-slate-800/80 text-slate-400 border border-slate-700 hover:bg-slate-700/60"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={currentUser?.id === user.id ? "Cannot deactivate own account" : "Click to toggle active state"}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${user.active ? "bg-emerald-400" : "bg-slate-500"}`} />
                            <span>{user.active ? "Active" : "Inactive"}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {user.last_login ? (
                            <div>
                              <div>{new Date(user.last_login).toLocaleDateString()}</div>
                              <div className="text-[10px] text-slate-500">
                                {new Date(user.last_login).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-600">Never</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditStaffModal(user)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                              title={`Edit staff user ${user.full_name}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {currentUser?.id === user.id ? (
                              <span className="text-[10px] text-slate-600 px-1 italic">Current</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDeleteStaffUser(user.id, user.username)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                                title={`Delete staff user ${user.username}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-red-500" />
                <span>Register Dealership Staff Member</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {addStaffError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
                {addStaffError}
              </div>
            )}

            <form onSubmit={handleCreateStaffUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaffUsername}
                    onChange={(e) => setNewStaffUsername(e.target.value)}
                    placeholder="e.g. carl.santos"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Role Permission *
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="counter_clerk">Counter Clerk (Sales)</option>
                    <option value="service_advisor">Service Advisor (Workshop)</option>
                    <option value="admin">Administrator (Parts Manager)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaffFullName}
                  onChange={(e) => setNewStaffFullName(e.target.value)}
                  placeholder="e.g. Carl Santos"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dealership Email *
                </label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="e.g. carl.santos@nissan-dealer.ph"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newStaffDepartment}
                    onChange={(e) => setNewStaffDepartment(e.target.value)}
                    placeholder="e.g. Parts Counter"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Initial Password
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaffPassword}
                    onChange={(e) => setNewStaffPassword(e.target.value)}
                    placeholder="nissan2024"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStaff}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  {isSubmittingStaff ? "Creating Account..." : "Create Staff Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaffUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Edit Staff Member (@{editingStaffUser.username})</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingStaffUser(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {editStaffError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
                {editStaffError}
              </div>
            )}

            <form onSubmit={handleUpdateStaffUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editStaffFullName}
                  onChange={(e) => setEditStaffFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dealership Email *
                </label>
                <input
                  type="email"
                  required
                  value={editStaffEmail}
                  onChange={(e) => setEditStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editStaffDepartment}
                    onChange={(e) => setEditStaffDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Role Permission
                  </label>
                  <select
                    value={editStaffRole}
                    onChange={(e) => setEditStaffRole(e.target.value as StaffRole)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="counter_clerk">Counter Clerk</option>
                    <option value="service_advisor">Service Advisor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reset Password (leave blank to keep current password)
                </label>
                <input
                  type="text"
                  value={editStaffPassword}
                  onChange={(e) => setEditStaffPassword(e.target.value)}
                  placeholder="Enter new password if changing..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono placeholder-slate-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStaffUser(null)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEditStaff}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  {isSubmittingEditStaff ? "Saving..." : "Save Changes"}
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
