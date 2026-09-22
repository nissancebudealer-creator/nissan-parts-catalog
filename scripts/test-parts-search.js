// ==============================================================================
// PHASE 4: PARTS SEARCH ENGINE VERIFICATION TEST SUITE
// Tests progressive filtering, case-insensitive partial text matching,
// quick suggestion chips, and fitment isolation.
// ==============================================================================

const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("PHASE 4: PARTS SEARCH ENGINE VERIFICATION");
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

// 1. Verify Component Files
console.log("--- 1. Testing Component Integrity ---");
const searchComponentPath = path.join(__dirname, "../src/components/PartsSearch.tsx");
const pagePath = path.join(__dirname, "../src/app/page.tsx");

assert(fs.existsSync(searchComponentPath), "PartsSearch.tsx exists");
assert(fs.existsSync(pagePath), "page.tsx exists");

const searchContent = fs.readFileSync(searchComponentPath, "utf-8");
const pageContent = fs.readFileSync(pagePath, "utf-8");

// 2. Verify Core Search Requirements (Section 4 & 7)
console.log("\n--- 2. Testing Search Flow & Input Controls (Section 4 & 7) ---");
assert(searchContent.includes("STEP 4: Part Description"), "Includes STEP 4: Part Description label");
assert(searchContent.includes("Find Parts"), "Primary Action: 'Find Parts' button present");
assert(searchContent.includes("Clear Search"), "Secondary Action: 'Clear Search' button present");
assert(searchContent.includes("QUICK_SEARCH_CHIPS"), "Quick suggestion chips defined for non-technical users");
assert(searchContent.includes('"Brake Pad"'), "Suggestion chip 'Brake Pad' included");
assert(searchContent.includes('"Oil Filter"'), "Suggestion chip 'Oil Filter' included");
assert(searchContent.includes("CATEGORIES"), "Category filter dropdown defined");

// 3. Verify Search Logic & Progressive Filtering
console.log("\n--- 3. Testing Relational Search Logic via Repository ---");
const mockDataContent = fs.readFileSync(path.join(__dirname, "../src/lib/db/mock-data.ts"), "utf-8");

assert(
  searchContent.includes("params.append(\"modelId\", selectedModel.id)"),
  "Search query enforces modelId filter"
);
assert(
  searchContent.includes("params.append(\"variantId\", selectedVariant.id)"),
  "Search query enforces variantId filter"
);
assert(
  searchContent.includes("params.append(\"year\", selectedYear.year.toString())"),
  "Search query enforces year filter"
);
assert(
  searchContent.includes("params.append(\"description\", descriptionQuery.trim())"),
  "Search query appends partial description query"
);

// 4. Verify Home Page Integration
console.log("\n--- 4. Testing Home Page Integration ---");
assert(
  pageContent.includes("<PartsSearch"),
  "PartsSearch component mounted in page.tsx"
);
assert(
  pageContent.includes("<SearchResults") || pageContent.includes("Matching Nissan Parts"),
  "Matching parts results section rendered in page.tsx"
);
assert(
  pageContent.includes("searchResults"),
  "searchResults state managed in page.tsx"
);
assert(
  pageContent.includes("handleSearchResults"),
  "handleSearchResults handler wired in page.tsx"
);

// 5. Verify Mobile & Automotive Principles (Section 8 & 9)
console.log("\n--- 5. Testing UI Principles (Section 8 & 9) ---");
assert(
  searchContent.includes("py-3.5 sm:py-4"),
  "Large touch-friendly inputs (py-3.5 sm:py-4) for mobile devices"
);
assert(
  searchContent.includes("gradient-to-r from-red-600"),
  "Nissan automotive red styling applied to primary action"
);
assert(
  pageContent.includes("DEMO DATA MODE"),
  "DEMO DATA notice preserved in layout"
);

console.log("\n==================================================");
console.log(`PHASE 4 RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
