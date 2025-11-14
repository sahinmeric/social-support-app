import { describe, it, expect } from "vitest";

describe("Test Setup", () => {
  it("should have vitest configured correctly", () => {
    expect(true).toBe(true);
  });

  it("should have localStorage mocked", () => {
    localStorage.setItem("test", "value");
    expect(localStorage.getItem("test")).toBe("value");
    localStorage.clear();
    expect(localStorage.getItem("test")).toBeNull();
  });

  it("should have matchMedia mocked", () => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    expect(mediaQuery).toBeDefined();
    expect(mediaQuery.matches).toBe(false);
  });
});
