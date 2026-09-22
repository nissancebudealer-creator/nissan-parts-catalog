/**
 * NISSAN AUTOMOTIVE PARTS CATALOG - NORMALIZED DEMO REPOSITORY DATA
 * STRICT NOTICE (Section 12): DEMO DATA FOR DEVELOPMENT & TESTING ONLY
 * This mock data strictly mirrors the PostgreSQL normalized relational schema.
 */

import {
  VehicleModelEntity,
  VehicleVariantEntity,
  VehicleYearEntity,
  PartEntity,
  PartCompatibilityEntity,
} from "@/types/catalog";

// 1. VEHICLE MODELS (Normalized Master)
export const VEHICLE_MODELS_DATA: VehicleModelEntity[] = [
  { id: "mod-almera", model_name: "Almera", model_code: "N18", active: true },
  { id: "mod-kicks", model_name: "Kicks e-POWER", model_code: "P15", active: true },
  { id: "mod-navara", model_name: "Navara", model_code: "D23", active: true },
  { id: "mod-terra", model_name: "Terra", model_code: "D23T", active: true },
  { id: "mod-xtrail", model_name: "X-Trail", model_code: "T33", active: true },
  { id: "mod-livina", model_name: "Livina", model_code: "ND", active: true },
  { id: "mod-patrol", model_name: "Patrol", model_code: "Y62", active: true },
  { id: "mod-urvan", model_name: "Urvan NV350", model_code: "E26", active: true },
];

// 2. VEHICLE VARIANTS (Linked to model_id)
export const VEHICLE_VARIANTS_DATA: VehicleVariantEntity[] = [
  // Terra Variants
  {
    id: "var-terra-vl-4x4",
    model_id: "mod-terra",
    variant_name: "2.5 VL 4x4 AT",
    variant_code: "VL4X4",
    engine: "YD25DDTi 2.5L Turbo Diesel",
    transmission: "7-Speed Automatic",
    drivetrain: "4x4",
    active: true,
  },
  {
    id: "var-terra-vl-4x2",
    model_id: "mod-terra",
    variant_name: "2.5 VL 4x2 AT",
    variant_code: "VL4X2",
    engine: "YD25DDTi 2.5L Turbo Diesel",
    transmission: "7-Speed Automatic",
    drivetrain: "4x2",
    active: true,
  },
  {
    id: "var-terra-ve-4x2",
    model_id: "mod-terra",
    variant_name: "2.5 VE 4x2 AT",
    variant_code: "VE4X2",
    engine: "YD25DDTi 2.5L Turbo Diesel",
    transmission: "7-Speed Automatic",
    drivetrain: "4x2",
    active: true,
  },
  {
    id: "var-terra-sport",
    model_id: "mod-terra",
    variant_name: "2.5 Sport 4x4 AT",
    variant_code: "SPORT4X4",
    engine: "YD25DDTi 2.5L Turbo Diesel",
    transmission: "7-Speed Automatic",
    drivetrain: "4x4",
    active: true,
  },
  {
    id: "var-terra-el-4x2",
    model_id: "mod-terra",
    variant_name: "2.5 EL 4x2 MT",
    variant_code: "EL4X2",
    engine: "YD25DDTi 2.5L Turbo Diesel",
    transmission: "6-Speed Manual",
    drivetrain: "4x2",
    active: true,
  },

  // Navara Variants
  {
    id: "var-nav-pro4x",
    model_id: "mod-navara",
    variant_name: "Pro-4X 4x4 AT",
    variant_code: "PRO4X",
    engine: "YS23DDTT 2.3L Twin Turbo Diesel",
    transmission: "7-Speed Automatic",
    drivetrain: "4x4",
    active: true,
  },
  {
    id: "var-nav-vl-4x4",
    model_id: "mod-navara",
    variant_name: "VL 4x4 AT",
    variant_code: "NAV-VL4X4",
    engine: "YS23DDTT 2.3L Twin Turbo Diesel",
    transmission: "7-Speed Automatic",
    drivetrain: "4x4",
    active: true,
  },
  {
    id: "var-nav-calibre-x",
    model_id: "mod-navara",
    variant_name: "Calibre-X 4x2 AT",
    variant_code: "CAL-X",
    engine: "YS23DDTT 2.3L Twin Turbo Diesel",
    transmission: "7-Speed Automatic",
    drivetrain: "4x2",
    active: true,
  },

  // Kicks Variants
  {
    id: "var-kicks-vl",
    model_id: "mod-kicks",
    variant_name: "e-POWER VL AT",
    variant_code: "KICKS-VL",
    engine: "HR12DE 1.2L + EM57 Motor",
    transmission: "e-POWER Reduction",
    drivetrain: "FWD",
    active: true,
  },
  {
    id: "var-kicks-ve",
    model_id: "mod-kicks",
    variant_name: "e-POWER VE AT",
    variant_code: "KICKS-VE",
    engine: "HR12DE 1.2L + EM57 Motor",
    transmission: "e-POWER Reduction",
    drivetrain: "FWD",
    active: true,
  },

  // Almera Variants
  {
    id: "var-alm-vl",
    model_id: "mod-almera",
    variant_name: "1.0 VL Turbo N-Sport CVT",
    variant_code: "ALM-VL",
    engine: "HRA0 1.0L Turbo",
    transmission: "Xtronic CVT",
    drivetrain: "FWD",
    active: true,
  },
  {
    id: "var-alm-ve",
    model_id: "mod-almera",
    variant_name: "1.0 VE Turbo CVT",
    variant_code: "ALM-VE",
    engine: "HRA0 1.0L Turbo",
    transmission: "Xtronic CVT",
    drivetrain: "FWD",
    active: true,
  },

  // Urvan
  {
    id: "var-urvan-nv350",
    model_id: "mod-urvan",
    variant_name: "NV350 Premium AT",
    variant_code: "NV350-PREM",
    engine: "YD25DDTi 2.5L Diesel",
    transmission: "5-Speed Automatic",
    drivetrain: "RWD",
    active: true,
  },
];

// 3. VEHICLE YEARS (Multiple model years linked to model_id)
export const VEHICLE_YEARS_DATA: VehicleYearEntity[] = [
  // Terra
  { id: "yr-terra-2021", model_id: "mod-terra", year: 2021, active: true },
  { id: "yr-terra-2022", model_id: "mod-terra", year: 2022, active: true },
  { id: "yr-terra-2023", model_id: "mod-terra", year: 2023, active: true },
  { id: "yr-terra-2024", model_id: "mod-terra", year: 2024, active: true },
  { id: "yr-terra-2025", model_id: "mod-terra", year: 2025, active: true },
  { id: "yr-terra-2026", model_id: "mod-terra", year: 2026, active: true },

  // Navara
  { id: "yr-nav-2021", model_id: "mod-navara", year: 2021, active: true },
  { id: "yr-nav-2022", model_id: "mod-navara", year: 2022, active: true },
  { id: "yr-nav-2023", model_id: "mod-navara", year: 2023, active: true },
  { id: "yr-nav-2024", model_id: "mod-navara", year: 2024, active: true },
  { id: "yr-nav-2025", model_id: "mod-navara", year: 2025, active: true },

  // Kicks
  { id: "yr-kicks-2022", model_id: "mod-kicks", year: 2022, active: true },
  { id: "yr-kicks-2023", model_id: "mod-kicks", year: 2023, active: true },
  { id: "yr-kicks-2024", model_id: "mod-kicks", year: 2024, active: true },
  { id: "yr-kicks-2025", model_id: "mod-kicks", year: 2025, active: true },

  // Almera
  { id: "yr-alm-2021", model_id: "mod-almera", year: 2021, active: true },
  { id: "yr-alm-2022", model_id: "mod-almera", year: 2022, active: true },
  { id: "yr-alm-2023", model_id: "mod-almera", year: 2023, active: true },
  { id: "yr-alm-2024", model_id: "mod-almera", year: 2024, active: true },
  { id: "yr-alm-2025", model_id: "mod-almera", year: 2025, active: true },

  // Urvan
  { id: "yr-urvan-2022", model_id: "mod-urvan", year: 2022, active: true },
  { id: "yr-urvan-2023", model_id: "mod-urvan", year: 2023, active: true },
  { id: "yr-urvan-2024", model_id: "mod-urvan", year: 2024, active: true },
];

// 4. PARTS MASTER
export const PARTS_DATA: PartEntity[] = [
  {
    id: "prt-001",
    part_number: "D1060-5X00A",
    part_description: "Front Brake Pad Set - Ceramic Formulation",
    category: "Brake System",
    subcategory: "Pads & Rotors",
    notes: "Includes stainless hardware shims and wear indicators.",
    active: true,
  },
  {
    id: "prt-002",
    part_number: "D4060-5X00A",
    part_description: "Rear Brake Disc Rotor & Pad Assembly",
    category: "Brake System",
    subcategory: "Pads & Rotors",
    notes: "Direct fitment for Terra 4-wheel disc rear axle.",
    active: true,
  },
  {
    id: "prt-003",
    part_number: "15208-65F0A",
    part_description: "Genuine Spin-On Engine Oil Filter",
    category: "Filters",
    subcategory: "Engine Filters",
    notes: "Silicone anti-drainback valve with relief bypass.",
    active: true,
  },
  {
    id: "prt-004",
    part_number: "16546-4BA1B",
    part_description: "High-Flow Engine Air Cleaner Element",
    category: "Filters",
    subcategory: "Air Intake",
    notes: "Synthetic pleated media with perimeter polyurethane seal.",
    active: true,
  },
  {
    id: "prt-005",
    part_number: "62022-5X00H",
    part_description: "Front Bumper Fascia Shell Assembly",
    category: "Body",
    subcategory: "Exterior Panels",
    notes: "Primed for painting with sonar sensor cutouts.",
    active: true,
  },
  {
    id: "prt-006",
    part_number: "11720-5X00A",
    part_description: "V-Ribbed Serpentine Accessory Drive Belt",
    category: "Engine",
    subcategory: "Belts & Pulleys",
    notes: "7PK EPDM high-temperature formulation.",
    active: true,
  },
  {
    id: "prt-007",
    part_number: "E4302-5X00A",
    part_description: "Front Suspension Strut & Shock Absorber RH",
    category: "Suspension",
    subcategory: "Shocks & Struts",
    notes: "Gas-pressurized twin-tube strut.",
    active: true,
  },
  {
    id: "prt-008",
    part_number: "27277-4BA0A",
    part_description: "Active Carbon Cabin A/C Air Pollen Filter",
    category: "Air Conditioning",
    subcategory: "Cabin Filtration",
    notes: "Deodorizing activated carbon micro-filtration.",
    active: true,
  },
  {
    id: "prt-009",
    part_number: "D1060-4KH0A",
    part_description: "Front Brake Pad Set - Heavy Duty Off-Road",
    category: "Brake System",
    subcategory: "Pads & Rotors",
    notes: "Navara Pro-4X heavy duty off-road friction compound.",
    active: true,
  },
  {
    id: "prt-010",
    part_number: "D1060-5RB0A",
    part_description: "Front Brake Pad Set - Regenerative Hybrid Spec",
    category: "Brake System",
    subcategory: "Pads & Rotors",
    notes: "Specially formulated for Kicks e-POWER regenerative deceleration.",
    active: true,
  },
  {
    id: "prt-011",
    part_number: "AY040-NS120",
    part_description: "Commercial Spec Heavy Duty Front Brake Pad Set",
    category: "Brake System",
    subcategory: "Pads & Rotors",
    notes: "High endurance commercial grade lining for fleet passenger use.",
    active: true,
  },
];

// 5. PART COMPATIBILITY MATRIX (Normalized Link: Part -> Model -> Variant -> Year)
export const PART_COMPATIBILITY_DATA: PartCompatibilityEntity[] = [
  // Terra Brake Pads (D1060-5X00A)
  { id: "cmp-001", part_id: "prt-001", model_id: "mod-terra", variant_id: "var-terra-vl-4x4", year_id: "yr-terra-2024", notes: "Front axle L/R", active: true },
  { id: "cmp-002", part_id: "prt-001", model_id: "mod-terra", variant_id: "var-terra-vl-4x4", year_id: "yr-terra-2023", notes: "Front axle L/R", active: true },
  { id: "cmp-003", part_id: "prt-001", model_id: "mod-terra", variant_id: "var-terra-vl-4x2", year_id: "yr-terra-2024", notes: "Front axle L/R", active: true },
  { id: "cmp-004", part_id: "prt-001", model_id: "mod-terra", variant_id: "var-terra-sport", year_id: "yr-terra-2024", notes: "Front axle L/R", active: true },

  // Terra Rear Brake Discs (D4060-5X00A)
  { id: "cmp-005", part_id: "prt-002", model_id: "mod-terra", variant_id: "var-terra-vl-4x4", year_id: "yr-terra-2024", notes: "Rear disc axle", active: true },

  // Universal Oil Filter (15208-65F0A)
  { id: "cmp-006", part_id: "prt-003", model_id: "mod-terra", variant_id: "var-terra-vl-4x4", year_id: "yr-terra-2024", notes: "Engine block mount", active: true },
  { id: "cmp-007", part_id: "prt-003", model_id: "mod-terra", variant_id: "var-terra-vl-4x2", year_id: "yr-terra-2024", notes: "Engine block mount", active: true },
  { id: "cmp-008", part_id: "prt-003", model_id: "mod-navara", variant_id: "var-nav-pro4x", year_id: "yr-nav-2024", notes: "Engine block mount", active: true },

  // Air Cleaner Element (16546-4BA1B)
  { id: "cmp-009", part_id: "prt-004", model_id: "mod-terra", variant_id: "var-terra-vl-4x4", year_id: "yr-terra-2024", notes: "Airbox assembly", active: true },
  { id: "cmp-010", part_id: "prt-004", model_id: "mod-navara", variant_id: "var-nav-pro4x", year_id: "yr-nav-2024", notes: "Airbox assembly", active: true },

  // Front Bumper Shell (62022-5X00H)
  { id: "cmp-011", part_id: "prt-005", model_id: "mod-terra", variant_id: "var-terra-vl-4x4", year_id: "yr-terra-2024", notes: "VL spec bumper shell", active: true },
  { id: "cmp-012", part_id: "prt-005", model_id: "mod-terra", variant_id: "var-terra-sport", year_id: "yr-terra-2024", notes: "Sport trim spec", active: true },

  // Drive Belt (11720-5X00A)
  { id: "cmp-013", part_id: "prt-006", model_id: "mod-terra", variant_id: "var-terra-vl-4x4", year_id: "yr-terra-2024", notes: "Front accessory belt", active: true },

  // Strut Shock Absorber (E4302-5X00A)
  { id: "cmp-014", part_id: "prt-007", model_id: "mod-terra", variant_id: "var-terra-vl-4x4", year_id: "yr-terra-2024", notes: "Front RH strut", active: true },

  // Cabin Filter (27277-4BA0A)
  { id: "cmp-015", part_id: "prt-008", model_id: "mod-terra", variant_id: "var-terra-vl-4x4", year_id: "yr-terra-2024", notes: "Behind glove box", active: true },

  // Navara Pro-4X Brake Pads (D1060-4KH0A)
  { id: "cmp-016", part_id: "prt-009", model_id: "mod-navara", variant_id: "var-nav-pro4x", year_id: "yr-nav-2024", notes: "Pro-4X 4x4 front axle", active: true },
  { id: "cmp-017", part_id: "prt-009", model_id: "mod-navara", variant_id: "var-nav-vl-4x4", year_id: "yr-nav-2024", notes: "VL 4x4 front axle", active: true },

  // Kicks Hybrid Brake Pads (D1060-5RB0A)
  { id: "cmp-018", part_id: "prt-010", model_id: "mod-kicks", variant_id: "var-kicks-vl", year_id: "yr-kicks-2024", notes: "e-POWER VL hybrid front", active: true },

  // Urvan Fleet Brake Pads (AY040-NS120)
  { id: "cmp-019", part_id: "prt-011", model_id: "mod-urvan", variant_id: "var-urvan-nv350", year_id: "yr-urvan-2024", notes: "Urvan NV350 front axle", active: true },
];
