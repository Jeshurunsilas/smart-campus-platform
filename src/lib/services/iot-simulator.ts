import { SensorDevice, SensorReading, SensorType } from "@/types";

// ==============================================================================
// SENSOR REGISTRY (SIMULATED & FUTURE ESP32 / PHYSICAL ADAPTERS)
// ==============================================================================

export const CONFIGURED_SENSORS: SensorDevice[] = [
  {
    id: "sns-temp-cs103",
    device_eui: "EUI-TEMP-CS-001",
    name: "CS Server Room Ambient Temp",
    sensor_type: "temperature",
    building_id: "bld-01",
    room_id: "rm-103",
    asset_id: "ast-01",
    unit: "°C",
    sampling_rate_sec: 15,
    is_active: true,
    is_simulated: true,
  },
  {
    id: "sns-hum-cs103",
    device_eui: "EUI-HUM-CS-002",
    name: "CS Server Room Relative Humidity",
    sensor_type: "humidity",
    building_id: "bld-01",
    room_id: "rm-103",
    asset_id: "ast-01",
    unit: "%",
    sampling_rate_sec: 30,
    is_active: true,
    is_simulated: true,
  },
  {
    id: "sns-elec-eng01",
    device_eui: "EUI-ELEC-ENG-001",
    name: "Aryabhata Engineering Main Feeder 1",
    sensor_type: "electricity_meter",
    building_id: "bld-02",
    room_id: "rm-202",
    asset_id: "ast-02",
    unit: "kW",
    sampling_rate_sec: 10,
    is_active: true,
    is_simulated: true,
  },
  {
    id: "sns-occ-lib01",
    device_eui: "EUI-OCC-LIB-001",
    name: "Central Library Commons Turnstile Counter",
    sensor_type: "occupancy",
    building_id: "bld-03",
    room_id: "rm-301",
    unit: "people",
    sampling_rate_sec: 60,
    is_active: true,
    is_simulated: true,
  },
  {
    id: "sns-wat-hostela",
    device_eui: "EUI-WAT-HSTA-001",
    name: "Himalaya Residence A Bulk Water Main",
    sensor_type: "water_meter",
    building_id: "bld-07",
    unit: "L/min",
    sampling_rate_sec: 30,
    is_active: true,
    is_simulated: true,
  },
  {
    id: "sns-vib-ast01",
    device_eui: "EUI-VIB-CHILL-001",
    name: "Precision Chiller Compressor Vibration",
    sensor_type: "vibration",
    building_id: "bld-01",
    asset_id: "ast-01",
    unit: "mm/s",
    sampling_rate_sec: 5,
    is_active: true,
    is_simulated: true,
  },
  {
    id: "sns-aqi-sci01",
    device_eui: "EUI-AQI-SCI-001",
    name: "Chemistry Lab 201 Air Quality Index",
    sensor_type: "air_quality",
    building_id: "bld-05",
    room_id: "rm-501",
    unit: "AQI",
    sampling_rate_sec: 30,
    is_active: true,
    is_simulated: true,
  },
];

// In-memory simulation state
let simulationRunning = true;
let simulationIntervalSec = 30;
let lastSimulationTimestamp = new Date().toISOString();

export interface TelemetrySummary {
  totalSensors: number;
  activeSensors: number;
  totalReadings: number;
  anomaliesDetected: number;
  latestReadings: SensorReading[];
  isSimulationActive: boolean;
  simulationIntervalSec: number;
  sourceLabel: string;
}

export interface AnomalyThresholdRule {
  sensor_type: SensorType;
  min_normal: number;
  max_normal: number;
  critical_high: number;
  unit: string;
}

export const ANOMALY_THRESHOLDS: Record<SensorType, AnomalyThresholdRule> = {
  temperature: { sensor_type: "temperature", min_normal: 18, max_normal: 27, critical_high: 34, unit: "°C" },
  humidity: { sensor_type: "humidity", min_normal: 35, max_normal: 65, critical_high: 80, unit: "%" },
  occupancy: { sensor_type: "occupancy", min_normal: 0, max_normal: 120, critical_high: 140, unit: "people" },
  electricity_meter: { sensor_type: "electricity_meter", min_normal: 50, max_normal: 350, critical_high: 480, unit: "kW" },
  water_meter: { sensor_type: "water_meter", min_normal: 10, max_normal: 120, critical_high: 220, unit: "L/min" },
  vibration: { sensor_type: "vibration", min_normal: 0.2, max_normal: 2.8, critical_high: 4.5, unit: "mm/s" },
  air_quality: { sensor_type: "air_quality", min_normal: 10, max_normal: 75, critical_high: 150, unit: "AQI" },
};

/**
 * Validates whether a given metric reading crosses normal operational thresholds.
 */
export function checkTelemetryAnomaly(type: SensorType, value: number): boolean {
  const rule = ANOMALY_THRESHOLDS[type];
  if (!rule) return false;
  return value < rule.min_normal || value > rule.max_normal;
}

/**
 * Generates deterministic or pseudo-random time series telemetry for a sensor.
 */
export function generateSensorReading(sensor: SensorDevice, forceAnomaly = false): SensorReading {
  const rule = ANOMALY_THRESHOLDS[sensor.sensor_type] || {
    min_normal: 0,
    max_normal: 100,
    critical_high: 120,
    unit: sensor.unit,
  };

  let value: number;
  if (forceAnomaly) {
    value = Number((rule.max_normal + (rule.critical_high - rule.max_normal) * 0.8).toFixed(2));
  } else {
    // Normal gaussian variation around center
    const range = rule.max_normal - rule.min_normal;
    const base = rule.min_normal + range * 0.45;
    const jitter = (Math.random() - 0.5) * (range * 0.35);
    value = Number(Math.max(rule.min_normal * 0.9, base + jitter).toFixed(2));
  }

  const is_anomaly = checkTelemetryAnomaly(sensor.sensor_type, value);

  return {
    id: `rdg-${sensor.id}-${Date.now()}`,
    sensor_id: sensor.id,
    timestamp: new Date().toISOString(),
    metric_type: sensor.sensor_type,
    value,
    unit: sensor.unit,
    is_anomaly,
    is_simulated: true,
  };
}

/**
 * Retrieves the full simulated IoT state and recent telemetry across campus.
 */
export async function getIoTSimulationState(): Promise<TelemetrySummary> {
  const latestReadings: SensorReading[] = CONFIGURED_SENSORS.map((s, idx) => {
    // Inject realistic anomaly on Feeder 1 and CS Room
    const hasAnomaly = idx === 0 || idx === 2;
    return generateSensorReading(s, hasAnomaly && Math.random() > 0.4);
  });

  const anomalies = latestReadings.filter((r) => r.is_anomaly).length;

  return {
    totalSensors: CONFIGURED_SENSORS.length,
    activeSensors: CONFIGURED_SENSORS.filter((s) => s.is_active).length,
    totalReadings: 1420 + Math.floor(Math.random() * 50),
    anomaliesDetected: anomalies,
    latestReadings,
    isSimulationActive: simulationRunning,
    simulationIntervalSec,
    sourceLabel: "SIMULATED TELEMETRY (Provider-Independent Ingestion Engine)",
  };
}

/**
 * Toggles simulator active state.
 */
export function setSimulationActiveState(active: boolean, interval = 30): boolean {
  simulationRunning = active;
  simulationIntervalSec = interval;
  lastSimulationTimestamp = new Date().toISOString();
  return simulationRunning;
}

/**
 * Provides time-series history for charts (e.g. past 24 hours).
 */
export function getSensorTimeSeriesHistory(sensorType: SensorType, points = 12): Array<{ time: string; value: number; baseline: number }> {
  const rule = ANOMALY_THRESHOLDS[sensorType] || { min_normal: 20, max_normal: 50 };
  const baseline = (rule.min_normal + rule.max_normal) / 2;
  const history: Array<{ time: string; value: number; baseline: number }> = [];

  const now = Date.now();
  for (let i = points - 1; i >= 0; i--) {
    const timeLabel = new Date(now - i * 2 * 3600 * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const variation = Math.sin((points - i) * 0.8) * ((rule.max_normal - rule.min_normal) * 0.25);
    const value = Number((baseline + variation).toFixed(1));
    history.push({ time: timeLabel, value, baseline });
  }

  return history;
}
