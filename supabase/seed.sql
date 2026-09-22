-- ==============================================================================
-- NISSAN AUTOMOTIVE PARTS CATALOG - SEED DATA
-- STRICT NOTICE (Section 12): DEMO DATA FOR DEVELOPMENT & TESTING ONLY
-- NOT OFFICIAL NISSAN PARTS DATA. TO BE REPLACED WITH VERIFIED CSV/EXCEL IMPORT.
-- ==============================================================================

-- 1. VEHICLE MODELS (DEMO DATA)
INSERT INTO vehicle_models (id, model_name, model_code, active) VALUES
('mod-almera', 'Almera', 'N18', TRUE),
('mod-kicks', 'Kicks e-POWER', 'P15', TRUE),
('mod-navara', 'Navara', 'D23', TRUE),
('mod-terra', 'Terra', 'D23T', TRUE),
('mod-xtrail', 'X-Trail', 'T33', TRUE),
('mod-livina', 'Livina', 'ND', TRUE),
('mod-patrol', 'Patrol', 'Y62', TRUE),
('mod-urvan', 'Urvan NV350', 'E26', TRUE)
ON CONFLICT (id) DO UPDATE SET model_name = EXCLUDED.model_name;

-- 2. VEHICLE VARIANTS (DEMO DATA)
INSERT INTO vehicle_variants (id, model_id, variant_name, variant_code, engine, transmission, drivetrain, active) VALUES
-- Terra Variants
('var-terra-vl-4x4', 'mod-terra', '2.5 VL 4x4 AT', 'VL4X4', 'YD25DDTi 2.5L Turbo Diesel', '7-Speed Automatic', '4x4', TRUE),
('var-terra-vl-4x2', 'mod-terra', '2.5 VL 4x2 AT', 'VL4X2', 'YD25DDTi 2.5L Turbo Diesel', '7-Speed Automatic', '4x2', TRUE),
('var-terra-ve-4x2', 'mod-terra', '2.5 VE 4x2 AT', 'VE4X2', 'YD25DDTi 2.5L Turbo Diesel', '7-Speed Automatic', '4x2', TRUE),
('var-terra-sport', 'mod-terra', '2.5 Sport 4x4 AT', 'SPORT4X4', 'YD25DDTi 2.5L Turbo Diesel', '7-Speed Automatic', '4x4', TRUE),
('var-terra-el-4x2', 'mod-terra', '2.5 EL 4x2 MT', 'EL4X2', 'YD25DDTi 2.5L Turbo Diesel', '6-Speed Manual', '4x2', TRUE),

-- Navara Variants
('var-nav-pro4x', 'mod-navara', 'Pro-4X 4x4 AT', 'PRO4X', 'YS23DDTT 2.3L Twin Turbo Diesel', '7-Speed Automatic', '4x4', TRUE),
('var-nav-vl-4x4', 'mod-navara', 'VL 4x4 AT', 'NAV-VL4X4', 'YS23DDTT 2.3L Twin Turbo Diesel', '7-Speed Automatic', '4x4', TRUE),
('var-nav-calibre-x', 'mod-navara', 'Calibre-X 4x2 AT', 'CAL-X', 'YS23DDTT 2.3L Twin Turbo Diesel', '7-Speed Automatic', '4x2', TRUE),

-- Kicks Variants
('var-kicks-vl', 'mod-kicks', 'e-POWER VL AT', 'KICKS-VL', 'HR12DE 1.2L + EM57 Electric Motor', 'e-POWER Single Reduction', 'FWD', TRUE),
('var-kicks-ve', 'mod-kicks', 'e-POWER VE AT', 'KICKS-VE', 'HR12DE 1.2L + EM57 Electric Motor', 'e-POWER Single Reduction', 'FWD', TRUE),

-- Almera Variants
('var-alm-vl', 'mod-almera', '1.0 VL Turbo N-Sport CVT', 'ALM-VL', 'HRA0 1.0L Turbocharged Gas', 'Xtronic CVT', 'FWD', TRUE),
('var-alm-ve', 'mod-almera', '1.0 VE Turbo CVT', 'ALM-VE', 'HRA0 1.0L Turbocharged Gas', 'Xtronic CVT', 'FWD', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. VEHICLE YEARS (DEMO DATA)
INSERT INTO vehicle_years (id, model_id, year, active) VALUES
-- Terra Years
('yr-terra-2021', 'mod-terra', 2021, TRUE),
('yr-terra-2022', 'mod-terra', 2022, TRUE),
('yr-terra-2023', 'mod-terra', 2023, TRUE),
('yr-terra-2024', 'mod-terra', 2024, TRUE),
('yr-terra-2025', 'mod-terra', 2025, TRUE),
('yr-terra-2026', 'mod-terra', 2026, TRUE),

-- Navara Years
('yr-nav-2021', 'mod-navara', 2021, TRUE),
('yr-nav-2022', 'mod-navara', 2022, TRUE),
('yr-nav-2023', 'mod-navara', 2023, TRUE),
('yr-nav-2024', 'mod-navara', 2024, TRUE),
('yr-nav-2025', 'mod-navara', 2025, TRUE),

-- Kicks Years
('yr-kicks-2022', 'mod-kicks', 2022, TRUE),
('yr-kicks-2023', 'mod-kicks', 2023, TRUE),
('yr-kicks-2024', 'mod-kicks', 2024, TRUE),
('yr-kicks-2025', 'mod-kicks', 2025, TRUE),

-- Almera Years
('yr-alm-2021', 'mod-almera', 2021, TRUE),
('yr-alm-2022', 'mod-almera', 2022, TRUE),
('yr-alm-2023', 'mod-almera', 2023, TRUE),
('yr-alm-2024', 'mod-almera', 2024, TRUE),
('yr-alm-2025', 'mod-almera', 2025, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. PARTS MASTER (DEMO DATA)
INSERT INTO parts (id, part_number, part_description, category, subcategory, notes, active) VALUES
('prt-001', 'D1060-5X00A', 'Front Brake Pad Set - Ceramic Formulation', 'Brake System', 'Pads & Rotors', 'Includes hardware shims and wear clips. OEM formulation.', TRUE),
('prt-002', 'D4060-5X00A', 'Rear Brake Disc Rotor & Pad Assembly', 'Brake System', 'Pads & Rotors', 'Compatible with rear solid disc axle setup.', TRUE),
('prt-003', '15208-65F0A', 'Genuine Spin-On Engine Oil Filter', 'Filters', 'Engine Filters', 'Anti-drainback silicone diaphragm.', TRUE),
('prt-004', '16546-4BA1B', 'High-Flow Engine Air Cleaner Element', 'Filters', 'Air Intake', 'Pleated synthetic fiber element.', TRUE),
('prt-005', '62022-5X00H', 'Front Bumper Fascia Shell Assembly', 'Body', 'Exterior Panels', 'Pre-primed for finish painting with sensor provisions.', TRUE),
('prt-006', '11720-5X00A', 'V-Ribbed Serpentine Accessory Drive Belt', 'Engine', 'Belts & Pulleys', '7PK EPDM high-temperature formulation.', TRUE),
('prt-007', 'E4302-5X00A', 'Front Suspension Strut & Shock Absorber RH', 'Suspension', 'Shocks & Struts', 'Gas-charged pressurized shock absorber.', TRUE),
('prt-008', '27277-4BA0A', 'Active Carbon Cabin A/C Air Pollen Filter', 'Air Conditioning', 'Cabin Filtration', 'Dual layer micro-particulate and carbon media.', TRUE),
('prt-009', 'D1060-4KH0A', 'Front Brake Pad Set - Heavy Duty Off-Road', 'Brake System', 'Pads & Rotors', 'Heavy duty compound for towing and high thermal load.', TRUE),
('prt-010', 'D1060-5RB0A', 'Front Brake Pad Set - Regenerative Hybrid Spec', 'Brake System', 'Pads & Rotors', 'Engineered for e-POWER regenerative braking profile.', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. PART COMPATIBILITY MATRIX (DEMO DATA)
INSERT INTO part_compatibility (id, part_id, model_id, variant_id, year_id, notes, active) VALUES
-- Terra Front Brake Pad Set (var-terra-vl-4x4, 2024)
('cmp-001', 'prt-001', 'mod-terra', 'var-terra-vl-4x4', 'yr-terra-2024', 'Front axle left & right fitment', TRUE),
('cmp-002', 'prt-001', 'mod-terra', 'var-terra-vl-4x4', 'yr-terra-2023', 'Front axle left & right fitment', TRUE),
('cmp-003', 'prt-001', 'mod-terra', 'var-terra-vl-4x2', 'yr-terra-2024', 'Front axle left & right fitment', TRUE),
('cmp-004', 'prt-001', 'mod-terra', 'var-terra-sport', 'yr-terra-2024', 'Front axle left & right fitment', TRUE),

-- Terra Rear Brake Disc Assembly (var-terra-vl-4x4, 2024)
('cmp-005', 'prt-002', 'mod-terra', 'var-terra-vl-4x4', 'yr-terra-2024', 'Rear disc axle fitment', TRUE),

-- Oil Filter (Universal fit across multiple vehicles)
('cmp-006', 'prt-003', 'mod-terra', 'var-terra-vl-4x4', 'yr-terra-2024', 'Engine spin-on block mount', TRUE),
('cmp-007', 'prt-003', 'mod-terra', 'var-terra-vl-4x2', 'yr-terra-2024', 'Engine spin-on block mount', TRUE),
('cmp-008', 'prt-003', 'mod-navara', 'var-nav-pro4x', 'yr-nav-2024', 'Engine spin-on block mount', TRUE),

-- Air Filter (Terra & Navara)
('cmp-009', 'prt-004', 'mod-terra', 'var-terra-vl-4x4', 'yr-terra-2024', 'Airbox assembly fitment', TRUE),
('cmp-010', 'prt-004', 'mod-navara', 'var-nav-pro4x', 'yr-nav-2024', 'Airbox assembly fitment', TRUE),

-- Front Bumper Shell (Terra 2024)
('cmp-011', 'prt-005', 'mod-terra', 'var-terra-vl-4x4', 'yr-terra-2024', 'VL spec with sensor holes', TRUE),
('cmp-012', 'prt-005', 'mod-terra', 'var-terra-sport', 'yr-terra-2024', 'Sport trim spec', TRUE),

-- Drive Belt
('cmp-013', 'prt-006', 'mod-terra', 'var-terra-vl-4x4', 'yr-terra-2024', 'YD25 7PK Serpentine Belt', TRUE),

-- Suspension Strut
('cmp-014', 'prt-007', 'mod-terra', 'var-terra-vl-4x4', 'yr-terra-2024', 'Front Right Hand Side', TRUE),

-- Cabin Filter
('cmp-015', 'prt-008', 'mod-terra', 'var-terra-vl-4x4', 'yr-terra-2024', 'Blower unit filter', TRUE),

-- Navara Heavy Duty Brake Pads
('cmp-016', 'prt-009', 'mod-navara', 'var-nav-pro4x', 'yr-nav-2024', 'Pro-4X heavy duty off-road brake pads', TRUE),
('cmp-017', 'prt-009', 'mod-navara', 'var-nav-vl-4x4', 'yr-nav-2024', 'VL 4x4 heavy duty brake pads', TRUE),

-- Kicks Regenerative Brake Pads
('cmp-018', 'prt-010', 'mod-kicks', 'var-kicks-vl', 'yr-kicks-2024', 'e-POWER regenerative hybrid brake pads', TRUE)
ON CONFLICT (id) DO NOTHING;
