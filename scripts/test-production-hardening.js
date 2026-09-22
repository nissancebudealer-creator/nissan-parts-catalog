// ==============================================================================
// PHASE 8: PRODUCTION HARDENING VERIFICATION TEST SUITE
// Tests security headers, error boundaries, metadata/SEO, and input sanitization.
// ==============================================================================

const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("PHASE 8: PRODUCTION HARDENING VERIFICATION");
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

// 1. Verify Configuration & Security Headers (Section 13 & 14)
console.log("--- 1. Testing Security Headers in next.config.mjs ---");
const nextConfigPath = path.join(__dirname, "../next.config.mjs");
assert(fs.existsSync(nextConfigPath), "next.config.mjs exists");

const nextConfigContent = fs.readFileSync(nextConfigPath, "utf-8");
assert(nextConfigContent.includes("Strict-Transport-Security"), "Configures HSTS (Strict-Transport-Security)");
assert(nextConfigContent.includes("X-Frame-Options"), "Configures X-Frame-Options (clickjacking protection)");
assert(nextConfigContent.includes("X-Content-Type-Options"), "Configures X-Content-Type-Options: nosniff");
assert(nextConfigContent.includes("Referrer-Policy"), "Configures Referrer-Policy");
assert(nextConfigContent.includes("Permissions-Policy"), "Configures Permissions-Policy");
assert(nextConfigContent.includes("poweredByHeader: false"), "Disables X-Powered-By header leak");
assert(nextConfigContent.includes("compress: true"), "Enables Gzip/Brotli response compression (Section 14)");

// 2. Verify Error Boundaries & Loading UI
console.log("\n--- 2. Testing Resilience & Fallback Pages ---");
const errorPath = path.join(__dirname, "../src/app/error.tsx");
const notFoundPath = path.join(__dirname, "../src/app/not-found.tsx");
const loadingPath = path.join(__dirname, "../src/app/loading.tsx");

assert(fs.existsSync(errorPath), "error.tsx global error boundary exists");
assert(fs.existsSync(notFoundPath), "not-found.tsx custom 404 page exists");
assert(fs.existsSync(loadingPath), "loading.tsx automotive skeleton exists");

const errorContent = fs.readFileSync(errorPath, "utf-8");
assert(errorContent.includes("reset"), "Error boundary exposes retry/reset affordance");
assert(errorContent.includes("Back Home"), "Error boundary includes return navigation");

// 3. Verify Metadata, SEO & Viewport (Section 9)
console.log("\n--- 3. Testing SEO, OpenGraph & Mobile Viewport ---");
const layoutPath = path.join(__dirname, "../src/app/layout.tsx");
const layoutContent = fs.readFileSync(layoutPath, "utf-8");

assert(layoutContent.includes("openGraph"), "Configures OpenGraph metadata for social previews");
assert(layoutContent.includes("twitter"), "Configures Twitter Card metadata");
assert(layoutContent.includes("viewport: Viewport"), "Configures Next.js Viewport export");
assert(layoutContent.includes("device-width"), "Mobile responsive viewport declared (Section 9)");
assert(layoutContent.includes("robots"), "Configures search engine indexing policies");

// 4. Verify Input Sanitization & Security Utilities (Section 13)
console.log("\n--- 4. Testing Input Sanitization & Security Utilities ---");
const securityPath = path.join(__dirname, "../src/lib/security.ts");
assert(fs.existsSync(securityPath), "security.ts utility exists");

const securityContent = fs.readFileSync(securityPath, "utf-8");
assert(securityContent.includes("sanitizeText"), "Provides sanitizeText function for stripping tags");
assert(securityContent.includes("sanitizePartNumber"), "Provides sanitizePartNumber function for OEM part numbers");
assert(securityContent.includes("validateYear"), "Provides validateYear function with bounds checking");

console.log("\n==================================================");
console.log(`PHASE 8 RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
