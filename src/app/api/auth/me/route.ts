import { NextRequest, NextResponse } from "next/server";
import { STAFF_USERS_DATA } from "@/lib/db/mock-data";
import { StaffUserPublic } from "@/types/catalog";

export async function GET(request: NextRequest) {
  try {
    let sessionCookie: string | undefined = undefined;
    if (request.cookies && typeof request.cookies.get === "function") {
      sessionCookie = request.cookies.get("nissan_staff_session")?.value;
    }
    if (!sessionCookie) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/nissan_staff_session=([^;]+)/);
        if (match) {
          sessionCookie = decodeURIComponent(match[1]);
        }
      }
    }

    const authHeader = request.headers.get("authorization");
    const staffIdHeader = request.headers.get("x-staff-id");

    let userId: string | null = null;

    if (staffIdHeader) {
      userId = staffIdHeader;
    } else if (sessionCookie) {
      try {
        const decoded = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));
        userId = decoded.id;
      } catch (e) {
        try {
          const decoded = JSON.parse(sessionCookie);
          userId = decoded.id;
        } catch (e2) {
          // invalid cookie format
        }
      }
    } else if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.slice(7);
        const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
        userId = decoded.id;
      } catch (e) {
        try {
          const decoded = JSON.parse(authHeader.slice(7));
          userId = decoded.id;
        } catch (e2) {
          // invalid token
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = STAFF_USERS_DATA.find((u) => u.id === userId && u.active);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User session expired or user deactivated" },
        { status: 401 }
      );
    }

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

    return NextResponse.json({
      success: true,
      user: publicProfile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
