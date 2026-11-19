export interface ParsedCampusQR {
  valid: boolean;
  building: string;
  floor: string;
  roomNumber: string;
  departmentId?: string;
  raw: string;
  suggestedTitle?: string;
}

const QR_PREFIX = "CAMPUS:LOC:";

/**
 * Encodes campus location details into an interoperable QR string
 * e.g. "CAMPUS:LOC:Science Complex:Floor 3:Lab 304:dept-facilities"
 */
export function generateLocationQRCode(
  building: string,
  floor: string = "1",
  roomNumber: string = "Main",
  departmentId?: string
): string {
  const parts = [
    encodeURIComponent(building.trim()),
    encodeURIComponent(floor.trim()),
    encodeURIComponent(roomNumber.trim()),
  ];
  if (departmentId) {
    parts.push(encodeURIComponent(departmentId.trim()));
  }
  return `${QR_PREFIX}${parts.join(":")}`;
}

/**
 * Parses and validates a scanned QR code string into location components
 */
export function parseLocationQRCode(rawPayload: string): ParsedCampusQR {
  if (!rawPayload || !rawPayload.startsWith(QR_PREFIX)) {
    return {
      valid: false,
      building: "",
      floor: "",
      roomNumber: "",
      raw: rawPayload || "",
    };
  }

  const payload = rawPayload.slice(QR_PREFIX.length);
  const segments = payload.split(":");

  if (segments.length < 3) {
    return {
      valid: false,
      building: "",
      floor: "",
      roomNumber: "",
      raw: rawPayload,
    };
  }

  const building = decodeURIComponent(segments[0] || "");
  const floor = decodeURIComponent(segments[1] || "");
  const roomNumber = decodeURIComponent(segments[2] || "");
  const departmentId = segments[3] ? decodeURIComponent(segments[3]) : undefined;

  return {
    valid: true,
    building,
    floor,
    roomNumber,
    departmentId,
    raw: rawPayload,
    suggestedTitle: `Issue at ${building} - ${roomNumber}`,
  };
}

/**
 * Quick validation check for scanned campus QR tokens
 */
export function validateCampusQRToken(token: string): boolean {
  return parseLocationQRCode(token).valid;
}
