import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  CampusBuilding,
  CampusFloor,
  CampusRoom,
  CampusAsset,
  CampusIncident,
  MaintenancePrediction,
  ResourceRecommendation,
  AssetStatus,
} from "@/types";

// ==============================================================================
// IN-MEMORY DETERMINISTIC FIXTURES FOR 2D/3D & LOCAL DEMO MODE
// ==============================================================================
export const DEMO_CAMPUS_BUILDINGS: CampusBuilding[] = [
  {
    id: "bld-01",
    name: "Turing Computer Science Complex",
    code: "CS-BLOCK",
    coordinates_x: 280,
    coordinates_y: 200,
    floors_count: 4,
    total_area_sqft: 45000,
    baseline_energy_kwh: 2400,
    baseline_water_liters: 6000,
    description: "Hub for Computing, Robotics Labs, Server Room, and AI Research Centre.",
    is_active: true,
  },
  {
    id: "bld-02",
    name: "Aryabhata Engineering Block",
    code: "ENG-BLOCK",
    coordinates_x: 520,
    coordinates_y: 210,
    floors_count: 5,
    total_area_sqft: 62000,
    baseline_energy_kwh: 3800,
    baseline_water_liters: 8500,
    description: "Mechanical workshops, Electrical substations, IoT lab, and Seminar halls.",
    is_active: true,
  },
  {
    id: "bld-03",
    name: "Ramanujan Central Library",
    code: "LIB-BLOCK",
    coordinates_x: 400,
    coordinates_y: 360,
    floors_count: 3,
    total_area_sqft: 38000,
    baseline_energy_kwh: 1600,
    baseline_water_liters: 3200,
    description: "Digital learning commons, RFID automated checkout, and study pods.",
    is_active: true,
  },
  {
    id: "bld-04",
    name: "Chanakya Administrative HQ",
    code: "ADMIN-HQ",
    coordinates_x: 220,
    coordinates_y: 450,
    floors_count: 3,
    total_area_sqft: 30000,
    baseline_energy_kwh: 1800,
    baseline_water_liters: 4000,
    description: "Campus Operations Command Centre, Registrar, and Dean Offices.",
    is_active: true,
  },
  {
    id: "bld-05",
    name: "Curie Science & Biotechnology Laboratories",
    code: "SCI-LABS",
    coordinates_x: 650,
    coordinates_y: 380,
    floors_count: 4,
    total_area_sqft: 48000,
    baseline_energy_kwh: 4200,
    baseline_water_liters: 12000,
    description: "Fume hoods, autoclave systems, chemistry, and molecular biology suites.",
    is_active: true,
  },
  {
    id: "bld-06",
    name: "Tagore Main Auditorium & Arts Pavilion",
    code: "AUD-PAV",
    coordinates_x: 360,
    coordinates_y: 560,
    floors_count: 2,
    total_area_sqft: 28000,
    baseline_energy_kwh: 1400,
    baseline_water_liters: 3000,
    description: "1,500-seat auditorium, acoustics control booth, and conference suites.",
    is_active: true,
  },
  {
    id: "bld-07",
    name: "Himalaya Student Residence A (Boys)",
    code: "HOSTEL-A",
    coordinates_x: 150,
    coordinates_y: 680,
    floors_count: 6,
    total_area_sqft: 75000,
    baseline_energy_kwh: 5200,
    baseline_water_liters: 28000,
    description: "Residential block with dining facilities, laundry, and indoor games.",
    is_active: true,
  },
  {
    id: "bld-08",
    name: "Nilgiri Student Residence B (Girls)",
    code: "HOSTEL-B",
    coordinates_x: 580,
    coordinates_y: 680,
    floors_count: 6,
    total_area_sqft: 75000,
    baseline_energy_kwh: 5100,
    baseline_water_liters: 27500,
    description: "Residential block with biometric gates, health station, and lounge.",
    is_active: true,
  },
];

export const DEMO_CAMPUS_ROOMS: CampusRoom[] = [
  { id: "rm-101", building_id: "bld-01", room_number: "CS-101", room_name: "Ada Lovelace Computing Lab", room_type: "lab", capacity: 60, current_occupancy: 42, qr_code: "QR-ROOM-CS101", is_active: true },
  { id: "rm-102", building_id: "bld-01", room_number: "CS-204", room_name: "Machine Learning Seminar Hall", room_type: "seminar", capacity: 80, current_occupancy: 68, qr_code: "QR-ROOM-CS204", is_active: true },
  { id: "rm-103", building_id: "bld-01", room_number: "CS-301", room_name: "High Performance Compute Server Room", room_type: "lab", capacity: 10, current_occupancy: 2, qr_code: "QR-ROOM-CS301", is_active: true },
  { id: "rm-201", building_id: "bld-02", room_number: "ENG-105", room_name: "Robotics & Automation Workshop", room_type: "lab", capacity: 45, current_occupancy: 38, qr_code: "QR-ROOM-ENG105", is_active: true },
  { id: "rm-202", building_id: "bld-02", room_number: "ENG-302", room_name: "Smart Grid & Power Electronics Lab", room_type: "lab", capacity: 50, current_occupancy: 31, qr_code: "QR-ROOM-ENG302", is_active: true },
  { id: "rm-203", building_id: "bld-02", room_number: "ENG-401", room_name: "Lecture Hall Alpha", room_type: "lecture_hall", capacity: 120, current_occupancy: 95, qr_code: "QR-ROOM-ENG401", is_active: true },
  { id: "rm-301", building_id: "bld-03", room_number: "LIB-G01", room_name: "Digital Archives & Media Commons", room_type: "library", capacity: 150, current_occupancy: 112, qr_code: "QR-ROOM-LIBG01", is_active: true },
  { id: "rm-401", building_id: "bld-04", room_number: "ADM-101", room_name: "Unified Operations Command Centre", room_type: "office", capacity: 25, current_occupancy: 14, qr_code: "QR-ROOM-ADM101", is_active: true },
  { id: "rm-501", building_id: "bld-05", room_number: "SCI-201", room_name: "Advanced Organic Chemistry Lab", room_type: "lab", capacity: 40, current_occupancy: 24, qr_code: "QR-ROOM-SCI201", is_active: true },
  { id: "rm-601", building_id: "bld-06", room_number: "AUD-MAIN", room_name: "Grand Auditorium Hall", room_type: "auditorium", capacity: 1500, current_occupancy: 250, qr_code: "QR-ROOM-AUD01", is_active: true },
];

export const DEMO_CAMPUS_ASSETS: CampusAsset[] = [
  {
    id: "ast-01",
    asset_tag: "AST-HVAC-CS01",
    name: "Server Room Chilled Water Precision AC",
    category: "hvac",
    manufacturer: "Daikin Applied",
    model_number: "VRV-IV-7500",
    building_id: "bld-01",
    room_id: "rm-103",
    operational_status: "operational",
    health_score: 84.5,
    maintenance_interval_days: 60,
    installation_date: "2023-04-10",
    warranty_expiry: "2028-04-10",
    last_inspection_date: "2026-10-15T09:00:00Z",
    next_inspection_date: "2026-12-15T09:00:00Z",
    qr_code: "QR-AST-HVAC-CS01",
  },
  {
    id: "ast-02",
    asset_tag: "AST-UPS-ENG02",
    name: "Engineering Substation 120kVA Modular UPS",
    category: "electrical",
    manufacturer: "Schneider Electric",
    model_number: "Galaxy-VX-120",
    building_id: "bld-02",
    room_id: "rm-202",
    operational_status: "degraded",
    health_score: 62.0,
    maintenance_interval_days: 90,
    installation_date: "2021-09-12",
    warranty_expiry: "2026-09-12",
    last_inspection_date: "2026-08-20T10:30:00Z",
    next_inspection_date: "2026-11-20T10:30:00Z",
    qr_code: "QR-AST-UPS-ENG02",
  },
  {
    id: "ast-03",
    asset_tag: "AST-ROBOT-01",
    name: "6-Axis Industrial Robotic Arm Trainer",
    category: "lab_instrument",
    manufacturer: "KUKA Robotics",
    model_number: "KR-6-R900",
    building_id: "bld-02",
    room_id: "rm-201",
    operational_status: "operational",
    health_score: 94.0,
    maintenance_interval_days: 120,
    installation_date: "2024-02-15",
    warranty_expiry: "2029-02-15",
    last_inspection_date: "2026-09-01T11:00:00Z",
    next_inspection_date: "2027-01-01T11:00:00Z",
    qr_code: "QR-AST-ROBOT-01",
  },
  {
    id: "ast-04",
    asset_tag: "AST-PROJ-ENG401",
    name: "4K Laser Presentation Projector 10000lm",
    category: "av_projector",
    manufacturer: "Epson Professional",
    model_number: "EB-PU2010B",
    building_id: "bld-02",
    room_id: "rm-203",
    operational_status: "fault",
    health_score: 38.0,
    maintenance_interval_days: 90,
    installation_date: "2022-11-05",
    warranty_expiry: "2025-11-05",
    last_inspection_date: "2026-11-02T14:00:00Z",
    next_inspection_date: "2026-11-10T14:00:00Z",
    qr_code: "QR-AST-PROJ-ENG401",
  },
  {
    id: "ast-05",
    asset_tag: "AST-FUME-SCI01",
    name: "Chemical Fume Hood Airflow Scrubber",
    category: "safety",
    manufacturer: "Labconco",
    model_number: "Protector-Premier-6ft",
    building_id: "bld-05",
    room_id: "rm-501",
    operational_status: "operational",
    health_score: 88.0,
    maintenance_interval_days: 45,
    installation_date: "2023-08-18",
    warranty_expiry: "2028-08-18",
    last_inspection_date: "2026-10-28T09:30:00Z",
    next_inspection_date: "2026-12-12T09:30:00Z",
    qr_code: "QR-AST-FUME-SCI01",
  },
];

export const DEMO_CAMPUS_INCIDENTS: CampusIncident[] = [
  {
    id: "inc-01",
    incident_number: "INC-2026-0042",
    title: "Chilled Water Pipe Leakage in CS Server Room Basement",
    description: "Solenoid valve seal failure reported by telemetry. Automatic pump shutoff engaged. Technician dispatched.",
    category: "water_leakage",
    severity: "critical",
    status: "investigating",
    building_id: "bld-01",
    room_id: "rm-103",
    acknowledged_at: "2026-11-24T06:15:00Z",
    created_at: "2026-11-24T06:05:00Z",
    evacuation_route_json: {
      primary_exit: "Stairwell B -> North Quad Plaza",
      alternative_exit: "Main Lobby Ramp -> East Avenue",
      assembly_point: "Campus North Quad Zone A",
      blocked_exits: ["Basement Service Corridor"],
    },
  },
  {
    id: "inc-02",
    incident_number: "INC-2026-0043",
    title: "Phase Inversion & Overheating on Substation Feeder 3",
    description: "Transformer winding temperature spike detected at 88°C. Non-critical loads shed to prevent breaker trip.",
    category: "power_failure",
    severity: "high",
    status: "mitigated",
    building_id: "bld-02",
    room_id: "rm-202",
    acknowledged_at: "2026-11-24T07:20:00Z",
    created_at: "2026-11-24T07:05:00Z",
    evacuation_route_json: {
      primary_exit: "Emergency Fire Gate 4 -> West Lawn",
      alternative_exit: "Central Courtyard Passage",
      assembly_point: "West Sports Ground Lawn",
    },
  },
  {
    id: "inc-03",
    incident_number: "INC-2026-0044",
    title: "Air Handling Unit 2 Belt Slippage & Vibration Warning",
    description: "Vibration telemetry exceeded 4.2 mm/s threshold. Scheduled for replacement during off-peak maintenance window.",
    category: "facility_fault",
    severity: "medium",
    status: "acknowledged",
    building_id: "bld-03",
    room_id: "rm-301",
    acknowledged_at: "2026-11-24T08:00:00Z",
    created_at: "2026-11-24T07:45:00Z",
  },
];

export const DEMO_PREDICTIVE_MAINTENANCE: MaintenancePrediction[] = [
  {
    id: "pred-01",
    asset_id: "ast-02",
    risk_score: 78.5,
    risk_level: "high",
    failure_mode: "Battery String Impedance Degradation & Capacitor Aging",
    confidence_pct: 91.2,
    contributing_factors: [
      { factor: "Operating Temperature Exceedance", weight_pct: 42, description: "Ambient temperature average 31.4°C over past 30 days" },
      { factor: "Charge Cycle Frequency", weight_pct: 35, description: "34 micro-discharges recorded during grid stabilization" },
      { factor: "Age vs Recommended Lifespan", weight_pct: 23, description: "Capacitor bank operating at 82% of factory MTBF" },
    ],
    recommended_action: "Perform cell thermal imaging and replace modular capacitor bank string 2.",
    recommended_date: "2026-11-28",
    status: "active",
  },
  {
    id: "pred-02",
    asset_id: "ast-04",
    risk_score: 92.0,
    risk_level: "critical",
    failure_mode: "Laser Diode Phosphor Wheel Breakdown & Blue Tint Drift",
    confidence_pct: 95.8,
    contributing_factors: [
      { factor: "Cumulative Runtime Hours", weight_pct: 55, description: "18,400 hours accumulated (92% of diode rated lifespan)" },
      { factor: "Thermal Exhaust Sensor Logs", weight_pct: 28, description: "Exhaust sensor reading delta +14°C above intake" },
      { factor: "Repeated Student Ticket Reports", weight_pct: 17, description: "3 verified service complaints logged in past 14 days" },
    ],
    recommended_action: "Order optical engine replacement unit; convert to priority ticket.",
    recommended_date: "2026-11-25",
    status: "active",
  },
  {
    id: "pred-03",
    asset_id: "ast-01",
    risk_score: 34.0,
    risk_level: "low",
    failure_mode: "Refrigerant Filter Drier Saturation Normal Wear",
    confidence_pct: 86.0,
    contributing_factors: [
      { factor: "Differential Pressure", weight_pct: 60, description: "Normal flow curve with 4% pressure variance" },
      { factor: "Compressor Vibration", weight_pct: 40, description: "Nominal 1.1 mm/s smooth harmonic operation" },
    ],
    recommended_action: "Routine quarterly filter inspection during scheduled December outage.",
    recommended_date: "2026-12-15",
    status: "active",
  },
];

export const DEMO_RESOURCE_RECOMMENDATIONS: ResourceRecommendation[] = [
  {
    id: "rec-01",
    title: "Reallocate CS301 Lecture to Lecture Hall Alpha",
    resource_type: "room_reallocation",
    context_data: {
      affected_room: "CS-204",
      recommended_room: "ENG-401",
      current_occupancy_pct: 85,
      capacity_gain: 40,
    },
    score: 94.0,
    impact_description: "CS-204 is running at 85% capacity with projector issues. ENG-401 is vacant with optimal AV readiness.",
    is_applied: false,
    created_at: "2026-11-24T08:30:00Z",
  },
  {
    id: "rec-02",
    title: "Automate Tagore Auditorium HVAC Setback (18:00 - 08:00)",
    resource_type: "energy_shedding",
    context_data: {
      building: "AUD-PAV",
      estimated_kwh_savings_daily: 420,
      carbon_offset_kg_daily: 315,
    },
    score: 88.5,
    impact_description: "Auditorium has zero scheduled rehearsals after 18:00. Shedding auxiliary chilling saves ~420 kWh daily.",
    is_applied: true,
    applied_at: "2026-11-23T18:00:00Z",
    created_at: "2026-11-23T14:00:00Z",
  },
];

// ==============================================================================
// SERVICE FUNCTIONS (SUPABASE + LOCAL IN-MEMORY ADAPTER)
// ==============================================================================

export async function getCampusBuildings(): Promise<CampusBuilding[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_CAMPUS_BUILDINGS;
  }

  const supabase = createClient() as any;
  const { data, error } = await supabase
    .from("campus_buildings")
    .select("*, rooms:campus_rooms(*)")
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    return DEMO_CAMPUS_BUILDINGS;
  }

  return data as CampusBuilding[];
}

export async function getCampusRooms(): Promise<CampusRoom[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_CAMPUS_ROOMS;
  }

  const supabase = createClient() as any;
  const { data, error } = await supabase
    .from("campus_rooms")
    .select("*, building:campus_buildings(*)")
    .order("room_number", { ascending: true });

  if (error || !data || data.length === 0) {
    return DEMO_CAMPUS_ROOMS;
  }

  return data as CampusRoom[];
}

export async function getCampusAssets(filters?: {
  buildingId?: string;
  category?: string;
  status?: AssetStatus;
}): Promise<CampusAsset[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_CAMPUS_ASSETS.filter((a) => {
      if (filters?.buildingId && a.building_id !== filters.buildingId) return false;
      if (filters?.category && a.category !== filters.category) return false;
      if (filters?.status && a.operational_status !== filters.status) return false;
      return true;
    });
  }

  const supabase = createClient() as any;
  let query = supabase.from("campus_assets").select("*, building:campus_buildings(*), room:campus_rooms(*)");

  if (filters?.buildingId) query = query.eq("building_id", filters.buildingId);
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.status) query = query.eq("operational_status", filters.status);

  const { data, error } = await query.order("health_score", { ascending: true });
  if (error || !data || data.length === 0) {
    return DEMO_CAMPUS_ASSETS;
  }

  return data as CampusAsset[];
}

export async function getCampusIncidents(): Promise<CampusIncident[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_CAMPUS_INCIDENTS;
  }

  const supabase = createClient() as any;
  const { data, error } = await supabase
    .from("campus_incidents")
    .select("*, building:campus_buildings(*), room:campus_rooms(*)")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return DEMO_CAMPUS_INCIDENTS;
  }

  return data as CampusIncident[];
}

export async function getMaintenancePredictions(): Promise<MaintenancePrediction[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_PREDICTIVE_MAINTENANCE;
  }

  const supabase = createClient() as any;
  const { data, error } = await supabase
    .from("maintenance_predictions")
    .select("*, asset:campus_assets(*)")
    .order("risk_score", { ascending: false });

  if (error || !data || data.length === 0) {
    return DEMO_PREDICTIVE_MAINTENANCE;
  }

  return data as MaintenancePrediction[];
}

export async function getResourceRecommendations(): Promise<ResourceRecommendation[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_RESOURCE_RECOMMENDATIONS;
  }

  const supabase = createClient() as any;
  const { data, error } = await supabase
    .from("resource_recommendations")
    .select("*")
    .order("score", { ascending: false });

  if (error || !data || data.length === 0) {
    return DEMO_RESOURCE_RECOMMENDATIONS;
  }

  return data as ResourceRecommendation[];
}
