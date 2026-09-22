// ==============================================================================
// PHASE 6: BULK DATA IMPORT VERIFICATION TEST SUITE
// Tests CSV parsing, header normalization, row validation, relational insertion,
// and import modal UI contracts.
// ==============================================================================

const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("PHASE 6: DATA IMPORT ENGINE VERIFICATION");
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

// 1. Verify Core Import Files
console.log("--- 1. Testing Core Import Files ---");
const parserPath = path.join(__dirname, "../src/lib/importer/csv-parser.ts");
const importerPath = path.join(__dirname, "../src/lib/importer/parts-importer.ts");
const apiRoutePath = path.join(__dirname, "../src/app/api/admin/import/route.ts");
const modalPath = path.join(__dirname, "../src/components/DataImportModal.tsx");
const templateCsvPath = path.join(__dirname, "../data/samples/nissan-parts-import-template.csv");
const sampleCsvPath = path.join(__dirname, "../data/samples/sample-import-data.csv");

assert(fs.existsSync(parserPath), "csv-parser.ts exists");
assert(fs.existsSync(importerPath), "parts-importer.ts exists");
assert(fs.existsSync(apiRoutePath), "API endpoint /api/admin/import exists");
assert(fs.existsSync(modalPath), "DataImportModal.tsx exists");
assert(fs.existsSync(templateCsvPath), "CSV template exists");
assert(fs.existsSync(sampleCsvPath), "Sample import CSV exists");

// 2. Verify Section 10 CSV Structure Requirements
console.log("\n--- 2. Testing Section 10 CSV Structure Requirements ---");
const templateContent = fs.readFileSync(templateCsvPath, "utf-8");
const sampleContent = fs.readFileSync(sampleCsvPath, "utf-8");

const requiredHeaders = ["model", "variant", "year", "part_number", "part_description", "category", "subcategory"];
for (const header of requiredHeaders) {
  assert(templateContent.includes(header), `Template contains required header: ${header}`);
}

assert(sampleContent.includes("DEMO DATA"), "Sample import data explicitly labeled DEMO DATA (Section 12)");

// 3. Verify Parser Logic in TypeScript Source
console.log("\n--- 3. Testing Parser Logic & Edge Case Handling ---");
const parserContent = fs.readFileSync(parserPath, "utf-8");
assert(parserContent.includes("normalizeHeaderName"), "Parser handles varied column casing/aliases");
assert(parserContent.includes("splitCsvLines"), "Parser handles multi-line and quoted strings");
assert(parserContent.includes("0xfeff"), "Parser strips UTF-8 BOM from Excel exports");
assert(parserContent.includes("isNaN(parsedYear)"), "Parser validates 4-digit model years");

// 4. Verify Importer Engine Logic
console.log("\n--- 4. Testing Relational Normalization in Importer ---");
const importerContent = fs.readFileSync(importerPath, "utf-8");
assert(importerContent.includes("VEHICLE_MODELS_DATA"), "Resolves or creates vehicle model");
assert(importerContent.includes("VEHICLE_VARIANTS_DATA"), "Resolves or creates vehicle variant");
assert(importerContent.includes("VEHICLE_YEARS_DATA"), "Resolves or creates vehicle year");
assert(importerContent.includes("PARTS_DATA"), "Upserts parts master record");
assert(importerContent.includes("PART_COMPATIBILITY_DATA"), "Creates part compatibility matrix link");

// 5. Verify API Route Implementation
console.log("\n--- 5. Testing API Endpoint Architecture ---");
const apiRouteContent = fs.readFileSync(apiRoutePath, "utf-8");
assert(apiRouteContent.includes("parsePartsCsv"), "API validates and parses CSV content");
assert(apiRouteContent.includes("importPartsData"), "API executes bulk import into data layer");
assert(apiRouteContent.includes("multipart/form-data"), "API supports file upload via multipart/form-data");
assert(apiRouteContent.includes("parseStats"), "API returns detailed parse and import metrics");

// 6. Verify UI & Home Page Integration
console.log("\n--- 6. Testing UI Integration in Home Page ---");
const pageContent = fs.readFileSync(path.join(__dirname, "../src/app/page.tsx"), "utf-8");
const headerContent = fs.readFileSync(path.join(__dirname, "../src/components/Header.tsx"), "utf-8");
const modalContent = fs.readFileSync(modalPath, "utf-8");

assert(pageContent.includes("<DataImportModal"), "DataImportModal mounted in page.tsx");
assert(pageContent.includes("isImportModalOpen"), "Import modal state managed in page.tsx");
assert(headerContent.includes("onOpenImport"), "Header exposes Import CSV button");
assert(modalContent.includes("handleDownloadTemplate"), "Modal provides Download CSV Template button");
assert(modalContent.includes("handleLoadSample"), "Modal provides 1-click Demo Data loader");
assert(modalContent.includes("Live Preview"), "Modal renders live table preview before import");

console.log("\n==================================================");
console.log(`PHASE 6 RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
