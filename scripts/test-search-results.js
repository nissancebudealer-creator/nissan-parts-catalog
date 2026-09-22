// ==============================================================================
// PHASE 5: SEARCH RESULTS & PART DETAILS VERIFICATION TEST SUITE
// Tests Section 5 Search Results presentation, Cards & Table view modes,
// sort options, copy functionality, and the PartDetailModal dialog.
// ==============================================================================

const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("PHASE 5: SEARCH RESULTS & DETAILS VERIFICATION");
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
console.log("--- 1. Testing Component File Integrity ---");
const resultsPath = path.join(__dirname, "../src/components/SearchResults.tsx");
const modalPath = path.join(__dirname, "../src/components/PartDetailModal.tsx");
const pagePath = path.join(__dirname, "../src/app/page.tsx");

assert(fs.existsSync(resultsPath), "SearchResults.tsx exists");
assert(fs.existsSync(modalPath), "PartDetailModal.tsx exists");
assert(fs.existsSync(pagePath), "page.tsx exists");

const resultsContent = fs.readFileSync(resultsPath, "utf-8");
const modalContent = fs.readFileSync(modalPath, "utf-8");
const pageContent = fs.readFileSync(pagePath, "utf-8");

// 2. Verify Search Result Presentation Fields (Section 5)
console.log("\n--- 2. Testing Section 5 Search Result Required Fields ---");
assert(resultsContent.includes("part.partNumber"), "Displays Part Number");
assert(resultsContent.includes("part.partDescription"), "Displays Part Description");
assert(resultsContent.includes("part.category"), "Displays Category");
assert(resultsContent.includes("part.model"), "Displays Model");
assert(resultsContent.includes("part.variant"), "Displays Variant");
assert(resultsContent.includes("part.year"), "Displays Year / Year Range");
assert(resultsContent.includes("part.position"), "Displays Position / Mounting");
assert(resultsContent.includes("part.genuineStatus"), "Displays OEM Genuine Status");
assert(resultsContent.includes("part.remarks"), "Displays Additional Notes & Remarks");

// 3. Verify Cards View vs Table View Toggle
console.log("\n--- 3. Testing Cards vs Table Presentation Modes ---");
assert(resultsContent.includes("viewMode === \"cards\""), "Implements Cards View presentation");
assert(resultsContent.includes("viewMode === \"table\""), "Implements Table View presentation");
assert(resultsContent.includes("setViewMode"), "Provides view mode toggle button");
assert(resultsContent.includes("<table"), "Table view renders standard HTML table");
assert(resultsContent.includes("thead"), "Table view includes header row");

// 4. Verify Sorting & Copy Features
console.log("\n--- 4. Testing Sorting & Usability Features ---");
assert(resultsContent.includes("sortBy"), "Sorting state implemented");
assert(resultsContent.includes("partNumber"), "Supports sorting by Part Number");
assert(resultsContent.includes("description"), "Supports sorting by Description");
assert(resultsContent.includes("category"), "Supports sorting by Category");
assert(resultsContent.includes("navigator.clipboard"), "Copy Part Number to clipboard supported");

// 5. Verify Part Detail Modal (Section 5 & 18 Steps 8 & 9)
console.log("\n--- 5. Testing Part Detail Modal (Steps 8 & 9) ---");
assert(modalContent.includes("role=\"dialog\""), "PartDetailModal has accessible dialog role");
assert(modalContent.includes("aria-modal=\"true\""), "PartDetailModal declares aria-modal");
assert(modalContent.includes("part.supersedes"), "Modal displays superseding part numbers if applicable");
assert(modalContent.includes("handleCopyPartNumber"), "Modal provides Part Number copy action");
assert(modalContent.includes("handleKeyDown"), "Modal dismisses on Escape key");
assert(modalContent.includes("onClose"), "Modal provides close affordance to return to search");
assert(modalContent.includes("Section 12 Compliance") && modalContent.includes("DEMO DATA"), "Modal displays Section 12 DEMO DATA notice");

// 6. Verify Home Page Success Flow (Section 18)
console.log("\n--- 6. Testing Home Page Integration & Success Flow ---");
assert(pageContent.includes("<SearchResults"), "SearchResults mounted in page.tsx");
assert(pageContent.includes("<PartDetailModal"), "PartDetailModal mounted in page.tsx");
assert(pageContent.includes("handleOpenPartModal"), "Opening part modal handler wired");
assert(pageContent.includes("handleClosePartModal"), "Closing part modal handler wired");
assert(pageContent.includes("handleResetAll"), "Full search reset handler wired");

console.log("\n==================================================");
console.log(`PHASE 5 RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
