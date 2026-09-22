import { NextResponse } from "next/server";
import {
  VEHICLE_MODELS_DATA,
  VEHICLE_VARIANTS_DATA,
  VEHICLE_YEARS_DATA,
  PARTS_DATA,
  PART_COMPATIBILITY_DATA,
} from "@/lib/db/mock-data";

export async function GET() {
  try {
    const headers = [
      "model",
      "variant",
      "year",
      "part_number",
      "part_description",
      "category",
      "subcategory",
      "position",
      "notes",
    ];

    const rows: string[] = [headers.join(",")];

    for (const cmp of PART_COMPATIBILITY_DATA) {
      const part = PARTS_DATA.find((p) => p.id === cmp.part_id);
      if (!part) continue;

      const model = VEHICLE_MODELS_DATA.find((m) => m.id === cmp.model_id);
      const variant = cmp.variant_id
        ? VEHICLE_VARIANTS_DATA.find((v) => v.id === cmp.variant_id)?.variant_name || ""
        : "All";
      const year = cmp.year_id
        ? VEHICLE_YEARS_DATA.find((y) => y.id === cmp.year_id)?.year.toString() || ""
        : "All";

      const escape = (val?: string) => {
        if (!val) return "";
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      const line = [
        escape(model?.model_name || "Nissan"),
        escape(variant),
        escape(year),
        escape(part.part_number),
        escape(part.part_description),
        escape(part.category),
        escape(part.subcategory || ""),
        escape(cmp.notes || ""),
        escape(part.notes || ""),
      ].join(",");

      rows.push(line);
    }

    const csvOutput = rows.join("\n");

    return new NextResponse(csvOutput, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="nissan-parts-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to export catalog" },
      { status: 500 }
    );
  }
}
