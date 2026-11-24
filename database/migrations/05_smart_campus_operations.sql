-- ==============================================================================
-- MIGRATION 05: SMART CAMPUS OPERATIONS, ASSETS, IoT & INTELLIGENCE
-- Additive Migration - Preserves all existing tables and relationships
-- ==============================================================================

-- 1. Campus Buildings
CREATE TABLE IF NOT EXISTS campus_buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    coordinates_x NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    coordinates_y NUMERIC(8, 2) NOT NULL DEFAULT 0.0,
    floors_count INTEGER NOT NULL DEFAULT 1,
    total_area_sqft NUMERIC(10, 2) DEFAULT 25000.0,
    baseline_energy_kwh NUMERIC(10, 2) DEFAULT 1200.0,
    baseline_water_liters NUMERIC(10, 2) DEFAULT 4500.0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Campus Floors
CREATE TABLE IF NOT EXISTS campus_floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES campus_buildings(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    floor_name VARCHAR(100) NOT NULL,
    floor_plan_svg TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (building_id, floor_number)
);

-- 3. Campus Rooms
CREATE TABLE IF NOT EXISTS campus_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES campus_buildings(id) ON DELETE CASCADE,
    floor_id UUID REFERENCES campus_floors(id) ON DELETE SET NULL,
    room_number VARCHAR(50) NOT NULL,
    room_name VARCHAR(255) NOT NULL,
    room_type VARCHAR(50) NOT NULL DEFAULT 'classroom', -- 'lecture_hall', 'lab', 'office', 'seminar', 'classroom', 'auditorium', 'library'
    capacity INTEGER NOT NULL DEFAULT 40,
    current_occupancy INTEGER NOT NULL DEFAULT 0,
    qr_code VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Smart Campus Assets
CREATE TABLE IF NOT EXISTS campus_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_tag VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'hvac', 'electrical', 'av_projector', 'lab_instrument', 'plumbing', 'it_hardware', 'safety'
    manufacturer VARCHAR(150),
    model_number VARCHAR(150),
    serial_number VARCHAR(150),
    building_id UUID REFERENCES campus_buildings(id) ON DELETE SET NULL,
    floor_id UUID REFERENCES campus_floors(id) ON DELETE SET NULL,
    room_id UUID REFERENCES campus_rooms(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    installation_date DATE,
    warranty_expiry DATE,
    operational_status VARCHAR(50) NOT NULL DEFAULT 'operational', -- 'operational', 'degraded', 'in_maintenance', 'fault', 'decommissioned'
    health_score NUMERIC(5, 2) DEFAULT 100.0,
    maintenance_interval_days INTEGER DEFAULT 90,
    last_inspection_date TIMESTAMPTZ,
    next_inspection_date TIMESTAMPTZ,
    qr_code VARCHAR(255) UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Asset Maintenance Logs
CREATE TABLE IF NOT EXISTS asset_maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES campus_assets(id) ON DELETE CASCADE,
    service_request_id UUID REFERENCES service_requests(id) ON DELETE SET NULL,
    log_type VARCHAR(50) NOT NULL DEFAULT 'inspection', -- 'inspection', 'preventive', 'corrective', 'calibration'
    notes TEXT NOT NULL,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    downtime_hours NUMERIC(6, 2) DEFAULT 0.0,
    cost NUMERIC(10, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Sensor Devices (IoT)
CREATE TABLE IF NOT EXISTS sensor_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_eui VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL, -- 'temperature', 'humidity', 'occupancy', 'electricity_meter', 'water_meter', 'vibration', 'air_quality'
    building_id UUID REFERENCES campus_buildings(id) ON DELETE CASCADE,
    floor_id UUID REFERENCES campus_floors(id) ON DELETE SET NULL,
    room_id UUID REFERENCES campus_rooms(id) ON DELETE SET NULL,
    asset_id UUID REFERENCES campus_assets(id) ON DELETE SET NULL,
    unit VARCHAR(30) NOT NULL, -- '°C', '%', 'people', 'kW', 'kWh', 'L/min', 'mm/s', 'AQI'
    sampling_rate_sec INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    is_simulated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Sensor Readings (Telemetry)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id UUID NOT NULL REFERENCES sensor_devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metric_type VARCHAR(50) NOT NULL,
    value NUMERIC(12, 3) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    is_anomaly BOOLEAN DEFAULT FALSE,
    is_simulated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor_ts ON sensor_readings(sensor_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_anomaly ON sensor_readings(is_anomaly);

-- 8. Campus Incidents & Emergency Management
CREATE TABLE IF NOT EXISTS campus_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'safety', 'facility_fault', 'network_outage', 'power_failure', 'water_leakage', 'fire_drill', 'medical'
    severity VARCHAR(30) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(30) NOT NULL DEFAULT 'reported', -- 'reported', 'acknowledged', 'assigned', 'investigating', 'mitigated', 'resolved', 'closed'
    building_id UUID REFERENCES campus_buildings(id) ON DELETE SET NULL,
    room_id UUID REFERENCES campus_rooms(id) ON DELETE SET NULL,
    assigned_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    evacuation_route_json JSONB,
    related_request_ids UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Predictive Maintenance Recommendations
CREATE TABLE IF NOT EXISTS maintenance_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES campus_assets(id) ON DELETE CASCADE,
    risk_score NUMERIC(5, 2) NOT NULL, -- 0.0 to 100.0
    risk_level VARCHAR(30) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    failure_mode VARCHAR(255) NOT NULL,
    confidence_pct NUMERIC(5, 2) NOT NULL DEFAULT 85.0,
    contributing_factors JSONB NOT NULL,
    recommended_action TEXT NOT NULL,
    recommended_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active', -- 'active', 'converted_to_request', 'dismissed'
    converted_request_id UUID REFERENCES service_requests(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Campus Resource Optimiser Recommendations
CREATE TABLE IF NOT EXISTS resource_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- 'room_reallocation', 'energy_shedding', 'hvac_optimization'
    context_data JSONB NOT NULL,
    score NUMERIC(5, 2) DEFAULT 80.0,
    impact_description TEXT NOT NULL,
    is_applied BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) FOR SMART OPERATIONS
-- ==============================================================================
ALTER TABLE campus_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_recommendations ENABLE ROW LEVEL SECURITY;

-- Read policies: Authenticated users can view buildings, floors, rooms, public assets
CREATE POLICY "Public read campus buildings" ON campus_buildings FOR SELECT USING (true);
CREATE POLICY "Public read campus floors" ON campus_floors FOR SELECT USING (true);
CREATE POLICY "Public read campus rooms" ON campus_rooms FOR SELECT USING (true);
CREATE POLICY "Public read campus assets" ON campus_assets FOR SELECT USING (true);
CREATE POLICY "Public read sensor devices" ON sensor_devices FOR SELECT USING (true);
CREATE POLICY "Public read sensor readings" ON sensor_readings FOR SELECT USING (true);
CREATE POLICY "Public read incidents" ON campus_incidents FOR SELECT USING (true);
CREATE POLICY "Public read predictions" ON maintenance_predictions FOR SELECT USING (true);
CREATE POLICY "Public read resource recommendations" ON resource_recommendations FOR SELECT USING (true);
CREATE POLICY "Public read maintenance logs" ON asset_maintenance_logs FOR SELECT USING (true);

-- Admin write policies: Administrators have full management rights
CREATE POLICY "Admin write campus buildings" ON campus_buildings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'administrator')
);
CREATE POLICY "Admin write campus floors" ON campus_floors FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'administrator')
);
CREATE POLICY "Admin write campus rooms" ON campus_rooms FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'administrator')
);
CREATE POLICY "Admin write campus assets" ON campus_assets FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('administrator', 'staff'))
);
CREATE POLICY "Admin write incidents" ON campus_incidents FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('administrator', 'staff'))
);
CREATE POLICY "Admin write sensor devices" ON sensor_devices FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'administrator')
);
