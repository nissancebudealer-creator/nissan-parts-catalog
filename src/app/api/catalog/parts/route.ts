import { NextRequest, NextResponse } from "next/server";
import { getCatalogRepository } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get("modelId") || undefined;
    const modelName = searchParams.get("modelName") || undefined;
    const variantId = searchParams.get("variantId") || undefined;
    const variantName = searchParams.get("variantName") || undefined;
    const yearStr = searchParams.get("year");
    const year = yearStr ? parseInt(yearStr, 10) : undefined;
    const description = searchParams.get("description") || undefined;
    const category = searchParams.get("category") || undefined;

    const repository = getCatalogRepository();
    const parts = await repository.searchParts({
      modelId,
      modelName,
      variantId,
      variantName,
      year,
      description,
      category,
    });

    return NextResponse.json({
      success: true,
      total: parts.length,
      data: parts,
      source: process.env.NEXT_PUBLIC_SUPABASE_URL ? "supabase" : "demo_database",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search parts" },
      { status: 500 }
    );
  }
}
