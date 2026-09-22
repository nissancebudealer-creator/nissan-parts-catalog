import { NextRequest, NextResponse } from "next/server";
import { getCatalogRepository } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get("modelId");
    const variantId = searchParams.get("variantId") || undefined;

    if (!modelId) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'modelId' is required" },
        { status: 400 }
      );
    }

    const repository = getCatalogRepository();
    const years = await repository.getYearsByModel(modelId, variantId);

    return NextResponse.json({
      success: true,
      data: years,
      source: process.env.NEXT_PUBLIC_SUPABASE_URL ? "supabase" : "demo_database",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch vehicle years" },
      { status: 500 }
    );
  }
}
