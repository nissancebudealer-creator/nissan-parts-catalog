// ==============================================================================
// PHASE 10: END-TO-END TRANSACTION VERIFICATION TEST SUITE
// Tests complete transaction lifecycle through Next.js App Router handlers:
// 1. Component & File Integrity Verification
// 2. Cascading Vehicle Lookup (Model -> Variant -> Year)
// 3. Relational OEM Parts Search & Compatibility Resolution
// 4. Customer Quote & Order Transaction Registration (TXN-XXXXXX)
// 5. Dealership Inquiries Ledger Lookup & Data Verification
// 6. Dealership Counter Status Transition (Pending -> Quoted)
// 7. Dealership Administrative Inventory Transaction (Create, Verify, Delete)
// ==============================================================================

const path = require("path");
const fs = require("fs");
const jiti = require("jiti")(process.cwd(), {
  alias: { "@": path.join(process.cwd(), "src") },
});

console.log("==================================================");
console.log("PHASE 10: END-TO-END TRANSACTION TEST SUITE");
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

async function runTests() {
  // -------------------------------------------------------------
  // 1. Verify Component & Route File Integrity
  // -------------------------------------------------------------
  console.log("--- 1. Testing Component & Route File Integrity ---");
  const quoteModalPath = path.join(__dirname, "../src/components/QuoteRequestModal.tsx");
  const partDetailModalPath = path.join(__dirname, "../src/components/PartDetailModal.tsx");
  const inquiriesApiPath = path.join(__dirname, "../src/app/api/inquiries/route.ts");
  const adminPagePath = path.join(__dirname, "../src/app/admin/page.tsx");
  const homePagePath = path.join(__dirname, "../src/app/page.tsx");

  assert(fs.existsSync(quoteModalPath), "QuoteRequestModal.tsx exists");
  assert(fs.existsSync(inquiriesApiPath), "API route /api/inquiries exists");

  const quoteModalContent = fs.readFileSync(quoteModalPath, "utf-8");
  const partDetailContent = fs.readFileSync(partDetailModalPath, "utf-8");
  const inquiriesApiContent = fs.readFileSync(inquiriesApiPath, "utf-8");
  const adminPageContent = fs.readFileSync(adminPagePath, "utf-8");
  const homePageContent = fs.readFileSync(homePagePath, "utf-8");

  assert(partDetailContent.includes("onRequestQuote"), "PartDetailModal provides onRequestQuote callback");
  assert(partDetailContent.includes("Request Quote / Order Part"), "PartDetailModal includes Request Quote CTA button");
  assert(homePageContent.includes("<QuoteRequestModal"), "HomePage mounts QuoteRequestModal component");
  assert(adminPageContent.includes('activeTab === "inquiries"'), "Admin page includes Inquiries & Orders tab");
  assert(adminPageContent.includes("transaction_ref"), "Admin page displays transaction reference numbers");
  assert(inquiriesApiContent.includes("TXN-NISSAN-"), "Inquiries API issues standardized TXN-NISSAN- reference codes");
  assert(quoteModalContent.includes("wa.me"), "QuoteRequestModal provides direct WhatsApp dispatch to parts counter");

  // -------------------------------------------------------------
  // Load App Router Handlers via Jiti
  // -------------------------------------------------------------
  console.log("\n--- 2. Loading Next.js App Router Route Handlers ---");
  const modelsRoute = jiti("./src/app/api/catalog/models/route.ts");
  const variantsRoute = jiti("./src/app/api/catalog/variants/route.ts");
  const yearsRoute = jiti("./src/app/api/catalog/years/route.ts");
  const partsRoute = jiti("./src/app/api/catalog/parts/route.ts");
  const inquiriesRoute = jiti("./src/app/api/inquiries/route.ts");
  const adminPartsRoute = jiti("./src/app/api/admin/parts/route.ts");

  assert(typeof modelsRoute.GET === "function", "Loaded /api/catalog/models GET handler");
  assert(typeof variantsRoute.GET === "function", "Loaded /api/catalog/variants GET handler");
  assert(typeof yearsRoute.GET === "function", "Loaded /api/catalog/years GET handler");
  assert(typeof partsRoute.GET === "function", "Loaded /api/catalog/parts GET handler");
  assert(typeof inquiriesRoute.POST === "function", "Loaded /api/inquiries POST handler");
  assert(typeof inquiriesRoute.GET === "function", "Loaded /api/inquiries GET handler");
  assert(typeof inquiriesRoute.PATCH === "function", "Loaded /api/inquiries PATCH handler");
  assert(typeof adminPartsRoute.POST === "function", "Loaded /api/admin/parts POST handler");
  assert(typeof adminPartsRoute.DELETE === "function", "Loaded /api/admin/parts DELETE handler");

  // -------------------------------------------------------------
  // TRANSACTION STEP 1: Vehicle Model Lookup
  // -------------------------------------------------------------
  console.log("\n--- 3. Testing Step 1: Vehicle Model Lookup ---");
  const modelsReq = new Request("http://localhost/api/catalog/models");
  const modelsRes = await modelsRoute.GET(modelsReq);
  assert(modelsRes.status === 200, "GET /api/catalog/models returns 200 OK");
  const modelsData = await modelsRes.json();
  assert(Array.isArray(modelsData.data), "Models response contains data array");

  const navaraModel = modelsData.data.find((m) => m.model_name === "Navara");
  assert(!!navaraModel, "Found target vehicle model: Nissan Navara");
  const navaraModelId = navaraModel ? navaraModel.id : "mod-navara";

  // -------------------------------------------------------------
  // TRANSACTION STEP 2: Variant Cascading
  // -------------------------------------------------------------
  console.log("\n--- 4. Testing Step 2: Vehicle Variant Cascading ---");
  const variantsReq = new Request(`http://localhost/api/catalog/variants?modelId=${navaraModelId}`);
  const variantsRes = await variantsRoute.GET(variantsReq);
  assert(variantsRes.status === 200, "GET /api/catalog/variants returns 200 OK");
  const variantsData = await variantsRes.json();
  assert(variantsData.data.length > 0, "Navara variants list is non-empty");

  const targetVariant = variantsData.data[0];
  assert(!!targetVariant, `Selected Variant: ${targetVariant?.variant_name}`);
  const variantId = targetVariant?.id;

  // -------------------------------------------------------------
  // TRANSACTION STEP 3: Production Year Resolution
  // -------------------------------------------------------------
  console.log("\n--- 5. Testing Step 3: Production Year Resolution ---");
  const yearsReq = new Request(`http://localhost/api/catalog/years?modelId=${navaraModelId}`);
  const yearsRes = await yearsRoute.GET(yearsReq);
  assert(yearsRes.status === 200, "GET /api/catalog/years returns 200 OK");
  const yearsData = await yearsRes.json();
  assert(yearsData.data.length > 0, "Navara years list is non-empty");
  const targetYear = yearsData.data[0]?.year || 2024;
  assert(!!targetYear, `Selected Year: ${targetYear}`);

  // -------------------------------------------------------------
  // TRANSACTION STEP 4: Relational Parts Search
  // -------------------------------------------------------------
  console.log("\n--- 6. Testing Step 4: Compatible OEM Parts Search ---");
  const searchReq = new Request(
    `http://localhost/api/catalog/parts?modelId=${navaraModelId}&variantId=${variantId}&year=${targetYear}&description=brake`
  );
  const searchRes = await partsRoute.GET(searchReq);
  assert(searchRes.status === 200, "GET /api/catalog/parts returns 200 OK");
  const searchData = await searchRes.json();
  assert(Array.isArray(searchData.data) && searchData.data.length > 0, "Parts search returns compatible brake items");

  const selectedPart = searchData.data[0];
  assert(!!selectedPart?.partNumber, `Selected OEM Part: ${selectedPart?.partNumber} (${selectedPart?.partDescription})`);

  // -------------------------------------------------------------
  // TRANSACTION STEP 5: Customer Quote / Order Transaction Submission
  // -------------------------------------------------------------
  console.log("\n--- 7. Testing Step 5: Customer Quote Request Transaction Submission ---");
  const customerPayload = {
    part_id: selectedPart.id,
    part_number: selectedPart.partNumber,
    part_description: selectedPart.partDescription,
    vehicle_summary: `Nissan ${navaraModel.model_name} • ${targetVariant.variant_name} (${targetYear})`,
    customer_name: "Engr. Marco Rossi",
    customer_phone: "+63 917 555 9012",
    customer_email: "marco.rossi@nissan-fleet.ph",
    quantity: 2,
    vin_plate: "NSS-7789",
    notes: "Urgent brake replacement needed before fleet deployment.",
  };

  const submitReq = new Request("http://localhost/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerPayload),
  });
  const submitRes = await inquiriesRoute.POST(submitReq);

  assert(submitRes.status === 201, "POST /api/inquiries returns 201 Created");
  const submitData = await submitRes.json();
  assert(submitData.success === true, "Transaction submission confirmed: success = true");
  assert(!!submitData.transactionRef, `Transaction Reference Issued: ${submitData.transactionRef}`);
  assert(
    /^TXN-NISSAN-\d+$/.test(submitData.transactionRef),
    "Transaction Reference matches standardized TXN-NISSAN-XXXXXX pattern"
  );
  assert(submitData.data?.customer_name === "Engr. Marco Rossi", "Customer name stored correctly");
  assert(submitData.data?.quantity === 2, "Quantity stored correctly (2 units)");
  assert(submitData.data?.status === "pending", "Initial transaction status is 'pending'");

  const createdTxnId = submitData.data.id;
  const createdTxnRef = submitData.transactionRef;

  // -------------------------------------------------------------
  // TRANSACTION STEP 6: Dealership Inquiries Ledger Query
  // -------------------------------------------------------------
  console.log("\n--- 8. Testing Step 6: Dealership Transaction Ledger Lookup ---");
  const ledgerReq = new Request(`http://localhost/api/inquiries?query=${createdTxnRef}`);
  const ledgerRes = await inquiriesRoute.GET(ledgerReq);
  assert(ledgerRes.status === 200, "GET /api/inquiries?query=TXN returns 200 OK");
  const ledgerData = await ledgerRes.json();
  assert(ledgerData.success === true, "Ledger query succeeded");

  const foundInquiry = ledgerData.data.find((inq) => inq.transaction_ref === createdTxnRef);
  assert(!!foundInquiry, "Created transaction found in dealership inquiries ledger");
  assert(foundInquiry?.part_number === selectedPart.partNumber, "Verified part number matches selected part");
  assert(foundInquiry?.vin_plate === "NSS-7789", "Verified customer VIN/plate stored in ledger");

  // -------------------------------------------------------------
  // TRANSACTION STEP 7: Status Update by Dealership Counter
  // -------------------------------------------------------------
  console.log("\n--- 9. Testing Step 7: Dealership Status Transition (Quoted) ---");
  const updateReq = new Request("http://localhost/api/inquiries", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: createdTxnId, status: "quoted", notes: "Price quoted at PHP 3,850/set." }),
  });
  const updateRes = await inquiriesRoute.PATCH(updateReq);
  assert(updateRes.status === 200, "PATCH /api/inquiries returns 200 OK");
  const updateData = await updateRes.json();
  assert(updateData.success === true, "Status update confirmed");
  assert(updateData.data?.status === "quoted", "Inquiry status transitioned to 'quoted'");

  // -------------------------------------------------------------
  // TRANSACTION STEP 8: Admin Inventory Transaction (Create, Verify, Delete)
  // -------------------------------------------------------------
  console.log("\n--- 10. Testing Step 8: Dealership Administrative Inventory Transaction ---");
  const adminPartNumber = `E2E-TEST-${Date.now().toString().slice(-5)}`;
  const adminCreateReq = new Request("http://localhost/api/admin/parts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      part_number: adminPartNumber,
      part_description: "Automated E2E Front Caliper Pin Kit",
      category: "Brake System",
      subcategory: "Caliper Hardware",
      notes: "Temporary E2E part record",
    }),
  });
  const adminCreateRes = await adminPartsRoute.POST(adminCreateReq);
  assert(adminCreateRes.status === 200, "POST /api/admin/parts creates new inventory record");
  const adminCreateData = await adminCreateRes.json();
  const createdPartId = adminCreateData.data?.id;

  // Verify part is searchable in customer catalog
  const verifyCatalogReq = new Request(`http://localhost/api/catalog/parts?description=${adminPartNumber}`);
  const verifyCatalogRes = await partsRoute.GET(verifyCatalogReq);
  const verifyCatalogData = await verifyCatalogRes.json();
  assert(
    verifyCatalogData.data?.some((p) => p.partNumber === adminPartNumber),
    "Newly created part is immediately discoverable in customer catalog search"
  );

  // Clean up temporary admin part
  const deleteReq = new Request(`http://localhost/api/admin/parts?id=${createdPartId}`, {
    method: "DELETE",
  });
  const deleteRes = await adminPartsRoute.DELETE(deleteReq);
  assert(deleteRes.status === 200, "DELETE /api/admin/parts successfully cleans up test record");

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log("\n==================================================");
  console.log(`PHASE 10 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test Suite Unhandled Exception:", err);
  process.exit(1);
});
