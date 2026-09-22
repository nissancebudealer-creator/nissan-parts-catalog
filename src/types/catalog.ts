/**
 * Nissan Automotive Parts Catalog - Data Architecture & Type Definitions
 * Based on normalized master data entities defined in Section 6.
 */

// ==========================================
// Normalized Master Data Entities (Section 6)
// ==========================================

export interface VehicleModelEntity {
  id: string;
  model_name: string;
  model_code: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleVariantEntity {
  id: string;
  model_id: string;
  variant_name: string;
  variant_code: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleYearEntity {
  id: string;
  model_id: string;
  year: number;
  active: boolean;
}

export interface PartEntity {
  id: string;
  part_number: string;
  part_description: string;
  category: string;
  subcategory?: string;
  image_url?: string;
  notes?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PartCompatibilityEntity {
  id: string;
  part_id: string;
  model_id: string;
  variant_id?: string;
  year_id?: string;
  notes?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ==========================================
// Frontend & Search UI Models
// ==========================================

export interface SearchFilterState {
  model: string;
  variant: string;
  year: string;
  category: string;
  description: string;
}

export interface PartCatalogItem {
  id: string;
  partNumber: string;
  partDescription: string;
  category: string;
  subcategory?: string;
  model: string;
  variant: string;
  year: number | string;
  availability: "Available" | "Low Stock" | "Special Order";
  genuineStatus: "Nissan Genuine Part" | "Nissan Value Advantage" | "OEM Approved";
  engine?: string;
  transmission?: string;
  position?: string;
  supersedes?: string;
  remarks?: string;
  estimatedPrice?: string;
  compatibleModelsSummary?: string[];
  imageUrl?: string;
}

export interface StepGuide {
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
}
