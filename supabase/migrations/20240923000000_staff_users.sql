-- ==============================================================================
-- NISSAN AUTOMOTIVE PARTS CATALOG - STAFF USERS & RBAC SCHEMA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS staff_users (
    id TEXT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'counter_clerk', 'service_advisor')),
    department VARCHAR(100) NOT NULL DEFAULT 'Parts Counter',
    password_hash TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on username and role
CREATE INDEX IF NOT EXISTS idx_staff_users_username ON staff_users(username);
CREATE INDEX IF NOT EXISTS idx_staff_users_role ON staff_users(role);
CREATE INDEX IF NOT EXISTS idx_staff_users_active ON staff_users(active);

-- Enable RLS
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;

-- Seed initial default staff accounts
INSERT INTO staff_users (id, username, email, full_name, role, department, password_hash, active)
VALUES 
    ('usr-admin-01', 'admin', 'admin@nissan-dealer.ph', 'Dealership Parts Director', 'admin', 'Executive & Inventory Control', 'nissan2024', TRUE),
    ('usr-clerk-01', 'clerk', 'carlos.clerk@nissan-dealer.ph', 'Carlos Mendoza', 'counter_clerk', 'Parts Counter Sales', 'nissan2024', TRUE),
    ('usr-advisor-01', 'advisor', 'elena.advisor@nissan-dealer.ph', 'Elena Santos', 'service_advisor', 'Service Workshop & Diagnostics', 'nissan2024', TRUE)
ON CONFLICT (username) DO NOTHING;

