import { NextResponse } from "next/server";
import { getCatalogRepository } from "@/lib/db";

export async function GET() {
  try {
    const repository = getCatalogRepository();
    const models = await repository.getModels();
    return NextResponse.json({
      success: true,
      data: models,
      source: process.env.NEXT_PUBLIC_SUPABASE_URL ? "supabase" : "demo_database",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch vehicle models" },
      { status: 500 }
    );
  }
}
