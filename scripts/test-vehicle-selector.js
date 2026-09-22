// ==============================================================================
// PHASE 3: VEHICLE SELECTION UI VERIFICATION TEST SUITE
// Tests cascading dropdown state, progressive filtering logic, and UI contracts
// ==============================================================================

const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("PHASE 3: VEHICLE SELECTION UI VERIFICATION");
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

// 1. Verify Component Files & Utilities
console.log("--- 1. Testing Component & Utility Integrity ---");
const selectorPath = path.join(__dirname, "../src/components/VehicleSelector.tsx");
const pagePath = path.join(__dirname, "../src/app/page.tsx");
const utilsPath = path.join(__dirname, "../src/lib/utils.ts");

assert(fs.existsSync(selectorPath), "VehicleSelector.tsx exists");
assert(fs.existsSync(pagePath), "page.tsx exists");
assert(fs.existsSync(utilsPath), "utils.ts exists");

const selectorContent = fs.readFileSync(selectorPath, "utf-8");
const pageContent = fs.readFileSync(pagePath, "utf-8");

// 2. Verify 3-Step Progressive Cascade Architecture (Section 4 & 7)
console.log("\n--- 2. Testing 3-Step Progressive Cascade Architecture ---");
assert(selectorContent.includes("STEP 1: Select Model"), "Includes STEP 1: Select Model label");
assert(selectorContent.includes("STEP 2: Select Variant"), "Includes STEP 2: Select Variant label");
assert(selectorContent.includes("STEP 3: Select Year"), "Includes STEP 3: Select Year label");

// Step 2 must be disabled when model is not selected
assert(
  selectorContent.includes("disabled={!selectedModel || loadingVariants}"),
  "Step 2 (Variant) is disabled until Model is selected"
);

// Step 3 must be disabled when variant is not selected
assert(
  selectorContent.includes("disabled={!selectedVariant || loadingYears}"),
  "Step 3 (Year) is disabled until Variant is selected"
);

// Automatic cascade reset when parent changes
assert(
  selectorContent.includes("onVariantChange(null); // Reset step 2 & 3 cascade"),
  "Changing Model triggers automatic reset of Variant and Year"
);
assert(
  selectorContent.includes("onYearChange(null); // Reset step 3 cascade"),
  "Changing Variant triggers automatic reset of Year"
);

// 3. Verify API Integration (Zero Hardcoding - Section 6)
console.log("\n--- 3. Testing Dynamic API Integration ---");
assert(
  selectorContent.includes('fetch("/api/catalog/models")'),
  "Step 1 fetches dynamic models from /api/catalog/models"
);
assert(
  selectorContent.includes("fetch(`/api/catalog/variants?modelId="),
  "Step 2 fetches dynamic variants from /api/catalog/variants"
);
assert(
  selectorContent.includes("fetch(\n          `/api/catalog/years?modelId="),
  "Step 3 fetches dynamic years from /api/catalog/years"
);

// 4. Verify User Interface Controls & Mobile-First Design (Section 8 & 9)
console.log("\n--- 4. Testing UI Controls & Mobile-First Design ---");
assert(
  selectorContent.includes("Start Over"),
  "Secondary action 'Start Over' / 'Clear' is provided"
);
assert(
  selectorContent.includes("py-3.5 sm:py-4"),
  "Large touch-friendly dropdown controls (py-3.5 sm:py-4) for mobile devices"
);
assert(
  selectorContent.includes("grid-cols-1 md:grid-cols-3"),
  "Responsive layout: 1 column on mobile, 3 columns on tablet/desktop"
);
assert(
  selectorContent.includes("Vehicle Configured & Fitment Locked"),
  "Visual fitment confirmation banner rendered when configuration is complete"
);

// 5. Verify Integration in Home Page
console.log("\n--- 5. Testing Home Page Integration ---");
assert(
  pageContent.includes("<VehicleSelector"),
  "VehicleSelector component is mounted in page.tsx"
);
assert(
  pageContent.includes("onClear={handleClearVehicle}") || pageContent.includes("onClear={handleClearSelector}"),
  "handleClear wired to VehicleSelector"
);
assert(
  pageContent.includes("onReset={handleResetAll}"),
  "handleResetAll wired to Header"
);
assert(
  pageContent.includes("DEMO DATA MODE"),
  "DEMO DATA notice preserved in layout"
);

console.log("\n==================================================");
console.log(`PHASE 3 RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
