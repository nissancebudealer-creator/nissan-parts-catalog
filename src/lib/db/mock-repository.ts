import {
  VehicleModelEntity,
  VehicleVariantEntity,
  VehicleYearEntity,
  PartEntity,
  PartCatalogItem,
} from "@/types/catalog";
import { CatalogRepository, PartSearchCriteria } from "./types";
import {
  VEHICLE_MODELS_DATA,
  VEHICLE_VARIANTS_DATA,
  VEHICLE_YEARS_DATA,
  PARTS_DATA,
  PART_COMPATIBILITY_DATA,
} from "./mock-data";

export class MockCatalogRepository implements CatalogRepository {
  async getModels(): Promise<VehicleModelEntity[]> {
    return VEHICLE_MODELS_DATA.filter((m) => m.active);
  }

  async getModelById(id: string): Promise<VehicleModelEntity | null> {
    const found = VEHICLE_MODELS_DATA.find(
      (m) => m.id === id || m.model_name.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  }

  async getVariantsByModel(modelId: string): Promise<VehicleVariantEntity[]> {
    // Also support passing model name directly
    const resolvedModel = await this.getModelById(modelId);
    const targetId = resolvedModel ? resolvedModel.id : modelId;
    return VEHICLE_VARIANTS_DATA.filter(
      (v) => v.model_id === targetId && v.active
    );
  }

  async getYearsByModel(modelId: string, _variantId?: string): Promise<VehicleYearEntity[]> {
    const resolvedModel = await this.getModelById(modelId);
    const targetId = resolvedModel ? resolvedModel.id : modelId;
    return VEHICLE_YEARS_DATA.filter(
      (y) => y.model_id === targetId && y.active
    ).sort((a, b) => b.year - a.year);
  }

  async getAllParts(): Promise<PartEntity[]> {
    return PARTS_DATA.filter((p) => p.active);
  }

  async getPartById(id: string): Promise<PartCatalogItem | null> {
    const part = PARTS_DATA.find((p) => p.id === id || p.part_number === id);
    if (!part || !part.active) return null;

    // Find sample compatibility mapping
    const compat = PART_COMPATIBILITY_DATA.find((c) => c.part_id === part.id);
    const model = compat ? VEHICLE_MODELS_DATA.find((m) => m.id === compat.model_id)?.model_name || "Nissan" : "Nissan";
    const variant = compat && compat.variant_id ? VEHICLE_VARIANTS_DATA.find((v) => v.id === compat.variant_id)?.variant_name || "All Variants" : "All Variants";
    const year = compat && compat.year_id ? VEHICLE_YEARS_DATA.find((y) => y.id === compat.year_id)?.year || 2024 : 2024;

    return {
      id: part.id,
      partNumber: part.part_number,
      partDescription: part.part_description,
      category: part.category,
      subcategory: part.subcategory,
      model,
      variant,
      year,
      availability: "Available",
      genuineStatus: "Nissan Genuine Part",
      position: compat?.notes || "Standard Fitment",
      remarks: part.notes,
      imageUrl: part.image_url,
    };
  }

  async searchParts(criteria: PartSearchCriteria): Promise<PartCatalogItem[]> {
    let matchingPartIds: Set<string> | null = null;

    // Resolve model ID if criteria has modelId or modelName
    let resolvedModelId = criteria.modelId;
    if (!resolvedModelId && criteria.modelName) {
      const m = await this.getModelById(criteria.modelName);
      if (m) resolvedModelId = m.id;
    }

    // Resolve variant ID if criteria has variantId or variantName
    let resolvedVariantId = criteria.variantId;
    if (!resolvedVariantId && criteria.variantName && resolvedModelId) {
      const variants = await this.getVariantsByModel(resolvedModelId);
      const v = variants.find(
        (item) => item.variant_name.toLowerCase() === criteria.variantName?.toLowerCase()
      );
      if (v) resolvedVariantId = v.id;
    }

    // Resolve year ID if year provided
    let resolvedYearId: string | undefined;
    if (criteria.year && resolvedModelId) {
      const yearRecord = VEHICLE_YEARS_DATA.find(
        (y) => y.model_id === resolvedModelId && y.year === criteria.year
      );
      if (yearRecord) resolvedYearId = yearRecord.id;
    }

    // If any vehicle filter is active, evaluate compatibility table
    if (resolvedModelId || resolvedVariantId || resolvedYearId) {
      matchingPartIds = new Set<string>();

      for (const cmp of PART_COMPATIBILITY_DATA) {
        if (!cmp.active) continue;

        // Model check
        if (resolvedModelId && cmp.model_id !== resolvedModelId) {
          continue;
        }

        // Variant check (if variant_id is set in compatibility, must match; if null, applies to all variants)
        if (resolvedVariantId && cmp.variant_id && cmp.variant_id !== resolvedVariantId) {
          continue;
        }

        // Year check (if year_id is set in compatibility, must match; if null, applies to all years)
        if (resolvedYearId && cmp.year_id && cmp.year_id !== resolvedYearId) {
          continue;
        }

        matchingPartIds.add(cmp.part_id);
      }
    }

    // Filter parts
    const results: PartCatalogItem[] = [];
    const query = criteria.description?.trim().toLowerCase();
    const category = criteria.category?.trim().toLowerCase();

    for (const part of PARTS_DATA) {
      if (!part.active) continue;

      // Filter by compatibility if vehicle was selected
      if (matchingPartIds !== null && !matchingPartIds.has(part.id)) {
        continue;
      }

      // Filter by category
      if (category && category !== "all" && part.category.toLowerCase() !== category) {
        continue;
      }

      // Partial case-insensitive text match on part number, description, notes, subcategory
      if (query) {
        const matchesDesc = part.part_description.toLowerCase().includes(query);
        const matchesNum = part.part_number.toLowerCase().includes(query);
        const matchesCat = part.category.toLowerCase().includes(query);
        const matchesSub = part.subcategory?.toLowerCase().includes(query) ?? false;
        const matchesNotes = part.notes?.toLowerCase().includes(query) ?? false;

        if (!matchesDesc && !matchesNum && !matchesCat && !matchesSub && !matchesNotes) {
          continue;
        }
      }

      // Find relevant compatibility info to enrich the result item
      const compat = PART_COMPATIBILITY_DATA.find((c) => c.part_id === part.id);
      const model = compat
        ? VEHICLE_MODELS_DATA.find((m) => m.id === cmpModelId(compat))?.model_name || "Nissan"
        : criteria.modelName || "Nissan";
      const variant = compat && compat.variant_id
        ? VEHICLE_VARIANTS_DATA.find((v) => v.id === compat.variant_id)?.variant_name || "All Variants"
        : criteria.variantName || "All Variants";
      const yearVal = criteria.year || 2024;

      results.push({
        id: part.id,
        partNumber: part.part_number,
        partDescription: part.part_description,
        category: part.category,
        subcategory: part.subcategory,
        model,
        variant,
        year: yearVal,
        availability: "Available",
        genuineStatus: "Nissan Genuine Part",
        position: compat?.notes || "Standard Fitment",
        remarks: part.notes,
        imageUrl: part.image_url,
      });
    }

    return results;
  }
}

function cmpModelId(c: any): string {
  return c.model_id;
}
