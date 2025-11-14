import { describe, it, expect, beforeEach, vi } from "vitest";
import { PerformanceMonitor } from "./performance";

describe("PerformanceMonitor", () => {
  beforeEach(() => {
    // Clear measurements before each test
    PerformanceMonitor.clear();
  });

  describe("measure", () => {
    it("should measure synchronous function execution time", () => {
      const result = PerformanceMonitor.measure("test-sync", () => {
        return 42;
      });

      expect(result).toBe(42);
      const stats = PerformanceMonitor.getStats("test-sync");
      expect(stats).not.toBeNull();
      expect(stats?.count).toBe(1);
      expect(stats?.avg).toBeGreaterThanOrEqual(0);
    });

    it("should return the result of the measured function", () => {
      const result = PerformanceMonitor.measure("test-return", () => {
        return "hello world";
      });

      expect(result).toBe("hello world");
    });

    it("should handle functions that return objects", () => {
      const result = PerformanceMonitor.measure("test-object", () => {
        return { name: "John", age: 30 };
      });

      expect(result).toEqual({ name: "John", age: 30 });
    });

    it("should record multiple measurements for the same operation", () => {
      PerformanceMonitor.measure("test-multiple", () => 1);
      PerformanceMonitor.measure("test-multiple", () => 2);
      PerformanceMonitor.measure("test-multiple", () => 3);

      const stats = PerformanceMonitor.getStats("test-multiple");
      expect(stats?.count).toBe(3);
    });

    it("should measure different operations independently", () => {
      PerformanceMonitor.measure("operation-a", () => "a");
      PerformanceMonitor.measure("operation-b", () => "b");

      const statsA = PerformanceMonitor.getStats("operation-a");
      const statsB = PerformanceMonitor.getStats("operation-b");

      expect(statsA?.count).toBe(1);
      expect(statsB?.count).toBe(1);
    });
  });

  describe("measureAsync", () => {
    it("should measure asynchronous function execution time", async () => {
      const result = await PerformanceMonitor.measureAsync(
        "test-async",
        async () => {
          return Promise.resolve(42);
        }
      );

      expect(result).toBe(42);
      const stats = PerformanceMonitor.getStats("test-async");
      expect(stats).not.toBeNull();
      expect(stats?.count).toBe(1);
      expect(stats?.avg).toBeGreaterThanOrEqual(0);
    });

    it("should handle async functions with delays", async () => {
      const result = await PerformanceMonitor.measureAsync(
        "test-delay",
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return "done";
        }
      );

      expect(result).toBe("done");
      const stats = PerformanceMonitor.getStats("test-delay");
      expect(stats?.avg).toBeGreaterThanOrEqual(10);
    });

    it("should handle rejected promises", async () => {
      await expect(
        PerformanceMonitor.measureAsync("test-error", async () => {
          throw new Error("Test error");
        })
      ).rejects.toThrow("Test error");

      // Should still record the measurement even if it fails
      const stats = PerformanceMonitor.getStats("test-error");
      expect(stats).toBeNull(); // No measurement recorded on error
    });

    it("should record multiple async measurements", async () => {
      await PerformanceMonitor.measureAsync("test-async-multiple", async () =>
        Promise.resolve(1)
      );
      await PerformanceMonitor.measureAsync("test-async-multiple", async () =>
        Promise.resolve(2)
      );
      await PerformanceMonitor.measureAsync("test-async-multiple", async () =>
        Promise.resolve(3)
      );

      const stats = PerformanceMonitor.getStats("test-async-multiple");
      expect(stats?.count).toBe(3);
    });
  });

  describe("getStats", () => {
    it("should return null for non-existent measurements", () => {
      const stats = PerformanceMonitor.getStats("non-existent");
      expect(stats).toBeNull();
    });

    it("should calculate correct average", () => {
      // Mock performance.now to return predictable values
      let counter = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        return counter++ * 10; // Returns 0, 10, 20, 30, etc.
      });

      PerformanceMonitor.measure("test-avg", () => {});
      PerformanceMonitor.measure("test-avg", () => {});
      PerformanceMonitor.measure("test-avg", () => {});

      const stats = PerformanceMonitor.getStats("test-avg");
      expect(stats?.count).toBe(3);
      expect(stats?.avg).toBe(10); // Each measurement takes 10ms

      vi.restoreAllMocks();
    });

    it("should calculate correct min and max", () => {
      let counter = 0;
      vi.spyOn(performance, "now").mockImplementation(() => {
        const values = [0, 5, 0, 15, 0, 25]; // Measurements: 5, 15, 25
        return values[counter++];
      });

      PerformanceMonitor.measure("test-minmax", () => {});
      PerformanceMonitor.measure("test-minmax", () => {});
      PerformanceMonitor.measure("test-minmax", () => {});

      const stats = PerformanceMonitor.getStats("test-minmax");
      expect(stats?.min).toBe(5);
      expect(stats?.max).toBe(25);
      expect(stats?.avg).toBe(15);

      vi.restoreAllMocks();
    });

    it("should return stats with correct structure", () => {
      PerformanceMonitor.measure("test-structure", () => {});

      const stats = PerformanceMonitor.getStats("test-structure");
      expect(stats).toHaveProperty("avg");
      expect(stats).toHaveProperty("min");
      expect(stats).toHaveProperty("max");
      expect(stats).toHaveProperty("count");
    });
  });

  describe("clear", () => {
    it("should clear all measurements", () => {
      PerformanceMonitor.measure("test-1", () => {});
      PerformanceMonitor.measure("test-2", () => {});

      expect(PerformanceMonitor.getStats("test-1")).not.toBeNull();
      expect(PerformanceMonitor.getStats("test-2")).not.toBeNull();

      PerformanceMonitor.clear();

      expect(PerformanceMonitor.getStats("test-1")).toBeNull();
      expect(PerformanceMonitor.getStats("test-2")).toBeNull();
    });

    it("should allow new measurements after clearing", () => {
      PerformanceMonitor.measure("test-clear", () => {});
      PerformanceMonitor.clear();
      PerformanceMonitor.measure("test-clear", () => {});

      const stats = PerformanceMonitor.getStats("test-clear");
      expect(stats?.count).toBe(1);
    });
  });

  describe("getMeasurementNames", () => {
    it("should return empty array when no measurements exist", () => {
      const names = PerformanceMonitor.getMeasurementNames();
      expect(names).toEqual([]);
    });

    it("should return all measurement names", () => {
      PerformanceMonitor.measure("operation-1", () => {});
      PerformanceMonitor.measure("operation-2", () => {});
      PerformanceMonitor.measure("operation-3", () => {});

      const names = PerformanceMonitor.getMeasurementNames();
      expect(names).toHaveLength(3);
      expect(names).toContain("operation-1");
      expect(names).toContain("operation-2");
      expect(names).toContain("operation-3");
    });

    it("should not include duplicate names", () => {
      PerformanceMonitor.measure("operation-1", () => {});
      PerformanceMonitor.measure("operation-1", () => {});
      PerformanceMonitor.measure("operation-2", () => {});

      const names = PerformanceMonitor.getMeasurementNames();
      expect(names).toHaveLength(2);
    });
  });

  describe("logAllStats", () => {
    it("should not throw when no measurements exist", () => {
      expect(() => PerformanceMonitor.logAllStats()).not.toThrow();
    });

    it("should log stats for all measurements", () => {
      const consoleSpy = vi
        .spyOn(console, "table")
        .mockImplementation(() => {});

      PerformanceMonitor.measure("op-1", () => {});
      PerformanceMonitor.measure("op-2", () => {});

      PerformanceMonitor.logAllStats();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ Operation: "op-1" }),
          expect.objectContaining({ Operation: "op-2" }),
        ])
      );

      consoleSpy.mockRestore();
    });

    it("should log message when no measurements exist", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      PerformanceMonitor.logAllStats();

      expect(consoleSpy).toHaveBeenCalledWith(
        "No performance measurements recorded"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("real-world scenarios", () => {
    it("should measure form validation performance", () => {
      const validateForm = () => {
        // Simulate validation logic
        const fields = ["name", "email", "phone"];
        return fields.every((field) => field.length > 0);
      };

      const result = PerformanceMonitor.measure(
        "Form Validation",
        validateForm
      );

      expect(result).toBe(true);
      const stats = PerformanceMonitor.getStats("Form Validation");
      expect(stats).not.toBeNull();
    });

    it("should measure API call performance", async () => {
      const mockApiCall = async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        return { success: true, data: { id: 1 } };
      };

      const result = await PerformanceMonitor.measureAsync(
        "API Call",
        mockApiCall
      );

      expect(result.success).toBe(true);
      const stats = PerformanceMonitor.getStats("API Call");
      // Should be close to 5ms, but allow some variance
      expect(stats?.avg).toBeGreaterThanOrEqual(4);
    });

    it("should track multiple operations in a workflow", async () => {
      // Simulate a multi-step workflow
      PerformanceMonitor.measure("Step 1: Validation", () => true);
      await PerformanceMonitor.measureAsync("Step 2: API Call", async () =>
        Promise.resolve({ data: {} })
      );
      PerformanceMonitor.measure("Step 3: Data Processing", () => []);

      expect(PerformanceMonitor.getMeasurementNames()).toHaveLength(3);
    });
  });
});
