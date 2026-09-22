/**
 * Normalized Automotive Parts Importer Engine
 * Handles relational normalization, validation, deduplication, and bulk insertion
 * for thousands of Nissan parts across Model -> Variant -> Year -> Compatibility.
 */

import { ParsedCsvRow } from "./csv-parser";
import {
  VEHICLE_MODELS_DATA,
  VEHICLE_VARIANTS_DATA,
  VEHICLE_YEARS_DATA,
  PARTS_DATA,
  PART_COMPATIBILITY_DATA,
} from "@/lib/db/mock-data";

export interface ImportSummary {
  totalProcessed: number;
  successful: number;
  newPartsCount: number;
  updatedPartsCount: number;
  newCompatibilitiesCount: number;
  errors: { row: number; error: string }[];
}

export async function importPartsData(rows: ParsedCsvRow[]): Promise<ImportSummary> {
  const summary: ImportSummary = {
    totalProcessed: rows.length,
    successful: 0,
    newPartsCount: 0,
    updatedPartsCount: 0,
    newCompatibilitiesCount: 0,
    errors: [],
  };

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const rowNumber = idx + 2; // account for 1-based index and header row

    try {
      // 1. Resolve or Create Vehicle Model
      const modelNameClean = row.model.trim();
      let model = VEHICLE_MODELS_DATA.find(
        (m) => m.model_name.toLowerCase() === modelNameClean.toLowerCase()
      );

      if (!model) {
        const newModelId = `mod-${modelNameClean.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
        model = {
          id: newModelId,
          model_name: modelNameClean,
          model_code: modelNameClean.slice(0, 3).toUpperCase(),
          active: true,
        };
        VEHICLE_MODELS_DATA.push(model);
      }

      // 2. Resolve or Create Vehicle Variant
      const variantNameClean = row.variant.trim();
      let variant = VEHICLE_VARIANTS_DATA.find(
        (v) =>
          v.model_id === model!.id &&
          v.variant_name.toLowerCase() === variantNameClean.toLowerCase()
      );

      if (!variant) {
        const newVariantId = `var-${model.id}-${variantNameClean.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10)}`;
        variant = {
          id: newVariantId,
          model_id: model.id,
          variant_name: variantNameClean,
          variant_code: variantNameClean.slice(0, 8).toUpperCase(),
          engine: "Standard Spec",
          transmission: "Standard Transmission",
          drivetrain: variantNameClean.includes("4x4") ? "4x4" : "4x2",
          active: true,
        };
        VEHICLE_VARIANTS_DATA.push(variant);
      }

      // 3. Resolve or Create Vehicle Year
      let yearRecord = VEHICLE_YEARS_DATA.find(
        (y) => y.model_id === model!.id && y.year === row.year
      );

      if (!yearRecord) {
        const newYearId = `yr-${model.id}-${row.year}`;
        yearRecord = {
          id: newYearId,
          model_id: model.id,
          year: row.year,
          active: true,
        };
        VEHICLE_YEARS_DATA.push(yearRecord);
      }

      // 4. Upsert Part Master Record
      const partNumClean = row.part_number.trim().toUpperCase();
      let part = PARTS_DATA.find((p) => p.part_number.toUpperCase() === partNumClean);

      if (!part) {
        const newPartId = `prt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        part = {
          id: newPartId,
          part_number: partNumClean,
          part_description: row.part_description.trim(),
          category: row.category.trim(),
          subcategory: row.subcategory?.trim(),
          notes: row.notes?.trim(),
          active: true,
        };
        PARTS_DATA.push(part);
        summary.newPartsCount++;
      } else {
        // Update fields if provided
        part.part_description = row.part_description.trim();
        part.category = row.category.trim();
        if (row.subcategory) part.subcategory = row.subcategory.trim();
        if (row.notes) part.notes = row.notes.trim();
        summary.updatedPartsCount++;
      }

      // 5. Create Part Compatibility Link
      const existingCompat = PART_COMPATIBILITY_DATA.find(
        (c) =>
          c.part_id === part!.id &&
          c.model_id === model!.id &&
          c.variant_id === variant!.id &&
          c.year_id === yearRecord!.id
      );

      if (!existingCompat) {
        const newCompatId = `cmp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        PART_COMPATIBILITY_DATA.push({
          id: newCompatId,
          part_id: part.id,
          model_id: model.id,
          variant_id: variant.id,
          year_id: yearRecord.id,
          notes: row.position || row.notes || undefined,
          active: true,
        });
        summary.newCompatibilitiesCount++;
      }

      summary.successful++;
    } catch (err: any) {
      summary.errors.push({
        row: rowNumber,
        error: err.message || "Failed to process row",
      });
    }
  }

  return summary;
}
