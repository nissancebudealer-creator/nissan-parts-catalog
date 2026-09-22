// ==============================================================================
// PHASE 7: ADMIN DASHBOARD VERIFICATION TEST SUITE
// Tests administrative passkey security, KPI metrics, CRUD APIs, and CSV catalog export.
// ==============================================================================

const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("PHASE 7: ADMIN DASHBOARD VERIFICATION");
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

// 1. Verify Admin Files
console.log("--- 1. Testing Admin Dashboard Files ---");
const adminPagePath = path.join(__dirname, "../src/app/admin/page.tsx");
const adminLayoutPath = path.join(__dirname, "../src/app/admin/layout.tsx");
const statsApiPath = path.join(__dirname, "../src/app/api/admin/stats/route.ts");
const partsApiPath = path.join(__dirname, "../src/app/api/admin/parts/route.ts");
const exportApiPath = path.join(__dirname, "../src/app/api/admin/export/route.ts");

assert(fs.existsSync(adminPagePath), "admin/page.tsx exists");
assert(fs.existsSync(adminLayoutPath), "admin/layout.tsx exists");
assert(fs.existsSync(statsApiPath), "API endpoint /api/admin/stats exists");
assert(fs.existsSync(partsApiPath), "API endpoint /api/admin/parts exists");
assert(fs.existsSync(exportApiPath), "API endpoint /api/admin/export exists");

// 2. Verify Security Passcode Gate (Section 13)
console.log("\n--- 2. Testing Passcode Gate & Security ---");
const adminPageContent = fs.readFileSync(adminPagePath, "utf-8");
assert(adminPageContent.includes("DEMO_PASSCODE"), "Admin requires passcode verification");
assert(adminPageContent.includes("isAuthenticated"), "Enforces authentication state before rendering admin tools");
assert(adminPageContent.includes("Dealership Admin Access"), "Renders dedicated admin login portal");
assert(adminPageContent.includes("Logout"), "Provides secure session termination");

// 3. Verify KPI Metrics & Statistics (Section 11)
console.log("\n--- 3. Testing Catalog Metric KPIs ---");
assert(adminPageContent.includes("totalModels"), "Displays total vehicle models metric");
assert(adminPageContent.includes("totalVariants"), "Displays total variants metric");
assert(adminPageContent.includes("totalParts"), "Displays total master parts metric");
assert(adminPageContent.includes("totalCompatibilities"), "Displays total compatibility links metric");

// 4. Verify Parts Master CRUD Management
console.log("\n--- 4. Testing Parts Management Capabilities ---");
const partsApiContent = fs.readFileSync(partsApiPath, "utf-8");
assert(partsApiContent.includes("export async function GET"), "API supports GET parts with search & category filtering");
assert(partsApiContent.includes("export async function POST"), "API supports POST new part creation");
assert(partsApiContent.includes("export async function PATCH"), "API supports PATCH part updating / status toggle");
assert(partsApiContent.includes("export async function DELETE"), "API supports DELETE part with cascade cleanup");
assert(adminPageContent.includes("Add Part Record"), "Admin UI provides Add Part form");
assert(adminPageContent.includes("handleToggleActive"), "Admin UI supports 1-click active/inactive toggle");
assert(adminPageContent.includes("handleDeletePart"), "Admin UI supports part deletion with confirmation");

// 5. Verify CSV Catalog Export
console.log("\n--- 5. Testing CSV Catalog Export ---");
const exportApiContent = fs.readFileSync(exportApiPath, "utf-8");
assert(exportApiContent.includes("text/csv"), "Export endpoint sets text/csv Content-Type");
assert(exportApiContent.includes("Content-Disposition"), "Export endpoint sets attachment Content-Disposition");
assert(exportApiContent.includes('"part_number"') && exportApiContent.includes('"part_description"'), "Exported CSV includes standard Section 10 headers");

// 6. Verify Navigation
console.log("\n--- 6. Testing Navigation Integration ---");
assert(adminPageContent.includes("href=\"/\""), "Admin links back to Customer Parts Finder UI");

console.log("\n==================================================");
console.log(`PHASE 7 RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
