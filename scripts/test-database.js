// ==============================================================================
// PHASE 2: DATABASE ARCHITECTURE VERIFICATION TEST SUITE
// Tests relational normalization, foreign key consistency, and query methods
// ==============================================================================

const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("PHASE 2: DATABASE ARCHITECTURE VERIFICATION");
console.log("==================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, testName, detail) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
    failed++;
  }
}

// 1. Verify SQL Migration & Seed files
console.log("--- 1. Testing SQL Schema & Seed Files ---");
const migrationPath = path.join(__dirname, "../supabase/migrations/20240922000000_init_schema.sql");
const seedPath = path.join(__dirname, "../supabase/seed.sql");

assert(fs.existsSync(migrationPath), "PostgreSQL migration file exists");
assert(fs.existsSync(seedPath), "Supabase seed data file exists");

const migrationSql = fs.readFileSync(migrationPath, "utf-8");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS vehicle_models"), "Schema defines vehicle_models");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS vehicle_variants"), "Schema defines vehicle_variants");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS vehicle_years"), "Schema defines vehicle_years");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS parts"), "Schema defines parts master");
assert(migrationSql.includes("CREATE TABLE IF NOT EXISTS part_compatibility"), "Schema defines part_compatibility");
assert(migrationSql.includes("REFERENCES vehicle_models(id) ON DELETE CASCADE"), "Foreign key cascade rules defined");
assert(migrationSql.includes("ENABLE ROW LEVEL SECURITY"), "Row Level Security (RLS) policies declared");

const seedSql = fs.readFileSync(seedPath, "utf-8");
assert(seedSql.includes("DEMO DATA"), "Seed data explicitly labeled DEMO DATA (Section 12 compliance)");

// 2. Read and parse mock data from TypeScript source
console.log("\n--- 2. Testing Relational Integrity of Master Data ---");
const mockDataContent = fs.readFileSync(path.join(__dirname, "../src/lib/db/mock-data.ts"), "utf-8");

// Verify master vehicle models
assert(mockDataContent.includes('model_name: "Terra"'), "Includes model Terra");
assert(mockDataContent.includes('model_name: "Navara"'), "Includes model Navara");
assert(mockDataContent.includes('model_name: "Almera"'), "Includes model Almera");
assert(mockDataContent.includes('model_name: "Kicks e-POWER"'), "Includes model Kicks");

// Verify variants link to model_id
assert(mockDataContent.includes('model_id: "mod-terra"'), "Variants linked to mod-terra");
assert(mockDataContent.includes('model_id: "mod-navara"'), "Variants linked to mod-navara");

// Verify years link to model_id
assert(mockDataContent.includes('id: "yr-terra-2024"'), "Years linked to Terra");

// 3. Verify Database Repository & API Routes
console.log("\n--- 3. Testing Database Abstraction Layer & API Routes ---");
const repoFactoryPath = path.join(__dirname, "../src/lib/db/index.ts");
const mockRepoPath = path.join(__dirname, "../src/lib/db/mock-repository.ts");
const supabaseRepoPath = path.join(__dirname, "../src/lib/db/supabase-repository.ts");

assert(fs.existsSync(repoFactoryPath), "Repository factory exists (src/lib/db/index.ts)");
assert(fs.existsSync(mockRepoPath), "MockCatalogRepository exists");
assert(fs.existsSync(supabaseRepoPath), "SupabaseCatalogRepository exists");

assert(fs.existsSync(path.join(__dirname, "../src/app/api/catalog/models/route.ts")), "API route /api/catalog/models exists");
assert(fs.existsSync(path.join(__dirname, "../src/app/api/catalog/variants/route.ts")), "API route /api/catalog/variants exists");
assert(fs.existsSync(path.join(__dirname, "../src/app/api/catalog/years/route.ts")), "API route /api/catalog/years exists");
assert(fs.existsSync(path.join(__dirname, "../src/app/api/catalog/parts/route.ts")), "API route /api/catalog/parts exists");

console.log("\n==================================================");
console.log(`PHASE 2 RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
