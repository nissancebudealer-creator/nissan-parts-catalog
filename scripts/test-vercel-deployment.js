// ==============================================================================
// PHASE 9: VERCEL DEPLOYMENT VERIFICATION TEST SUITE
// Tests vercel.json, .env.example, DEPLOYMENT.md, and production build readiness.
// ==============================================================================

const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("PHASE 9: VERCEL DEPLOYMENT VERIFICATION");
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

// 1. Verify Deployment Target Files (Section 2)
console.log("--- 1. Testing Deployment Files ---");
const vercelJsonPath = path.join(__dirname, "../vercel.json");
const envExamplePath = path.join(__dirname, "../.env.example");
const deploymentMdPath = path.join(__dirname, "../DEPLOYMENT.md");
const packageJsonPath = path.join(__dirname, "../package.json");

assert(fs.existsSync(vercelJsonPath), "vercel.json exists");
assert(fs.existsSync(envExamplePath), ".env.example exists");
assert(fs.existsSync(deploymentMdPath), "DEPLOYMENT.md exists");
assert(fs.existsSync(packageJsonPath), "package.json exists");

// 2. Verify vercel.json configuration
console.log("\n--- 2. Testing vercel.json Configuration ---");
let vercelConfig = {};
try {
  vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, "utf-8"));
  assert(true, "vercel.json is valid JSON");
} catch (err) {
  assert(false, "vercel.json must be valid JSON", err.message);
}

assert(vercelConfig.framework === "nextjs", "Framework set to 'nextjs'");
assert(vercelConfig.buildCommand === "next build", "buildCommand set to 'next build'");
assert(vercelConfig.cleanUrls === true, "cleanUrls enabled");

// 3. Verify .env.example Configuration
console.log("\n--- 3. Testing Environment Template (.env.example) ---");
const envExampleContent = fs.readFileSync(envExamplePath, "utf-8");
assert(envExampleContent.includes("NEXT_PUBLIC_SUPABASE_URL"), "Documents NEXT_PUBLIC_SUPABASE_URL");
assert(envExampleContent.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY"), "Documents NEXT_PUBLIC_SUPABASE_ANON_KEY");
assert(envExampleContent.includes("ADMIN_PASSCODE"), "Documents ADMIN_PASSCODE");

// 4. Verify DEPLOYMENT.md Guide
console.log("\n--- 4. Testing Deployment Documentation ---");
const deployMdContent = fs.readFileSync(deploymentMdPath, "utf-8");
assert(deployMdContent.includes("Vercel"), "Instructions cover Vercel deployment");
assert(deployMdContent.includes("Supabase"), "Instructions cover Supabase database setup");
assert(deployMdContent.includes("001_initial_schema.sql") || deployMdContent.includes("init_schema.sql"), "References SQL schema migration");
assert(deployMdContent.includes("CSV Importer"), "References bulk parts CSV importer");

// 5. Verify package.json build scripts
console.log("\n--- 5. Testing package.json Scripts ---");
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
assert(pkg.scripts?.build === "next build", "package.json has 'build': 'next build'");
assert(pkg.scripts?.start === "next start", "package.json has 'start': 'next start'");

console.log("\n==================================================");
console.log(`PHASE 9 RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
}
