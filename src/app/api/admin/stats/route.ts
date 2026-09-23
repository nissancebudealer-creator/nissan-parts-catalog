import { NextResponse } from "next/server";
import {
  VEHICLE_MODELS_DATA,
  VEHICLE_VARIANTS_DATA,
  VEHICLE_YEARS_DATA,
  PARTS_DATA,
  PART_COMPATIBILITY_DATA,
  STAFF_USERS_DATA,
} from "@/lib/db/mock-data";

export async function GET() {
  try {
    const stats = {
      totalModels: VEHICLE_MODELS_DATA.length,
      activeModels: VEHICLE_MODELS_DATA.filter((m) => m.active).length,
      totalVariants: VEHICLE_VARIANTS_DATA.length,
      activeVariants: VEHICLE_VARIANTS_DATA.filter((v) => v.active).length,
      totalYears: VEHICLE_YEARS_DATA.length,
      totalParts: PARTS_DATA.length,
      activeParts: PARTS_DATA.filter((p) => p.active).length,
      totalCompatibilities: PART_COMPATIBILITY_DATA.length,
      activeCompatibilities: PART_COMPATIBILITY_DATA.filter((c) => c.active).length,
      totalStaff: STAFF_USERS_DATA.length,
      activeStaff: STAFF_USERS_DATA.filter((s) => s.active).length,
    };

    return NextResponse.json({
      success: true,
      stats,
      mode: process.env.NEXT_PUBLIC_SUPABASE_URL ? "supabase" : "demo_database",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
