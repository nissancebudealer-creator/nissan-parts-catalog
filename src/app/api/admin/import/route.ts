import { NextRequest, NextResponse } from "next/server";
import { parsePartsCsv } from "@/lib/importer/csv-parser";
import { importPartsData } from "@/lib/importer/parts-importer";

export async function POST(request: NextRequest) {
  try {
    let csvContent = "";
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json(
          { success: false, error: "No CSV file provided in upload" },
          { status: 400 }
        );
      }
      csvContent = await file.text();
    } else {
      const body = await request.json();
      csvContent = body.csvContent || "";
    }

    if (!csvContent || !csvContent.trim()) {
      return NextResponse.json(
        { success: false, error: "CSV content is empty" },
        { status: 400 }
      );
    }

    // 1. Parse CSV
    const parseResult = parsePartsCsv(csvContent);
    if (parseResult.errors.length > 0 && parseResult.validRows === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "CSV Parsing failed",
          details: parseResult.errors,
        },
        { status: 422 }
      );
    }

    // 2. Import into Normalized Data Layer
    const importSummary = await importPartsData(parseResult.rows);

    return NextResponse.json({
      success: true,
      parseStats: {
        totalRows: parseResult.totalRows,
        validRows: parseResult.validRows,
        parseErrors: parseResult.errors,
      },
      importSummary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process data import" },
      { status: 500 }
    );
  }
}
