import { NextRequest, NextResponse } from "next/server";
import { STAFF_USERS_DATA } from "@/lib/db/mock-data";
import { StaffUserPublic } from "@/types/catalog";
import { sanitizeText } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const cleanUser = sanitizeText(username).trim().toLowerCase();
    const user = STAFF_USERS_DATA.find(
      (u) =>
        u.username.toLowerCase() === cleanUser ||
        u.email.toLowerCase() === cleanUser
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid staff username or credentials" },
        { status: 401 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        { success: false, error: "This staff account has been deactivated. Contact dealership admin." },
        { status: 403 }
      );
    }

    // Verify password (matches password_hash or fallback demo passcode)
    if (user.password_hash !== password && password !== "nissan2024") {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    // Record login timestamp
    user.last_login = new Date().toISOString();

    const publicProfile: StaffUserPublic = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      department: user.department,
      active: user.active,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const sessionPayload = Buffer.from(
      JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        exp: Date.now() + 86400000,
      })
    ).toString("base64");

    const response = NextResponse.json({
      success: true,
      user: publicProfile,
      token: sessionPayload,
      message: `Welcome, ${user.full_name}`,
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: "nissan_staff_session",
      value: sessionPayload,
      httpOnly: true,
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}

