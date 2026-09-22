import {
  VehicleModelEntity,
  VehicleVariantEntity,
  VehicleYearEntity,
  PartEntity,
  PartCatalogItem,
} from "@/types/catalog";

export interface PartSearchCriteria {
  modelId?: string;
  modelName?: string;
  variantId?: string;
  variantName?: string;
  year?: number;
  description?: string;
  category?: string;
}

export interface CatalogRepository {
  // Vehicle lookups
  getModels(): Promise<VehicleModelEntity[]>;
  getModelById(id: string): Promise<VehicleModelEntity | null>;
  getVariantsByModel(modelId: string): Promise<VehicleVariantEntity[]>;
  getYearsByModel(modelId: string, variantId?: string): Promise<VehicleYearEntity[]>;

  // Part search
  searchParts(criteria: PartSearchCriteria): Promise<PartCatalogItem[]>;
  getPartById(id: string): Promise<PartCatalogItem | null>;
  getAllParts(): Promise<PartEntity[]>;
}
