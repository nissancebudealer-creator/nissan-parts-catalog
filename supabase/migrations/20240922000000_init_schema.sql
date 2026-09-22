-- ==============================================================================
-- NISSAN AUTOMOTIVE PARTS CATALOG - DATABASE SCHEMA (PostgreSQL / Supabase)
-- Strict normalization based on Section 6 Master Data Requirements
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. VEHICLE MODELS TABLE
CREATE TABLE IF NOT EXISTS vehicle_models (
    id TEXT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL UNIQUE,
    model_code VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. VEHICLE VARIANTS TABLE
CREATE TABLE IF NOT EXISTS vehicle_variants (
    id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
    variant_name VARCHAR(150) NOT NULL,
    variant_code VARCHAR(50) NOT NULL,
    engine VARCHAR(100) NOT NULL,
    transmission VARCHAR(100) NOT NULL,
    drivetrain VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_model_variant UNIQUE(model_id, variant_name)
);

-- 3. VEHICLE YEARS TABLE
CREATE TABLE IF NOT EXISTS vehicle_years (
    id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_model_year UNIQUE(model_id, year)
);

-- 4. PARTS MASTER TABLE
CREATE TABLE IF NOT EXISTS parts (
    id TEXT PRIMARY KEY,
    part_number VARCHAR(100) NOT NULL UNIQUE,
    part_description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    image_url TEXT,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PART COMPATIBILITY MATRIX TABLE
-- Expresses the flexible relationship: Part -> Model -> Variant -> Year
CREATE TABLE IF NOT EXISTS part_compatibility (
    id TEXT PRIMARY KEY,
    part_id TEXT NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
    model_id TEXT NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
    variant_id TEXT REFERENCES vehicle_variants(id) ON DELETE CASCADE,
    year_id TEXT REFERENCES vehicle_years(id) ON DELETE CASCADE,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH SPEED VEHICLE & PART SEARCHES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_vehicle_models_active ON vehicle_models(active);
CREATE INDEX IF NOT EXISTS idx_vehicle_variants_model ON vehicle_variants(model_id, active);
CREATE INDEX IF NOT EXISTS idx_vehicle_years_model ON vehicle_years(model_id, active);
CREATE INDEX IF NOT EXISTS idx_parts_number ON parts(part_number);
CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category);
CREATE INDEX IF NOT EXISTS idx_parts_description ON parts(part_description);
CREATE INDEX IF NOT EXISTS idx_part_compat_composite ON part_compatibility(model_id, variant_id, year_id, part_id);
CREATE INDEX IF NOT EXISTS idx_part_compat_part_id ON part_compatibility(part_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) FOR SUPABASE
-- Public catalog reading is enabled; mutations restricted to authenticated roles
-- ==============================================================================
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE part_compatibility ENABLE ROW LEVEL SECURITY;

-- Public read policies for active catalog records
CREATE POLICY "Public can view active vehicle models"
    ON vehicle_models FOR SELECT USING (active = TRUE);

CREATE POLICY "Public can view active vehicle variants"
    ON vehicle_variants FOR SELECT USING (active = TRUE);

CREATE POLICY "Public can view active vehicle years"
    ON vehicle_years FOR SELECT USING (active = TRUE);

CREATE POLICY "Public can view active parts"
    ON parts FOR SELECT USING (active = TRUE);

CREATE POLICY "Public can view active part compatibility"
    ON part_compatibility FOR SELECT USING (active = TRUE);
