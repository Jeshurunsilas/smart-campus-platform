import { describe, it, expect } from "vitest";
import {
  generateSensorReading,
  checkTelemetryAnomaly,
  getIoTSimulationState,
  setSimulationActiveState,
  CONFIGURED_SENSORS,
} from "@/lib/services/iot-simulator";
import {
  calculateAssetRiskScore,
  convertPredictionToServiceRequest,
} from "@/lib/services/predictive-maintenance";
import {
  DEMO_CAMPUS_BUILDINGS,
  DEMO_CAMPUS_ASSETS,
  DEMO_PREDICTIVE_MAINTENANCE,
} from "@/lib/services/campus-operations";
import { SensorDevice, CampusAsset } from "@/types";

describe("Smart Campus Operations & Spatial Intelligence Engine", () => {
  describe("IoT Telemetry & Anomaly Detection", () => {
    it("generates realistic sensor readings within nominal device parameters", () => {
      const mockSensor: SensorDevice = {
        id: "test-temp-01",
        device_eui: "DEV-EUI-TEMP-01",
        name: "Test Room Temp",
        sensor_type: "temperature",
        building_id: "bldg-ab1",
        unit: "°C",
        sampling_rate_sec: 10,
        is_active: true,
        is_simulated: true,
      };

      const reading = generateSensorReading(mockSensor);
      expect(reading.sensor_id).toBe("test-temp-01");
      expect(reading.metric_type).toBe("temperature");
      expect(reading.unit).toBe("°C");
      expect(reading.value).toBeGreaterThan(10);
      expect(reading.value).toBeLessThan(50);
      expect(typeof reading.is_anomaly).toBe("boolean");
      expect(reading.is_simulated).toBe(true);
    });

    it("flags threshold anomalies for extreme readings", () => {
      // Normal temp reading (threshold: normal is 18 - 26 C)
      const normalTemp = checkTelemetryAnomaly("temperature", 22.5);
      expect(normalTemp).toBe(false);

      // Extreme high temp anomaly (> 32 C is critical)
      const highTemp = checkTelemetryAnomaly("temperature", 38.5);
      expect(highTemp).toBe(true);

      // Extreme vibration anomaly (normal is 0 - 2.5 mm/s, critical > 4.5 mm/s)
      const highVibration = checkTelemetryAnomaly("vibration", 8.2);
      expect(highVibration).toBe(true);

      // Normal vibration
      const normalVibration = checkTelemetryAnomaly("vibration", 1.5);
      expect(normalVibration).toBe(false);
    });

    it("controls IoT telemetry simulator state gracefully", async () => {
      setSimulationActiveState(true, 15);
      const state = await getIoTSimulationState();
      expect(state.isSimulationActive).toBe(true);
      expect(state.totalSensors).toBeGreaterThan(0);
      expect(state.latestReadings.length).toBeGreaterThan(0);

      setSimulationActiveState(false);
      const stoppedState = await getIoTSimulationState();
      expect(stoppedState.isSimulationActive).toBe(false);
    });
  });

  describe("Explainable Predictive Maintenance", () => {
    it("transparently computes multi-factor risk scores based on hardware signals", () => {
      const riskProfile = calculateAssetRiskScore({
        operatingHours: 12000,
        expectedLifespanHours: 10000,
        averageTemperatureC: 78,
        baselineTemperatureC: 60,
        peakVibrationMmS: 5.2,
        recentRepairsCount: 3,
      });

      expect(riskProfile.riskScore).toBeGreaterThanOrEqual(0);
      expect(riskProfile.riskScore).toBeLessThanOrEqual(100);
      expect(riskProfile.riskLevel).toBeDefined();
      expect(["low", "medium", "high", "critical"]).toContain(riskProfile.riskLevel);

      // Must include transparent contributing factors with weightages
      expect(riskProfile.contributingFactors.length).toBe(4);
      expect(
        riskProfile.contributingFactors.some((f) => f.factor.includes("Thermal Exhaust"))
      ).toBe(true);
      expect(
        riskProfile.contributingFactors.some((f) => f.factor.includes("Vibration"))
      ).toBe(true);
      expect(riskProfile.recommendedAction).toBeDefined();
      expect(riskProfile.recommendedInspectionDate).toBeDefined();
    });

    it("converts active high-risk prediction into a verified Service Request ticket", async () => {
      const targetPrediction = DEMO_PREDICTIVE_MAINTENANCE[0];
      const targetAsset = DEMO_CAMPUS_ASSETS[0];

      const result = await convertPredictionToServiceRequest(
        targetPrediction.id,
        targetAsset
      );
      expect(result.success).toBe(true);
      expect(result.requestNumber).toMatch(/^REQ-/);
      expect(result.message).toContain("Preventive maintenance ticket");
    });
  });

  describe("Spatial Intelligence & Building Coordinates", () => {
    it("maintains synchronized building entity keys across spatial layers", () => {
      expect(DEMO_CAMPUS_BUILDINGS.length).toBeGreaterThanOrEqual(5);

      DEMO_CAMPUS_BUILDINGS.forEach((bldg) => {
        expect(bldg.id).toBeDefined();
        expect(bldg.name).toBeDefined();
        expect(bldg.code).toBeDefined();
        expect(bldg.coordinates_x).toBeTypeOf("number");
        expect(bldg.coordinates_y).toBeTypeOf("number");
        expect(bldg.floors_count).toBeGreaterThan(0);
        expect(bldg.baseline_energy_kwh).toBeGreaterThan(0);
      });
    });
  });
});
