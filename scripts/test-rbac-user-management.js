// ==============================================================================
// PHASE 11: INDIVIDUAL STAFF / USER ACCOUNTS (RBAC) VERIFICATION TEST SUITE
// Tests complete role-based access control and user lifecycle:
// 1. Types & Migration File Integrity
// 2. Authentication Route Handlers (Login, Session, Logout, Invalid/Inactive checks)
// 3. RBAC Authorization Enforcement (Counter Clerk & Advisor blocked from Admin APIs)
// 4. Admin Staff Directory CRUD Operations (Create, Update Role, Toggle Active, Delete)
// 5. Self-Deletion Prevention Guard
// ==============================================================================

const path = require("path");
const fs = require("fs");
const jiti = require("jiti")(process.cwd(), {
  alias: { "@": path.join(process.cwd(), "src") },
});

console.log("==================================================");
console.log("PHASE 11: STAFF ACCOUNTS & RBAC VERIFICATION");
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
  // 1. Verify Types & Migration File Integrity
  // -------------------------------------------------------------
  console.log("--- 1. Testing Files, Types & Migration Integrity ---");
  const typesPath = path.join(__dirname, "../src/types/catalog.ts");
  const mockDataPath = path.join(__dirname, "../src/lib/db/mock-data.ts");
  const migrationPath = path.join(__dirname, "../supabase/migrations/20240923000000_staff_users.sql");
  const loginRoutePath = path.join(__dirname, "../src/app/api/auth/login/route.ts");
  const meRoutePath = path.join(__dirname, "../src/app/api/auth/me/route.ts");
  const logoutRoutePath = path.join(__dirname, "../src/app/api/auth/logout/route.ts");
  const adminUsersRoutePath = path.join(__dirname, "../src/app/api/admin/users/route.ts");
  const adminPagePath = path.join(__dirname, "../src/app/admin/page.tsx");

  const usersPagePath = path.join(__dirname, "../src/app/admin/users/page.tsx");

  assert(fs.existsSync(typesPath), "catalog.ts exists");
  assert(fs.existsSync(mockDataPath), "mock-data.ts exists");
  assert(fs.existsSync(migrationPath), "20240923000000_staff_users.sql exists");
  assert(fs.existsSync(loginRoutePath), "API route /api/auth/login exists");
  assert(fs.existsSync(meRoutePath), "API route /api/auth/me exists");
  assert(fs.existsSync(logoutRoutePath), "API route /api/auth/logout exists");
  assert(fs.existsSync(adminUsersRoutePath), "API route /api/admin/users exists");
  assert(fs.existsSync(usersPagePath), "Dedicated user management page /admin/users exists");

  const typesContent = fs.readFileSync(typesPath, "utf-8");
  assert(typesContent.includes("StaffRole"), "types/catalog.ts exports StaffRole type");
  assert(typesContent.includes("StaffUserEntity"), "types/catalog.ts exports StaffUserEntity interface");
  assert(typesContent.includes("StaffUserPublic"), "types/catalog.ts exports StaffUserPublic interface");

  const migrationContent = fs.readFileSync(migrationPath, "utf-8");
  assert(migrationContent.includes("staff_users"), "SQL migration defines staff_users table");
  assert(
    migrationContent.includes("role") &&
      migrationContent.includes("admin") &&
      migrationContent.includes("counter_clerk") &&
      migrationContent.includes("service_advisor"),
    "SQL migration defines staff role constraint/enum"
  );

  const adminPageContent = fs.readFileSync(adminPagePath, "utf-8");
  assert(adminPageContent.includes("handleQuickLogin"), "Admin page implements 1-click quick demo login");
  assert(adminPageContent.includes('activeTab === "users"'), "Admin page renders Staff Users tab");
  assert(adminPageContent.includes("showAddStaffModal"), "Admin page includes Add Staff modal dialog");
  assert(adminPageContent.includes("/admin/users"), "Admin page links directly to /admin/users module");
  assert(adminPageContent.includes("Staff Accounts"), "Admin page displays Staff Accounts KPI card");

  const usersPageContent = fs.readFileSync(usersPagePath, "utf-8");
  assert(usersPageContent.includes("User Management"), "Users page features User Management module title");
  assert(usersPageContent.includes("handleOpenEditModal"), "Users page supports editing staff details");
  assert(usersPageContent.includes("showAddStaffModal"), "Users page includes Add Staff Member dialog");

  // -------------------------------------------------------------
  // 2. Load App Router Handlers via Jiti
  // -------------------------------------------------------------
  console.log("\n--- 2. Loading App Router Route Handlers ---");
  const loginRoute = jiti("./src/app/api/auth/login/route.ts");
  const meRoute = jiti("./src/app/api/auth/me/route.ts");
  const logoutRoute = jiti("./src/app/api/auth/logout/route.ts");
  const adminUsersRoute = jiti("./src/app/api/admin/users/route.ts");

  assert(typeof loginRoute.POST === "function", "Loaded /api/auth/login POST handler");
  assert(typeof meRoute.GET === "function", "Loaded /api/auth/me GET handler");
  assert(typeof logoutRoute.POST === "function", "Loaded /api/auth/logout POST handler");
  assert(typeof adminUsersRoute.GET === "function", "Loaded /api/admin/users GET handler");
  assert(typeof adminUsersRoute.POST === "function", "Loaded /api/admin/users POST handler");
  assert(typeof adminUsersRoute.PATCH === "function", "Loaded /api/admin/users PATCH handler");
  assert(typeof adminUsersRoute.DELETE === "function", "Loaded /api/admin/users DELETE handler");

  // -------------------------------------------------------------
  // 3. Testing Authentication Handlers
  // -------------------------------------------------------------
  console.log("\n--- 3. Testing Authentication & Credential Verification ---");

  // 3a. Admin Login
  const adminLoginReq = new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "nissan2024" }),
  });
  const adminLoginRes = await loginRoute.POST(adminLoginReq);
  assert(adminLoginRes.status === 200, "Admin login returns 200 OK");
  const adminLoginData = await adminLoginRes.json();
  assert(adminLoginData.success === true, "Admin login response success is true");
  assert(adminLoginData.user.role === "admin", "Admin authenticated with role 'admin'");
  assert(!adminLoginData.user.password_hash, "Admin password hash is redacted from public payload");
  const adminCookie = adminLoginRes.headers.get("set-cookie") || "";
  assert(adminCookie.includes("nissan_staff_session"), "Admin login sets nissan_staff_session cookie");

  // 3b. Counter Clerk Login
  const clerkLoginReq = new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "clerk", password: "nissan2024" }),
  });
  const clerkLoginRes = await loginRoute.POST(clerkLoginReq);
  assert(clerkLoginRes.status === 200, "Counter clerk login returns 200 OK");
  const clerkLoginData = await clerkLoginRes.json();
  assert(clerkLoginData.user.role === "counter_clerk", "Clerk authenticated with role 'counter_clerk'");

  // 3c. Service Advisor Login
  const advisorLoginReq = new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "advisor", password: "nissan2024" }),
  });
  const advisorLoginRes = await loginRoute.POST(advisorLoginReq);
  assert(advisorLoginRes.status === 200, "Service advisor login returns 200 OK");
  const advisorLoginData = await advisorLoginRes.json();
  assert(advisorLoginData.user.role === "service_advisor", "Advisor authenticated with role 'service_advisor'");

  // 3d. Bad Password Rejection
  const badPassReq = new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "invalidpassword" }),
  });
  const badPassRes = await loginRoute.POST(badPassReq);
  assert(badPassRes.status === 401, "Bad password login rejected with 401 Unauthorized");

  // 3e. Unknown User Rejection
  const badUserReq = new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "nonexistent", password: "nissan2024" }),
  });
  const badUserRes = await loginRoute.POST(badUserReq);
  assert(badUserRes.status === 401, "Unknown username rejected with 401 Unauthorized");

  // 3f. Session Verification (/api/auth/me)
  const rawSetCookie = adminLoginRes.headers.get("set-cookie") || "";
  const cookieMatch = rawSetCookie.match(/nissan_staff_session=([^;]+)/);
  const sessionCookieVal = cookieMatch
    ? cookieMatch[1]
    : Buffer.from(JSON.stringify(adminLoginData.user)).toString("base64");

  const sessionReq = new Request("http://localhost/api/auth/me", {
    headers: {
      cookie: `nissan_staff_session=${sessionCookieVal}`,
    },
  });
  const sessionRes = await meRoute.GET(sessionReq);
  assert(sessionRes.status === 200, "Session inspection /api/auth/me returns 200 OK");
  const sessionData = await sessionRes.json();
  assert(sessionData.user && sessionData.user.username === "admin", "Session resolves active user 'admin'");

  // 3g. Logout (/api/auth/logout)
  const logoutReq = new Request("http://localhost/api/auth/logout", { method: "POST" });
  const logoutRes = await logoutRoute.POST(logoutReq);
  assert(logoutRes.status === 200, "Logout endpoint returns 200 OK");
  const logoutCookie = logoutRes.headers.get("set-cookie") || "";
  assert(logoutCookie.includes("Max-Age=0") || logoutCookie.includes("expires="), "Logout clears session cookie");

  // -------------------------------------------------------------
  // 4. Testing RBAC Authorization Boundaries
  // -------------------------------------------------------------
  console.log("\n--- 4. Testing RBAC Authorization Boundaries ---");

  // 4a. Counter Clerk attempts to list staff users -> 403
  const clerkGetReq = new Request("http://localhost/api/admin/users", {
    headers: {
      "x-staff-role": "counter_clerk",
      "x-staff-id": clerkLoginData.user.id,
    },
  });
  const clerkGetRes = await adminUsersRoute.GET(clerkGetReq);
  assert(clerkGetRes.status === 403, "Counter clerk blocked from GET /api/admin/users (403 Forbidden)");

  // 4b. Service Advisor attempts to create staff user -> 403
  const advisorPostReq = new Request("http://localhost/api/admin/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-staff-role": "service_advisor",
      "x-staff-id": advisorLoginData.user.id,
    },
    body: JSON.stringify({
      username: "hacker",
      full_name: "Hacker User",
      email: "hacker@test.com",
      role: "admin",
      password: "pass",
    }),
  });
  const advisorPostRes = await adminUsersRoute.POST(advisorPostReq);
  assert(advisorPostRes.status === 403, "Service advisor blocked from POST /api/admin/users (403 Forbidden)");

  // 4c. Service Advisor attempts to delete staff user -> 403
  const advisorDeleteReq = new Request("http://localhost/api/admin/users?id=usr-admin-01", {
    method: "DELETE",
    headers: {
      "x-staff-role": "service_advisor",
      "x-staff-id": advisorLoginData.user.id,
    },
  });
  const advisorDeleteRes = await adminUsersRoute.DELETE(advisorDeleteReq);
  assert(advisorDeleteRes.status === 403, "Service advisor blocked from DELETE /api/admin/users (403 Forbidden)");

  // -------------------------------------------------------------
  // 5. Testing Staff User CRUD Operations (Admin Role)
  // -------------------------------------------------------------
  console.log("\n--- 5. Testing Admin Staff Management CRUD Lifecycle ---");

  // 5a. Admin lists staff users
  const adminGetReq = new Request("http://localhost/api/admin/users", {
    headers: {
      "x-staff-role": "admin",
      "x-staff-id": adminLoginData.user.id,
    },
  });
  const adminGetRes = await adminUsersRoute.GET(adminGetReq);
  assert(adminGetRes.status === 200, "Admin granted access to GET /api/admin/users");
  const staffList = await adminGetRes.json();
  assert(Array.isArray(staffList.data) && staffList.data.length >= 3, "Initial staff list contains seed users");

  // 5b. Role filter parameter
  const filterClerkReq = new Request("http://localhost/api/admin/users?role=counter_clerk", {
    headers: { "x-staff-role": "admin" },
  });
  const filterClerkRes = await adminUsersRoute.GET(filterClerkReq);
  const filterClerkData = await filterClerkRes.json();
  assert(filterClerkData.data.every((u) => u.role === "counter_clerk"), "Role filter returns only counter clerks");

  // 5c. Admin creates a new staff account
  const testUsername = `test.staff.${Date.now()}`;
  const createReq = new Request("http://localhost/api/admin/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-staff-role": "admin",
      "x-staff-id": adminLoginData.user.id,
    },
    body: JSON.stringify({
      username: testUsername,
      full_name: "Test Staff Member",
      email: `${testUsername}@nissan-dealer.ph`,
      role: "counter_clerk",
      department: "Parts Warehouse",
      password: "nissan2024",
    }),
  });
  const createRes = await adminUsersRoute.POST(createReq);
  assert(createRes.status === 201, "Admin creates new staff member (201 Created)");
  const createData = await createRes.json();
  assert(createData.success === true, "Creation response success is true");
  const newUserId = createData.data.id;
  assert(!!newUserId, `Generated Staff User ID: ${newUserId}`);

  // 5d. Duplicate username rejection
  const dupReq = new Request("http://localhost/api/admin/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-staff-role": "admin",
    },
    body: JSON.stringify({
      username: testUsername,
      full_name: "Duplicate Member",
      email: "other@nissan-dealer.ph",
      role: "counter_clerk",
      password: "nissan2024",
    }),
  });
  const dupRes = await adminUsersRoute.POST(dupReq);
  assert(
    dupRes.status === 409 || dupRes.status === 400,
    "Duplicate username rejected with 409 Conflict (or 400 Bad Request)"
  );

  // 5e. Admin updates staff user role
  const updateRoleReq = new Request("http://localhost/api/admin/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-staff-role": "admin",
    },
    body: JSON.stringify({
      id: newUserId,
      role: "service_advisor",
      department: "Express Service Bay",
    }),
  });
  const updateRoleRes = await adminUsersRoute.PATCH(updateRoleReq);
  assert(updateRoleRes.status === 200, "Admin successfully updates staff role (200 OK)");
  const updateRoleData = await updateRoleRes.json();
  assert(updateRoleData.data.role === "service_advisor", "Staff role updated to 'service_advisor'");

  // 5f. Admin deactivates staff user
  const deactivateReq = new Request("http://localhost/api/admin/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-staff-role": "admin",
    },
    body: JSON.stringify({
      id: newUserId,
      active: false,
    }),
  });
  const deactivateRes = await adminUsersRoute.PATCH(deactivateReq);
  assert(deactivateRes.status === 200, "Admin deactivates staff account (200 OK)");
  const deactivateData = await deactivateRes.json();
  assert(deactivateData.data.active === false, "Staff user active state set to false");

  // 5g. Deactivated staff user cannot log in
  const deactivatedLoginReq = new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: testUsername, password: "nissan2024" }),
  });
  const deactivatedLoginRes = await loginRoute.POST(deactivatedLoginReq);
  assert(deactivatedLoginRes.status === 403, "Deactivated staff user login rejected with 403 Forbidden");

  // 5h. Guard against deleting own active admin account
  const selfDeleteReq = new Request(`http://localhost/api/admin/users?id=${adminLoginData.user.id}`, {
    method: "DELETE",
    headers: {
      "x-staff-role": "admin",
      "x-staff-id": adminLoginData.user.id,
    },
  });
  const selfDeleteRes = await adminUsersRoute.DELETE(selfDeleteReq);
  assert(selfDeleteRes.status === 400, "Self-deletion of active admin account blocked (400 Bad Request)");

  // 5i. Admin deletes test staff user
  const deleteReq = new Request(`http://localhost/api/admin/users?id=${newUserId}`, {
    method: "DELETE",
    headers: {
      "x-staff-role": "admin",
      "x-staff-id": adminLoginData.user.id,
    },
  });
  const deleteRes = await adminUsersRoute.DELETE(deleteReq);
  assert(deleteRes.status === 200, "Admin successfully deletes test staff user (200 OK)");

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n==================================================");
  console.log(`RBAC VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution threw unhandled error:", err);
  process.exit(1);
});
