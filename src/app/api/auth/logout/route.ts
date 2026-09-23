import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set({
    name: "nissan_staff_session",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}

