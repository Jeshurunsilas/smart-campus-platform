-- ==============================================================================
-- SMART CAMPUS PLATFORM - DATABASE SEED SCRIPT (database/seed.sql)
-- Idempotent Demo Data Set with 100% Referenced Foreign Keys
-- ==============================================================================

-- 1. DEPARTMENTS (8 Campus Operational Departments)
INSERT INTO public.departments (id, name, description, department_head, created_at)
VALUES
    ('d0000002-0000-0000-0000-000000000001', 'IT Support', 'Campus high-speed network, computer labs, AV equipment, and software installation.', 'Vikram Malhotra', now()),
    ('d0000002-0000-0000-0000-000000000002', 'Electrical Maintenance', 'Campus power distribution, classroom fans, lighting, circuit breakers, and backup UPS.', 'Ramesh Iyer', now()),
    ('d0000002-0000-0000-0000-000000000003', 'Civil Maintenance', 'Structural masonry, carpentry, furniture repairs, painting, and water pipelines.', 'Sunil Verma', now()),
    ('d0000002-0000-0000-0000-000000000004', 'Hostel Management', 'Residential hall accommodations, room fixtures, plumbing, and student amenities.', 'Ananya Deshmukh', now()),
    ('d0000002-0000-0000-0000-000000000005', 'Laboratory Management', 'Scientific instrumentation, pure gas lines, chemical fume hoods, and safety equipment.', 'Dr. K. S. Raman', now()),
    ('d0000002-0000-0000-0000-000000000006', 'Transport Services', 'University bus fleet scheduling, shuttle tracking, and vehicle maintenance.', 'Gurpreet Singh', now()),
    ('d0000002-0000-0000-0000-000000000007', 'Library Services', 'Digital archive servers, study room AC, book scanner kiosks, and catalog terminals.', 'Meenakshi Sundaram', now()),
    ('d0000002-0000-0000-0000-000000000008', 'Housekeeping', 'Campus hygiene, sanitation, recycling, corridor cleaning, and restroom maintenance.', 'Lalita Devi', now())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    department_head = EXCLUDED.department_head;

-- 2. SERVICE CATEGORIES (Realistic Categories per Department)
INSERT INTO public.service_categories (id, department_id, name, description, default_priority, estimated_sla_hours, created_at)
VALUES
    -- IT Support
    ('d0000004-0000-0000-0000-000000000001', 'd0000002-0000-0000-0000-000000000001', 'Wi-Fi Connectivity', 'Wireless access point dead zones, authentication failures, and slow throughput.', 'High', 12, now()),
    ('d0000004-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'Computer Not Working', 'Desktop workstation boot failure, OS crash, or peripheral malfunction.', 'Medium', 24, now()),
    ('d0000004-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000001', 'Projector Issue', 'Classroom projector lamp blown, HDMI port not connecting, or blurry image.', 'High', 12, now()),
    ('d0000004-0000-0000-0000-000000000004', 'd0000002-0000-0000-0000-000000000001', 'Software Installation', 'Licensed CAD, MATLAB, or IDE deployment requests for academic labs.', 'Low', 48, now()),

    -- Electrical Maintenance
    ('d0000004-0000-0000-0000-000000000005', 'd0000002-0000-0000-0000-000000000002', 'Power Failure', 'Complete blackout in wing, tripped circuit breaker, or generator failure.', 'Critical', 4, now()),
    ('d0000004-0000-0000-0000-000000000006', 'd0000002-0000-0000-0000-000000000002', 'Fan Not Working', 'Noisy ceiling fan, seized motor, or regulator knob detached.', 'Low', 48, now()),
    ('d0000004-0000-0000-0000-000000000007', 'd0000002-0000-0000-0000-000000000002', 'Light Replacement', 'Flickering fluorescent tubes or burned out LED ceiling panels.', 'Low', 48, now()),
    ('d0000004-0000-0000-0000-000000000008', 'd0000002-0000-0000-0000-000000000002', 'Electrical Wiring', 'Exposed conduit, spark hazard, or damaged floor electrical outlet box.', 'Critical', 4, now()),

    -- Civil Maintenance
    ('d0000004-0000-0000-0000-000000000009', 'd0000002-0000-0000-0000-000000000003', 'Water Leakage', 'Pipe rupture, ceiling seepage, or leaking tap in academic facilities.', 'High', 12, now()),
    ('d0000004-0000-0000-0000-000000000010', 'd0000002-0000-0000-0000-000000000003', 'Furniture Damage', 'Broken student desk bench, detached chair armrest, or loose podium.', 'Low', 48, now()),
    ('d0000004-0000-0000-0000-000000000011', 'd0000002-0000-0000-0000-000000000003', 'Classroom Maintenance', 'Door lock stuck, window latch broken, or blackboard resurfacing.', 'Medium', 24, now()),
    ('d0000004-0000-0000-0000-000000000012', 'd0000002-0000-0000-0000-000000000003', 'Building Repair', 'Staircase railing looseness, cracked wall plaster, or rain drainage clog.', 'High', 12, now()),

    -- Hostel Management
    ('d0000004-0000-0000-0000-000000000013', 'd0000002-0000-0000-0000-000000000004', 'Room Maintenance', 'Cupboard latch broken, room door lock cylinder jammed, or bed frame repair.', 'Medium', 24, now()),
    ('d0000004-0000-0000-0000-000000000014', 'd0000002-0000-0000-0000-000000000004', 'Plumbing', 'Bathroom flush tank valve overflow or clogged floor drainage drain.', 'High', 12, now()),
    ('d0000004-0000-0000-0000-000000000015', 'd0000002-0000-0000-0000-000000000004', 'Cleaning', 'Hostel corridor mopping, balcony waste clearing, or common room sanitation.', 'Low', 48, now()),
    ('d0000004-0000-0000-0000-000000000016', 'd0000002-0000-0000-0000-000000000004', 'Water Supply', 'Solar water heater failure, geyser malfunction, or overhead tank low pressure.', 'High', 12, now()),

    -- Laboratory Management
    ('d0000004-0000-0000-0000-000000000017', 'd0000002-0000-0000-0000-000000000005', 'Equipment Failure', 'Centrifuge balance fault, spectrometer calibration drift, or autoclave leak.', 'High', 12, now()),
    ('d0000004-0000-0000-0000-000000000018', 'd0000002-0000-0000-0000-000000000005', 'Computer Lab Issue', 'GPU compute workstation overheating or network switch disconnected.', 'Medium', 24, now()),
    ('d0000004-0000-0000-0000-000000000019', 'd0000002-0000-0000-0000-000000000005', 'Laboratory Safety', 'Chemical fume hood exhaust airflow warning or eye-wash fountain failure.', 'Critical', 4, now())
ON CONFLICT (id) DO NOTHING;

-- 3. CAMPUS LOCATIONS (10 Locations with Floors & Rooms)
INSERT INTO public.locations (id, building_name, floor, room_number, qr_code, created_at)
VALUES
    ('d0000003-0000-0000-0000-000000000001', 'Main Academic Block', 'Floor 2', 'Classroom 204', 'CAMPUS:LOC:Main%20Academic%20Block:Floor%202:Classroom%20204:d0000002-0000-0000-0000-000000000001', now()),
    ('d0000003-0000-0000-0000-000000000002', 'Computer Science Block', 'Floor 1', 'Computer Lab 102', 'CAMPUS:LOC:Computer%20Science%20Block:Floor%201:Computer%20Lab%20102:d0000002-0000-0000-0000-000000000001', now()),
    ('d0000003-0000-0000-0000-000000000003', 'Engineering Block', 'Floor 3', 'Robotics Workshop 305', 'CAMPUS:LOC:Engineering%20Block:Floor%203:Robotics%20Workshop%20305:d0000002-0000-0000-0000-000000000002', now()),
    ('d0000003-0000-0000-0000-000000000004', 'Central Library', 'Ground Floor', 'Digital Reference Room', 'CAMPUS:LOC:Central%20Library:Ground%20Floor:Digital%20Reference%20Room:d0000002-0000-0000-0000-000000000007', now()),
    ('d0000003-0000-0000-0000-000000000005', 'Main Laboratory', 'Floor 3', 'Chemistry Lab 301', 'CAMPUS:LOC:Main%20Laboratory:Floor%203:Chemistry%20Lab%20301:d0000002-0000-0000-0000-000000000005', now()),
    ('d0000003-0000-0000-0000-000000000006', 'Boys Hostel', 'Floor 2', 'Room 214', 'CAMPUS:LOC:Boys%20Hostel:Floor%202:Room%20214:d0000002-0000-0000-0000-000000000004', now()),
    ('d0000003-0000-0000-0000-000000000007', 'Girls Hostel', 'Floor 1', 'Room 108', 'CAMPUS:LOC:Girls%20Hostel:Floor%201:Room%20108:d0000002-0000-0000-0000-000000000004', now()),
    ('d0000003-0000-0000-0000-000000000008', 'Administrative Block', 'Floor 1', 'Conference Room A', 'CAMPUS:LOC:Administrative%20Block:Floor%201:Conference%20Room%20A:d0000002-0000-0000-0000-000000000001', now()),
    ('d0000003-0000-0000-0000-000000000009', 'Sports Complex', 'Ground Floor', 'Gymnasium & Indoor Hall', 'CAMPUS:LOC:Sports%20Complex:Ground%20Floor:Gymnasium:d0000002-0000-0000-0000-000000000003', now()),
    ('d0000003-0000-0000-0000-000000000010', 'Main Auditorium', 'Main Hall', 'Audio Control Booth', 'CAMPUS:LOC:Main%20Auditorium:Main%20Hall:Control%20Booth:d0000002-0000-0000-0000-000000000001', now())
ON CONFLICT (id) DO NOTHING;

-- 4. DEMO USER PROFILES
INSERT INTO public.profiles (id, email, full_name, role, approval_status, registration_number, faculty_id, department_id, phone_number, created_at, updated_at)
VALUES
    ('d0000001-0000-0000-0000-000000000001', 'admin@smartcampus.demo', 'Campus Administrator', 'administrator', 'approved', NULL, NULL, NULL, '+1 (555) 010-0001', now(), now()),
    ('d0000001-0000-0000-0000-000000000002', 'student@smartcampus.demo', 'Rahul Kumar', 'student', 'approved', 'STU-2026-001', NULL, 'd0000002-0000-0000-0000-000000000001', '+1 (555) 010-0002', now(), now()),
    ('d0000001-0000-0000-0000-000000000003', 'faculty@smartcampus.demo', 'Priya Sharma', 'faculty', 'approved', NULL, 'FAC-2026-001', 'd0000002-0000-0000-0000-000000000001', '+1 (555) 010-0003', now(), now()),
    ('d0000001-0000-0000-0000-000000000004', 'staff@smartcampus.demo', 'Arjun Kumar', 'department_staff', 'approved', NULL, NULL, 'd0000002-0000-0000-0000-000000000001', '+1 (555) 010-0004', now(), now())
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    approval_status = EXCLUDED.approval_status;

-- 5. SAMPLE SERVICE REQUESTS (26 Realistic Requests with Diverse Statuses & Priorities)
INSERT INTO public.service_requests (id, request_number, user_id, department_id, category_id, location_id, title, description, severity, priority, status, assigned_staff_id, sla_deadline, is_overdue, created_at, updated_at)
VALUES
    -- 1. Wi-Fi not working in Computer Lab
    ('d0000005-0000-0000-0000-000000000001', 'REQ-2026-1001', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000001', 'd0000003-0000-0000-0000-000000000002',
     'Wi-Fi not working in Computer Lab', 'Access point AP-CS-102 drops packets continuously during student programming exams. Gateway not responding.', 'High', 'High', 'In Progress', 'd0000001-0000-0000-0000-000000000004', now() + interval '8 hours', false, now() - interval '4 hours', now()),

    -- 2. Projector not displaying in Classroom 204
    ('d0000005-0000-0000-0000-000000000002', 'REQ-2026-1002', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000003', 'd0000003-0000-0000-0000-000000000001',
     'Projector not displaying in Classroom 204', 'Ceiling-mounted Epson projector power LED blinks orange. HDMI input source reports No Signal.', 'High', 'High', 'Assigned', 'd0000001-0000-0000-0000-000000000004', now() + interval '6 hours', false, now() - interval '2 hours', now()),

    -- 3. Broken ceiling fan in Lecture Hall
    ('d0000005-0000-0000-0000-000000000003', 'REQ-2026-1003', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000002', 'd0000004-0000-0000-0000-000000000006', 'd0000003-0000-0000-0000-000000000001',
     'Broken ceiling fan in Lecture Hall', 'Ceiling fan #3 makes loud scraping noise and vibrates violently at medium speed. Turned off for safety.', 'Low', 'Low', 'Submitted', NULL, now() + interval '36 hours', false, now() - interval '5 hours', now()),

    -- 4. Water leakage in Boys Hostel
    ('d0000005-0000-0000-0000-000000000004', 'REQ-2026-1004', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000004', 'd0000004-0000-0000-0000-000000000014', 'd0000003-0000-0000-0000-000000000006',
     'Water leakage in Boys Hostel', 'Bathroom pipe fitting beneath sink cracked, causing pooling on the floor and seepage into room 214.', 'High', 'High', 'Accepted', 'd0000001-0000-0000-0000-000000000004', now() + interval '4 hours', false, now() - interval '3 hours', now()),

    -- 5. Library computer not starting
    ('d0000005-0000-0000-0000-000000000005', 'REQ-2026-1005', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000002', 'd0000003-0000-0000-0000-000000000004',
     'Library computer not starting', 'Workstation terminal #12 in Digital Reference Room displays BIOS error: No boot device found.', 'Medium', 'Medium', 'Under Review', NULL, now() + interval '18 hours', false, now() - interval '1 hour', now()),

    -- 6. Electrical issue in Engineering Block
    ('d0000005-0000-0000-0000-000000000006', 'REQ-2026-1006', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000002', 'd0000004-0000-0000-0000-000000000008', 'd0000003-0000-0000-0000-000000000003',
     'Electrical issue in Engineering Block', 'Sparks emitted from 3-phase heavy machine supply breaker box in Robotics Workshop. Immediate hazard.', 'Critical', 'Critical', 'In Progress', 'd0000001-0000-0000-0000-000000000004', now() + interval '1 hour', false, now() - interval '1 hour', now()),

    -- 7. Laboratory equipment malfunction
    ('d0000005-0000-0000-0000-000000000007', 'REQ-2026-1007', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000005', 'd0000004-0000-0000-0000-000000000017', 'd0000003-0000-0000-0000-000000000005',
     'Laboratory equipment malfunction', 'Spectrophotometer digital sensor reading fluctuates randomly. Calibration standards fail validation check.', 'High', 'High', 'Resolved', 'd0000001-0000-0000-0000-000000000004', now() - interval '2 hours', false, now() - interval '14 hours', now()),

    -- 8. Damaged classroom furniture
    ('d0000005-0000-0000-0000-000000000008', 'REQ-2026-1008', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000003', 'd0000004-0000-0000-0000-000000000010', 'd0000003-0000-0000-0000-000000000001',
     'Damaged classroom furniture', 'Row 4 bench support bracket is detached, posing danger of tipping over during lectures.', 'Low', 'Low', 'Resolved', 'd0000001-0000-0000-0000-000000000004', now() - interval '10 hours', false, now() - interval '28 hours', now()),

    -- 9. Network connectivity issue
    ('d0000005-0000-0000-0000-000000000009', 'REQ-2026-1009', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000001', 'd0000003-0000-0000-0000-000000000008',
     'Network connectivity issue', 'Ethernet ports on Conference Room A table switch are unpowered. Video conference uplink degraded.', 'High', 'High', 'In Progress', 'd0000001-0000-0000-0000-000000000004', now() + interval '5 hours', false, now() - interval '3 hours', now()),

    -- 10. Hostel bathroom maintenance
    ('d0000005-0000-0000-0000-000000000010', 'REQ-2026-1010', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000004', 'd0000004-0000-0000-0000-000000000014', 'd0000003-0000-0000-0000-000000000006',
     'Hostel bathroom maintenance', 'Shower head mixer valve stuck on scalding temperature. Requires immediate cartridge replacement.', 'Medium', 'Medium', 'Closed', 'd0000001-0000-0000-0000-000000000004', now() - interval '30 hours', false, now() - interval '48 hours', now()),

    -- 11. Chemistry Lab Fume Hood Airflow Fault
    ('d0000005-0000-0000-0000-000000000011', 'REQ-2026-1011', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000005', 'd0000004-0000-0000-0000-000000000019', 'd0000003-0000-0000-0000-000000000005',
     'Fume Hood Exhaust Failure in Lab 301', 'Face velocity alarm triggered on chemical fume hood #2. Organic solvent vapors not exhausting properly.', 'Critical', 'Critical', 'In Progress', 'd0000001-0000-0000-0000-000000000004', now() + interval '2 hours', false, now() - interval '1 hour', now()),

    -- 12. Main Auditorium Wireless Mic Static
    ('d0000005-0000-0000-0000-000000000012', 'REQ-2026-1012', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000003', 'd0000003-0000-0000-0000-000000000010',
     'Auditorium sound system RF interference', 'Wireless lapel microphones experience heavy crackling audio dropouts during convocation rehearsals.', 'Medium', 'Medium', 'Submitted', NULL, now() + interval '20 hours', false, now() - interval '2 hours', now()),

    -- 13. Girls Hostel Solar Geyser Not Heating
    ('d0000005-0000-0000-0000-000000000013', 'REQ-2026-1013', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000004', 'd0000004-0000-0000-0000-000000000016', 'd0000003-0000-0000-0000-000000000007',
     'Solar water heater element burned out', 'First floor shower line has no hot water supply since yesterday morning. Heating element failure.', 'High', 'High', 'Assigned', 'd0000001-0000-0000-0000-000000000004', now() + interval '7 hours', false, now() - interval '3 hours', now()),

    -- 14. Sports Complex Treadmill Belt Slipping
    ('d0000005-0000-0000-0000-000000000014', 'REQ-2026-1014', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000003', 'd0000004-0000-0000-0000-000000000010', 'd0000003-0000-0000-0000-000000000009',
     'Gymnasium commercial treadmill motor error', 'Treadmill #2 motor controller trips after 5 minutes of operation. Drive belt tension is loose.', 'Low', 'Low', 'Resolved', 'd0000001-0000-0000-0000-000000000004', now() - interval '18 hours', false, now() - interval '36 hours', now()),

    -- 15. MATLAB License Server Connection Drop
    ('d0000005-0000-0000-0000-000000000015', 'REQ-2026-1015', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000004', 'd0000003-0000-0000-0000-000000000003',
     'MATLAB Network License Checkout Failure', 'Workstations in Engineering Block fail to check out Toolboxes due to FlexLM port block.', 'High', 'High', 'Resolved', 'd0000001-0000-0000-0000-000000000004', now() - interval '5 hours', false, now() - interval '18 hours', now()),

    -- 16. Overdue Chiller Leak in Server Room
    ('d0000005-0000-0000-0000-000000000016', 'REQ-2026-1016', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000002', 'd0000004-0000-0000-0000-000000000005', 'd0000003-0000-0000-0000-000000000002',
     'Server Room precision AC condensation leak', 'Overhead drainage condensation tray overflowing near Core Switch Rack #1.', 'Critical', 'Critical', 'In Progress', 'd0000001-0000-0000-0000-000000000004', now() - interval '1 hour', true, now() - interval '6 hours', now()),

    -- 17. Broken Window Glass in Classroom 204
    ('d0000005-0000-0000-0000-000000000017', 'REQ-2026-1017', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000003', 'd0000004-0000-0000-0000-000000000011', 'd0000003-0000-0000-0000-000000000001',
     'Cracked outer glass pane in room 204', 'High winds caused outer casement window frame to fracture. Glass shards present on sill.', 'Medium', 'Medium', 'Under Review', NULL, now() + interval '22 hours', false, now() - interval '2 hours', now()),

    -- 18. Central Library Book Scanner Optical Error
    ('d0000005-0000-0000-0000-000000000018', 'REQ-2026-1018', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000002', 'd0000003-0000-0000-0000-000000000004',
     'Overhead Bookeye scanner calibration lost', 'Archival overhead book scanner produces dark vertical lines on high-resolution PDF scans.', 'Low', 'Low', 'Assigned', 'd0000001-0000-0000-0000-000000000004', now() + interval '42 hours', false, now() - interval '4 hours', now()),

    -- 19. Water Cooler Chiller Failure in CS Block
    ('d0000005-0000-0000-0000-000000000019', 'REQ-2026-1019', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000003', 'd0000004-0000-0000-0000-000000000009', 'd0000003-0000-0000-0000-000000000002',
     'Water cooler dispensing room-temperature water', 'First-floor stainless steel water dispenser compressor is humming but not cooling.', 'Low', 'Low', 'Accepted', 'd0000001-0000-0000-0000-000000000004', now() + interval '40 hours', false, now() - interval '6 hours', now()),

    -- 20. Main Auditorium Stage Spotlight Dimmer Blown
    ('d0000005-0000-0000-0000-000000000020', 'REQ-2026-1020', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000002', 'd0000004-0000-0000-0000-000000000007', 'd0000003-0000-0000-0000-000000000010',
     'Stage DMX dimmer rack channel 4 unresponsive', 'Left cyclorama wash lights stay at 100% brightness; DMX console cannot control dimming.', 'Medium', 'Medium', 'Resolved', 'd0000001-0000-0000-0000-000000000004', now() - interval '24 hours', false, now() - interval '50 hours', now()),

    -- 21. Girls Hostel Balcony Netting Detached
    ('d0000005-0000-0000-0000-000000000021', 'REQ-2026-1021', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000004', 'd0000004-0000-0000-0000-000000000013', 'd0000003-0000-0000-0000-000000000007',
     'Pigeon safety netting torn in Block C', 'Upper corner fastener came loose during storm; birds entering corridor balconies.', 'Low', 'Low', 'Submitted', NULL, now() + interval '46 hours', false, now() - interval '1 hour', now()),

    -- 22. Robotics Workshop Emergency Stop Button Stuck
    ('d0000005-0000-0000-0000-000000000022', 'REQ-2026-1022', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000002', 'd0000004-0000-0000-0000-000000000008', 'd0000003-0000-0000-0000-000000000003',
     'Lathe machine E-Stop button latch failed', 'Industrial lathe emergency mushroom kill-switch remains depressed and won''t reset.', 'High', 'High', 'In Progress', 'd0000001-0000-0000-0000-000000000004', now() + interval '9 hours', false, now() - interval '2 hours', now()),

    -- 23. Boys Hostel Wi-Fi Router Antenna Broken
    ('d0000005-0000-0000-0000-000000000023', 'REQ-2026-1023', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000001', 'd0000003-0000-0000-0000-000000000006',
     'Corridor Wi-Fi access point antenna damaged', 'Ceiling-mounted access point AP-BH-2 has cracked SMA antenna mount. Signal weak in end rooms.', 'Low', 'Low', 'Resolved', 'd0000001-0000-0000-0000-000000000004', now() - interval '12 hours', false, now() - interval '32 hours', now()),

    -- 24. Chemistry Lab Autoclave Gasket Leak
    ('d0000005-0000-0000-0000-000000000024', 'REQ-2026-1024', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000005', 'd0000004-0000-0000-0000-000000000017', 'd0000003-0000-0000-0000-000000000005',
     'Steam sterilizer pressure chamber leak', 'High-pressure autoclave fails to hold 121C sterilization pressure due to degraded silicone seal.', 'High', 'High', 'Accepted', 'd0000001-0000-0000-0000-000000000004', now() + interval '10 hours', false, now() - interval '2 hours', now()),

    -- 25. Main Academic Block Staircase Handrail Loose
    ('d0000005-0000-0000-0000-000000000025', 'REQ-2026-1025', 'd0000001-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000003', 'd0000004-0000-0000-0000-000000000012', 'd0000003-0000-0000-0000-000000000001',
     'West stairwell metal handrail anchor loose', 'Anchor bolts pulled out of concrete between 1st and 2nd floor stairs. Structural trip hazard.', 'High', 'High', 'Resolved', 'd0000001-0000-0000-0000-000000000004', now() - interval '6 hours', false, now() - interval '22 hours', now()),

    -- 26. Administrative Block Air Conditioning Thermostat Fault
    ('d0000005-0000-0000-0000-000000000026', 'REQ-2026-1026', 'd0000001-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000002', 'd0000004-0000-0000-0000-000000000006', 'd0000003-0000-0000-0000-000000000008',
     'Conference Room digital thermostat frozen', 'Wall-mounted HVAC controller screen displays Error 44; temperature remains locked at 18C.', 'Low', 'Low', 'Closed', 'd0000001-0000-0000-0000-000000000004', now() - interval '40 hours', false, now() - interval '70 hours', now())
ON CONFLICT (id) DO NOTHING;

-- 6. REQUEST AUDIT LOGS (SAMPLE HISTORY)
INSERT INTO public.request_updates (id, request_id, updated_by, old_status, new_status, comment, created_at)
VALUES
    ('d0000006-0000-0000-0000-000000000001', 'd0000005-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000002', NULL, 'Submitted', 'Ticket submitted by Rahul Kumar via Student Portal.', now() - interval '4 hours'),
    ('d0000006-0000-0000-0000-000000000002', 'd0000005-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'Submitted', 'Assigned', 'Dispatched to Arjun Kumar (IT Support).', now() - interval '3 hours'),
    ('d0000006-0000-0000-0000-000000000003', 'd0000005-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000004', 'Assigned', 'In Progress', 'Technician arrived on-site. Testing PoE injector on switch port #14.', now() - interval '1 hour'),
    ('d0000006-0000-0000-0000-000000000007', 'd0000005-0000-0000-0000-000000000007', 'd0000001-0000-0000-0000-000000000004', 'In Progress', 'Resolved', 'Recalibrated optical sensor and cleaned mirror assembly with isopropanol. Calibration curve verified.', now() - interval '2 hours')
ON CONFLICT (id) DO NOTHING;

-- 7. NOTIFICATIONS
INSERT INTO public.notifications (id, user_id, title, message, is_read, related_request_id, created_at)
VALUES
    ('d0000007-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000002', 'Ticket Update: REQ-2026-1001', 'Your Wi-Fi request in Computer Lab 102 has been marked In Progress by technician Arjun Kumar.', false, 'd0000005-0000-0000-0000-000000000001', now() - interval '1 hour'),
    ('d0000007-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000003', 'Work Order Completed: REQ-2026-1007', 'Spectrophotometer calibration has been completed and verified. Please rate your service experience.', false, 'd0000005-0000-0000-0000-000000000007', now() - interval '2 hours'),
    ('d0000007-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000004', 'Urgent Dispatch: Electrical Issue', 'Critical emergency order REQ-2026-1006 assigned in Engineering Block. Immediate inspection required.', false, 'd0000005-0000-0000-0000-000000000006', now() - interval '1 hour'),
    ('d0000007-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000001', 'Supervisor Alert: SLA Breach Risk', 'Server Room precision AC ticket REQ-2026-1016 has exceeded 100% of standard SLA deadline.', false, 'd0000005-0000-0000-0000-000000000016', now() - interval '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- 8. CAMPUS ANNOUNCEMENTS (At Least 5 Official University Broadcasts)
INSERT INTO public.announcements (id, title, content, created_by, target_audience, created_at)
VALUES
    ('d0000008-0000-0000-0000-000000000001', 'Campus Wi-Fi Maintenance', 'Core router firmware upgrades will take place this Saturday from 01:00 AM to 05:00 AM. Intermittent wireless drops are expected across all academic quads.', 'd0000001-0000-0000-0000-000000000001', 'all', now() - interval '1 day'),
    ('d0000008-0000-0000-0000-000000000002', 'Library Working Hours Update', 'During upcoming midterm exam weeks, the Central Library reading halls will remain open 24/7. Digital archive terminals remain available on Ground Floor.', 'd0000001-0000-0000-0000-000000000001', 'all', now() - interval '2 days'),
    ('d0000008-0000-0000-0000-000000000003', 'Laboratory Maintenance Schedule', 'Main Laboratory blocks 301 through 308 will undergo compulsory fume hood exhaust duct inspection this Thursday. Experiments requiring toxic reagents must be rescheduled.', 'd0000001-0000-0000-0000-000000000001', 'faculty', now() - interval '3 days'),
    ('d0000008-0000-0000-0000-000000000004', 'Electrical Inspection Notice', 'Annual transformer substation dielectric oil testing is scheduled for Sunday. High-voltage engineering equipment will be powered off from 08:00 AM to 12:00 PM.', 'd0000001-0000-0000-0000-000000000001', 'all', now() - interval '4 days'),
    ('d0000008-0000-0000-0000-000000000005', 'Campus Cleaning Schedule', 'Deep disinfection and floor buffing will take place in Boys Hostel and Girls Hostel common corridors between 09:00 AM and 01:00 PM this weekend.', 'd0000001-0000-0000-0000-000000000001', 'student', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

-- 9. USER SATISFACTION FEEDBACK (1 to 5 Stars on Completed Tickets)
INSERT INTO public.feedback (id, request_id, user_id, rating, comment, created_at)
VALUES
    ('d0000009-0000-0000-0000-000000000001', 'd0000005-0000-0000-0000-000000000007', 'd0000001-0000-0000-0000-000000000003', 5, 'Dr. Raman and technician Arjun arrived swiftly and recalibrated the spectrophotometer optics. Lab research was back on track without losing sample integrity.', now() - interval '1 hour'),
    ('d0000009-0000-0000-0000-000000000002', 'd0000005-0000-0000-0000-000000000008', 'd0000001-0000-0000-0000-000000000002', 5, 'Classroom bench bracket was securely re-anchored. Technician cleaned up metal shavings before leaving.', now() - interval '8 hours'),
    ('d0000009-0000-0000-0000-000000000003', 'd0000005-0000-0000-0000-000000000014', 'd0000001-0000-0000-0000-000000000002', 4, 'Gym treadmill belt tension was adjusted properly. Operates smoothly now.', now() - interval '16 hours'),
    ('d0000009-0000-0000-0000-000000000004', 'd0000005-0000-0000-0000-000000000015', 'd0000001-0000-0000-0000-000000000003', 5, 'MATLAB license checkout network ports were cleared by IT Support within two hours. Exceptional response time.', now() - interval '4 hours')
ON CONFLICT (id) DO NOTHING;
