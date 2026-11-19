-- ==============================================================================
-- SMART CAMPUS PLATFORM - DATABASE MIGRATION 03: STORAGE & SEED DATA
-- Storage bucket 'service-request-images' configuration & initial campus data
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. STORAGE BUCKET CONFIGURATION
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'service-request-images',
    'service-request-images',
    true,
    10485760, -- 10 MB limit
    ARRAY['image/png', 'image/jpeg', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp']::text[];

-- Storage Object Policies for service-request-images bucket
CREATE POLICY "service_images_read"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'service-request-images');

CREATE POLICY "service_images_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'service-request-images' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "service_images_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'service-request-images' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- ------------------------------------------------------------------------------
-- 2. SEED INITIAL DEPARTMENTS
-- ------------------------------------------------------------------------------
INSERT INTO public.departments (id, name, description, department_head)
VALUES
    ('d1000000-0000-0000-0000-000000000001', 'Facilities & Physical Maintenance', 'Building structural repairs, HVAC systems, plumbing, carpentry, and furniture fixes.', 'Robert Langdon'),
    ('d1000000-0000-0000-0000-000000000002', 'IT & Audiovisual Infrastructure', 'Campus Wi-Fi, classroom projectors, smart podiums, multimedia equipment, and sound systems.', 'Priya Sharma'),
    ('d1000000-0000-0000-0000-000000000003', 'Electrical & Power Systems', 'Power outlets, lighting ballasts, distribution panels, circuit breakers, and backup generator lines.', 'Kenneth Miller'),
    ('d1000000-0000-0000-0000-000000000004', 'Laboratory Operations & Safety', 'Specialized scientific apparatus, chemical fume hoods, gas supply manifolds, and biosafety cabinets.', 'Dr. Arthur Pendelton'),
    ('d1000000-0000-0000-0000-000000000005', 'Sanitation & Environmental Hygiene', 'Restroom sanitation, hazardous waste disposal, emergency spill cleanup, and deep cleaning.', 'Maria Santos'),
    ('d1000000-0000-0000-0000-000000000006', 'Campus Safety & Access Control', 'RFID smart door latches, electronic locks, access badges, and safety monitoring.', 'Officer Thomas Hayes')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 3. SEED SERVICE CATEGORIES
-- ------------------------------------------------------------------------------
INSERT INTO public.service_categories (id, department_id, name, description)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Air Conditioning & HVAC Failure', 'Classroom or lab AC not cooling, temperature anomalies, or ventilation failure.'),
    ('c1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Plumbing & Water Leakage', 'Water line dripping, restroom faucet leaks, or pipe blockages.'),
    ('c1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002', 'Projector & Display Malfunction', 'HDMI connectivity fault, blown lamp, flickering display, or blank projection screen.'),
    ('c1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000002', 'Campus Wi-Fi & Ethernet Outage', 'Eduroam authentication issues, dropped packets, or deactivated Ethernet ports.'),
    ('c1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000003', 'Electrical Socket / Lighting Failure', 'Dead wall outlets, flickering ballasts, or tripped circuit breakers.'),
    ('c1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000004', 'Laboratory Instrument Breakdown', 'Precision balances, centrifuges, spectrophotometers, or microscope issues.'),
    ('c1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000005', 'Urgent Cleaning & Chemical Spill', 'Emergency spill containment, broken glassware, or hygiene maintenance.'),
    ('c1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000006', 'RFID Smart Door Lock Malfunction', 'Access card rejected or magnetic door latch failing to release.')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. SEED CAMPUS LOCATIONS WITH QR CODES
-- ------------------------------------------------------------------------------
INSERT INTO public.locations (id, building_name, floor, room_number, qr_code)
VALUES
    ('l1000000-0000-0000-0000-000000000001', 'Academic Lecture Hall Complex', '1st Floor', 'LH-101', 'QR-LOC-LH101-NORTH'),
    ('l1000000-0000-0000-0000-000000000002', 'Engineering Block A', '2nd Floor', 'Room 204', 'QR-LOC-ENGB204-WING'),
    ('l1000000-0000-0000-0000-000000000003', 'Science & Research Complex', '3rd Floor', 'Lab 312', 'QR-LOC-SCI312-CHEM'),
    ('l1000000-0000-0000-0000-000000000004', 'Central University Library', '2nd Floor', 'Study Zone East', 'QR-LOC-LIB2E-STUDY'),
    ('l1000000-0000-0000-0000-000000000005', 'Student Activity Center', 'Ground Floor', 'Atrium Café', 'QR-LOC-STUDCTR-ATR')
ON CONFLICT (qr_code) DO NOTHING;
