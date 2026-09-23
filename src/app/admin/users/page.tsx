"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  User,
  UserPlus,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Search,
  Lock,
  Unlock,
  KeyRound,
  RefreshCw,
  Trash2,
  Edit2,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Car,
  Wrench,
  ChevronRight,
  Filter,
} from "lucide-react";
import { StaffRole, StaffUserPublic } from "@/types/catalog";

const DEMO_PASSCODE = "nissan2024";

export default function UserManagementPage() {
  // Authentication & Session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<StaffUserPublic | null>(null);
  const [loginUsername, setLoginUsername] = useState<string>("admin");
  const [passcode, setPasscode] = useState<string>("nissan2024");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);

  // Staff Directory State
  const [staffUsers, setStaffUsers] = useState<StaffUserPublic[]>([]);
  const [loadingStaffUsers, setLoadingStaffUsers] = useState<boolean>(false);
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>("all");
  const [staffStatusFilter, setStaffStatusFilter] = useState<string>("all");
  const [staffSearchQuery, setStaffSearchQuery] = useState<string>("");

  // Add Staff Modal State
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [newStaffUsername, setNewStaffUsername] = useState("");
  const [newStaffFullName, setNewStaffFullName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>("counter_clerk");
  const [newStaffDepartment, setNewStaffDepartment] = useState("Parts Counter");
  const [newStaffPassword, setNewStaffPassword] = useState("nissan2024");
  const [addStaffError, setAddStaffError] = useState<string | null>(null);
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);

  // Edit Staff Modal State
  const [editingUser, setEditingUser] = useState<StaffUserPublic | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editRole, setEditRole] = useState<StaffRole>("counter_clerk");
  const [editPassword, setEditPassword] = useState("");
  const [editUserError, setEditUserError] = useState<string | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem("nissan_staff_session") : null;
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.id) {
              setCurrentUser(parsed);
              setIsAuthenticated(true);
            }
          } catch (e) {
            // ignore
          }
        }

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
      } catch (err) {
        console.error("Session verification error:", err);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  // Load staff users when authenticated as admin
  useEffect(() => {
    if (isAuthenticated && (!currentUser || currentUser.role === "admin")) {
      loadStaffUsers();
    }
  }, [isAuthenticated, currentUser, staffRoleFilter]);

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
      if (json.success) {
        setStaffUsers(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load staff users:", err);
    } finally {
      setLoadingStaffUsers(false);
    }
  };

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
        if (typeof window !== "undefined") {
          localStorage.setItem("nissan_staff_session", JSON.stringify(json.user));
        }
      } else {
        if (passcode.trim() === DEMO_PASSCODE) {
          const fallbackAdmin: StaffUserPublic = {
            id: "usr-admin-01",
            username: "admin",
            email: "admin@nissan-dealer.ph",
            full_name: "Dealership Parts Director",
            role: "admin",
            department: "Executive & Inventory Control",
            active: true,
            created_at: new Date().toISOString(),
          };
          setCurrentUser(fallbackAdmin);
          setIsAuthenticated(true);
          setAuthError(null);
          if (typeof window !== "undefined") {
            localStorage.setItem("nissan_staff_session", JSON.stringify(fallbackAdmin));
          }
        } else {
          setAuthError(json.error || "Invalid credentials. Use demo passkey 'nissan2024'");
        }
      }
    } catch (err: any) {
      if (passcode.trim() === DEMO_PASSCODE) {
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setAuthError("Failed to authenticate. Use demo passkey 'nissan2024'");
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
    if (typeof window !== "undefined") {
      localStorage.removeItem("nissan_staff_session");
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
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
        setNewStaffPassword("nissan2024");
        loadStaffUsers();
      }
    } catch (err: any) {
      setAddStaffError(err.message || "Failed to create staff member");
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  const handleOpenEditModal = (user: StaffUserPublic) => {
    setEditingUser(user);
    setEditFullName(user.full_name);
    setEditEmail(user.email);
    setEditDepartment(user.department || "Parts Counter");
    setEditRole(user.role);
    setEditPassword("");
    setEditUserError(null);
  };

  const handleUpdateStaffUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSubmittingEdit(true);
    setEditUserError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(currentUser?.role ? { "x-staff-role": currentUser.role, "x-staff-id": currentUser.id } : { "x-staff-role": "admin" }),
        },
        body: JSON.stringify({
          id: editingUser.id,
          full_name: editFullName,
          email: editEmail,
          department: editDepartment,
          role: editRole,
          ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setEditUserError(json.error || "Failed to update staff user");
      } else {
        setStaffUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...json.data } : u))
        );
        setEditingUser(null);
      }
    } catch (err: any) {
      setEditUserError(err.message || "Failed to update staff user");
    } finally {
      setIsSubmittingEdit(false);
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
    if (!confirm(`Are you sure you want to permanently delete staff member '${username}'?`)) return;

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

  // Filter staff users based on client-side status and search query
  const filteredUsers = staffUsers.filter((u) => {
    if (staffStatusFilter === "active" && !u.active) return false;
    if (staffStatusFilter === "inactive" && u.active) return false;
    if (staffSearchQuery.trim()) {
      const q = staffSearchQuery.toLowerCase();
      return (
        u.username.toLowerCase().includes(q) ||
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // KPI calculations
  const totalCount = staffUsers.length;
  const activeCount = staffUsers.filter((u) => u.active).length;
  const adminCount = staffUsers.filter((u) => u.role === "admin").length;
  const clerkCount = staffUsers.filter((u) => u.role === "counter_clerk").length;
  const advisorCount = staffUsers.filter((u) => u.role === "service_advisor").length;

  // 1. Initial Loading Screen
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-400 text-xs">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-red-500" />
        <span>Authenticating staff session...</span>
      </div>
    );
  }

  // 2. Passcode Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="w-full max-w-md p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold text-center text-white">Dealership User Management</h2>
          <p className="text-xs text-center text-slate-400 mt-1 mb-5">
            Sign in with Administrator credentials to access staff accounts & RBAC.
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
            <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Staff Username
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
              {isLoggingIn ? "Authenticating..." : "Sign In to User Management"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Customer Parts Finder
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. RBAC Gate: Non-admin staff blocked from User Management
  if (currentUser && currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="w-full max-w-lg p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-5 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Administrator Access Required</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              You are currently authenticated as <strong className="text-white">{currentUser.full_name}</strong> (
              <span className="text-amber-400 font-mono">{currentUser.role.replace("_", " ")}</span>).
              Under Dealership RBAC policies, User Management is strictly restricted to Administrators.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2">
            <div className="font-semibold text-slate-300">Your Current Permissions:</div>
            {currentUser.role === "counter_clerk" ? (
              <p className="text-slate-400 text-[11px] leading-relaxed">
                As a Parts Counter Clerk, you can view and fulfill customer quote inquiries, toggle stock status, and look up vehicle fitment in the Admin Console.
              </p>
            ) : (
              <p className="text-slate-400 text-[11px] leading-relaxed">
                As a Service Advisor, you have read-only access to catalog search, vehicle compatibility matrix lookups, and quote drafting.
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Return to Admin Console
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Switch Account (Login as Admin)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated Administrator User Management Workspace
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/90 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  NISSAN <span className="text-red-500">USER MANAGEMENT</span>
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-800/50">
                  STAFF & RBAC DIRECTORY
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {currentUser && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
                    {currentUser.full_name ? currentUser.full_name.charAt(0) : "A"}
                  </div>
                  <div>
                    <div className="font-semibold text-white leading-tight">{currentUser.full_name}</div>
                    <div className="text-[10px] text-slate-400">{currentUser.department}</div>
                  </div>
                  <span className="ml-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-950 text-red-300 border border-red-800/50">
                    Admin
                  </span>
                </div>
              )}

              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
                title="Return to Parts & Inquiries Admin Dashboard"
              >
                <Wrench className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Admin Overview</span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
                title="Open Public Customer Parts Finder"
              >
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Parts Finder UI</span>
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

      {/* Main Workspace Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Breadcrumb / Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link href="/admin" className="hover:text-white transition-colors">Admin Console</Link>
              <span>/</span>
              <span className="text-white font-medium">User Management Module</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Dealership Staff & User Accounts</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                RBAC v2.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Add new staff members, configure role-based permissions (Admin, Counter Clerk, Service Advisor), and manage dealership security.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddStaffModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          </div>
        </div>

        {/* Staff KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Total Staff
            </div>
            <div className="text-2xl font-black text-white">{totalCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Registered Users</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Active Accounts
            </div>
            <div className="text-2xl font-black text-emerald-400">{activeCount}</div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">Can Sign In</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-red-950/60">
            <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
              Parts Managers
            </div>
            <div className="text-2xl font-black text-white">{adminCount}</div>
            <div className="text-[11px] text-red-300 mt-0.5">Full Admin Access</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-950/60">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Counter Clerks
            </div>
            <div className="text-2xl font-black text-white">{clerkCount}</div>
            <div className="text-[11px] text-blue-300 mt-0.5">Sales Fulfillment</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-950/60">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Service Advisors
            </div>
            <div className="text-2xl font-black text-white">{advisorCount}</div>
            <div className="text-[11px] text-emerald-300 mt-0.5">Workshop Read-Only</div>
          </div>
        </div>

        {/* RBAC Role Cards */}
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

        {/* Staff Directory Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto flex-1">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadStaffUsers(staffRoleFilter, staffSearchQuery)}
                placeholder="Search name, username, email, department..."
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
              <option value="all">All Roles</option>
              <option value="admin">Administrator (Admin)</option>
              <option value="counter_clerk">Counter Clerk (Sales)</option>
              <option value="service_advisor">Service Advisor (Workshop)</option>
            </select>

            <select
              value={staffStatusFilter}
              onChange={(e) => setStaffStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            <button
              type="button"
              onClick={() => loadStaffUsers(staffRoleFilter, staffSearchQuery)}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Filter
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => loadStaffUsers(staffRoleFilter, staffSearchQuery)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStaffUsers ? "animate-spin" : ""}`} />
              <span>Refresh</span>
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
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-red-500" />
                    <span>Loading dealership staff directory...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No staff user accounts found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
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
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title={`Edit ${user.full_name}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {currentUser?.id === user.id ? (
                          <span className="text-[10px] text-slate-600 px-1 italic">Active</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteStaffUser(user.id, user.username)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                            title={`Delete staff user ${user.username}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </main>

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
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Edit Staff Member (@{editingUser.username})</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {editUserError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
                {editUserError}
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
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
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
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
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
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Role Permission
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as StaffRole)}
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
                  Reset Password (leave empty to keep current password)
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Enter new password if changing..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono placeholder-slate-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  {isSubmittingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

