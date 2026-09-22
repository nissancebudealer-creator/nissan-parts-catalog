import {
  VehicleModelEntity,
  VehicleVariantEntity,
  VehicleYearEntity,
  PartEntity,
  PartCatalogItem,
} from "@/types/catalog";
import { CatalogRepository, PartSearchCriteria } from "./types";

export class SupabaseCatalogRepository implements CatalogRepository {
  private url: string;
  private anonKey: string;

  constructor(url: string, anonKey: string) {
    this.url = url.replace(/\/$/, "");
    this.anonKey = anonKey;
  }

  private async fetchSupabase<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.url}/rest/v1/${endpoint}`, {
      ...options,
      headers: {
        apikey: this.anonKey,
        Authorization: `Bearer ${this.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...options.headers,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Supabase query error [${res.status}]: ${errorText}`);
    }

    return res.json();
  }

  async getModels(): Promise<VehicleModelEntity[]> {
    return this.fetchSupabase<VehicleModelEntity[]>(
      "vehicle_models?active=eq.true&order=model_name.asc"
    );
  }

  async getModelById(id: string): Promise<VehicleModelEntity | null> {
    const records = await this.fetchSupabase<VehicleModelEntity[]>(
      `vehicle_models?id=eq.${encodeURIComponent(id)}&limit=1`
    );
    return records[0] || null;
  }

  async getVariantsByModel(modelId: string): Promise<VehicleVariantEntity[]> {
    return this.fetchSupabase<VehicleVariantEntity[]>(
      `vehicle_variants?model_id=eq.${encodeURIComponent(modelId)}&active=eq.true&order=variant_name.asc`
    );
  }

  async getYearsByModel(modelId: string, _variantId?: string): Promise<VehicleYearEntity[]> {
    return this.fetchSupabase<VehicleYearEntity[]>(
      `vehicle_years?model_id=eq.${encodeURIComponent(modelId)}&active=eq.true&order=year.desc`
    );
  }

  async getAllParts(): Promise<PartEntity[]> {
    return this.fetchSupabase<PartEntity[]>("parts?active=eq.true&order=part_description.asc");
  }

  async getPartById(id: string): Promise<PartCatalogItem | null> {
    const parts = await this.fetchSupabase<PartEntity[]>(
      `parts?id=eq.${encodeURIComponent(id)}&limit=1`
    );
    const part = parts[0];
    if (!part) return null;

    return {
      id: part.id,
      partNumber: part.part_number,
      partDescription: part.part_description,
      category: part.category,
      subcategory: part.subcategory,
      model: "Nissan",
      variant: "OEM Fitment",
      year: "2024",
      availability: "Available",
      genuineStatus: "Nissan Genuine Part",
      remarks: part.notes,
      imageUrl: part.image_url,
    };
  }

  async searchParts(criteria: PartSearchCriteria): Promise<PartCatalogItem[]> {
    let queryParams: string[] = ["active=eq.true"];

    if (criteria.category && criteria.category !== "all") {
      queryParams.push(`category=ilike.*${encodeURIComponent(criteria.category)}*`);
    }

    if (criteria.description) {
      const q = encodeURIComponent(criteria.description.trim());
      queryParams.push(`or=(part_description.ilike.*${q}*,part_number.ilike.*${q}*,notes.ilike.*${q}*)`);
    }

    // Check compatibility if modelId is specified
    if (criteria.modelId) {
      let compatQuery = `model_id=eq.${encodeURIComponent(criteria.modelId)}`;
      if (criteria.variantId) {
        compatQuery += `&or=(variant_id.eq.${encodeURIComponent(criteria.variantId)},variant_id.is.null)`;
      }

      const compats = await this.fetchSupabase<{ part_id: string }[]>(
        `part_compatibility?${compatQuery}&select=part_id`
      );

      const partIds = compats.map((c) => c.part_id);
      if (partIds.length === 0) {
        return [];
      }
      queryParams.push(`id=in.(${partIds.join(",")})`);
    }

    const matchedParts = await this.fetchSupabase<PartEntity[]>(
      `parts?${queryParams.join("&")}&order=part_description.asc`
    );

    return matchedParts.map((p) => ({
      id: p.id,
      partNumber: p.part_number,
      partDescription: p.part_description,
      category: p.category,
      subcategory: p.subcategory,
      model: criteria.modelName || "Nissan",
      variant: criteria.variantName || "OEM Specification",
      year: criteria.year || 2024,
      availability: "Available",
      genuineStatus: "Nissan Genuine Part",
      remarks: p.notes,
      imageUrl: p.image_url,
    }));
  }
}
