import { describe, it, expect } from "vitest";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";

describe("Utility Functions", () => {
  it("merges class names correctly with cn()", () => {
    const result = cn("text-red-500", "p-4", undefined, { "bg-blue-500": true, "hidden": false });
    expect(result).toContain("text-red-500");
    expect(result).toContain("p-4");
    expect(result).toContain("bg-blue-500");
    expect(result).not.toContain("hidden");
  });

  it("handles null or invalid dates gracefully in formatDate()", () => {
    expect(formatDate(null)).toBe("N/A");
    expect(formatDate(undefined)).toBe("N/A");
    expect(formatDate("invalid-date-string")).toBe("Invalid date");
  });

  it("formats relative time correctly", () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe("just now");
    
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    expect(formatRelativeTime(tenMinutesAgo)).toBe("10m ago");

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoHoursAgo)).toBe("2h ago");
  });
});
