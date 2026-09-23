import { NextRequest, NextResponse } from "next/server";
import { STAFF_USERS_DATA } from "@/lib/db/mock-data";
import { StaffUserEntity, StaffUserPublic, StaffRole } from "@/types/catalog";
import { sanitizeText } from "@/lib/security";

/**
 * Helper to authenticate and extract the calling staff member
 */
function resolveRequester(request: NextRequest): { id?: string; role?: StaffRole } {
  // Check direct test/API headers
  const roleHeader = request.headers.get("x-staff-role") as StaffRole | null;
  const idHeader = request.headers.get("x-staff-id");

  if (roleHeader) {
    return { id: idHeader || undefined, role: roleHeader };
  }

  // Check session cookie
  const sessionCookie = request.cookies.get("nissan_staff_session")?.value;
  if (sessionCookie) {
    try {
      const decoded = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));
      return { id: decoded.id, role: decoded.role };
    } catch (e) {
      // invalid
    }
  }

  // Check Bearer authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      return { id: decoded.id, role: decoded.role };
    } catch (e) {
      // invalid
    }
  }

  // Fallback demo admin if none provided
  return { role: "admin" };
}

function toPublicUser(user: StaffUserEntity): StaffUserPublic {
  const { password_hash, ...rest } = user;
  return rest;
}

export async function GET(request: NextRequest) {
  try {
    const requester = resolveRequester(request);

    // Enforce Admin RBAC
    if (requester.role && requester.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Access denied. Only Administrators can manage staff users." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get("role") as StaffRole | null;
    const query = searchParams.get("query")?.toLowerCase();

    let users = [...STAFF_USERS_DATA];

    if (roleFilter && ["admin", "counter_clerk", "service_advisor"].includes(roleFilter)) {
      users = users.filter((u) => u.role === roleFilter);
    }

    if (query) {
      users = users.filter(
        (u) =>
          u.username.toLowerCase().includes(query) ||
          u.full_name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.department.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      total: users.length,
      data: users.map(toPublicUser),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve staff users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const requester = resolveRequester(request);

    if (requester.role && requester.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Access denied. Only Administrators can add staff users." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, email, full_name, role, department, password } = body;

    if (!username || !email || !full_name || !role) {
      return NextResponse.json(
        { success: false, error: "Username, email, full name, and role are required." },
        { status: 400 }
      );
    }

    if (!["admin", "counter_clerk", "service_advisor"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid staff role specified." },
        { status: 400 }
      );
    }

    const cleanUsername = sanitizeText(username).trim().toLowerCase();
    const cleanEmail = sanitizeText(email).trim().toLowerCase();

    // Check uniqueness
    const exists = STAFF_USERS_DATA.find(
      (u) =>
        u.username.toLowerCase() === cleanUsername ||
        u.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      return NextResponse.json(
        { success: false, error: `Staff member with username or email already exists.` },
        { status: 409 }
      );
    }

    const newUser: StaffUserEntity = {
      id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      username: cleanUsername,
      email: cleanEmail,
      full_name: sanitizeText(full_name).trim(),
      role: role as StaffRole,
      department: department ? sanitizeText(department).trim() : "Parts Counter",
      password_hash: password ? sanitizeText(password) : "nissan2024",
      active: true,
      created_at: new Date().toISOString(),
    };

    STAFF_USERS_DATA.push(newUser);

    return NextResponse.json(
      {
        success: true,
        data: toPublicUser(newUser),
        message: "Staff account created successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create staff user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const requester = resolveRequester(request);

    if (requester.role && requester.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Access denied. Only Administrators can update staff users." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, role, department, full_name, email, active, password } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Staff User ID is required." },
        { status: 400 }
      );
    }

    const user = STAFF_USERS_DATA.find((u) => u.id === id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Staff user record not found." },
        { status: 404 }
      );
    }

    if (role && ["admin", "counter_clerk", "service_advisor"].includes(role)) {
      user.role = role as StaffRole;
    }
    if (department) user.department = sanitizeText(department).trim();
    if (full_name) user.full_name = sanitizeText(full_name).trim();
    if (email) user.email = sanitizeText(email).trim().toLowerCase();
    if (typeof active === "boolean") user.active = active;
    if (password) user.password_hash = sanitizeText(password);

    user.updated_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: toPublicUser(user),
      message: "Staff user updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update staff user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const requester = resolveRequester(request);

    if (requester.role && requester.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Access denied. Only Administrators can delete staff users." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Staff User ID is required." },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (requester.id && requester.id === id) {
      return NextResponse.json(
        { success: false, error: "Cannot delete your own active administrator account." },
        { status: 400 }
      );
    }

    const index = STAFF_USERS_DATA.findIndex((u) => u.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Staff user record not found." },
        { status: 404 }
      );
    }

    const removed = STAFF_USERS_DATA.splice(index, 1)[0];

    return NextResponse.json({
      success: true,
      data: toPublicUser(removed),
      message: `Staff account ${removed.username} removed successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete staff user" },
      { status: 500 }
    );
  }
}

