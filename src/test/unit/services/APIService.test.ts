import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { APIService } from "../../../services/APIService";
import { createMockFormData } from "../../mockData";
import type { ApplicationFormData } from "../../../types/form.types";

// Mock modules
vi.mock("../../../utils/sanitize", () => ({
  sanitizeFormData: vi.fn((data) => data),
}));

vi.mock("../../../utils/performance", () => ({
  PerformanceMonitor: {
    measureAsync: vi.fn(async (_name, fn) => await fn()),
  },
}));

describe("APIService", () => {
  let sanitizeFormData: unknown;
  let PerformanceMonitor: unknown;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Import mocked modules
    const sanitizeModule = await import("../../../utils/sanitize");
    const performanceModule = await import("../../../utils/performance");

    sanitizeFormData = sanitizeModule.sanitizeFormData;
    PerformanceMonitor = performanceModule.PerformanceMonitor;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ============================================================================
  // Task 8.1: Successful Submission Tests
  // ============================================================================
  describe("submitApplication - Success", () => {
    it("should submit application with valid form data", async () => {
      const formData = createMockFormData();

      const submitPromise = APIService.submitApplication(formData);

      // Fast-forward through the mock delay
      await vi.runAllTimersAsync();

      const response = await submitPromise;

      expect(response.success).toBe(true);
      expect(response.message).toBe("Application submitted successfully");
      expect(response.data).toBeDefined();
      expect(response.data?.applicationId).toMatch(/^APP-/);
      expect(response.data?.timestamp).toBeDefined();
    });

    it("should sanitize form data before submission", async () => {
      const formData = createMockFormData();
      const sanitizedData = { ...formData, name: "Sanitized Name" };

      sanitizeFormData.mockReturnValue(sanitizedData);

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();
      await submitPromise;

      expect(sanitizeFormData).toHaveBeenCalledWith(formData);
    });

    it("should simulate API delay using setTimeout", async () => {
      const formData = createMockFormData();

      const submitPromise = APIService.submitApplication(formData);

      // Check that promise is not resolved immediately
      let resolved = false;
      submitPromise.then(() => {
        resolved = true;
      });

      // Should not be resolved yet
      await Promise.resolve();
      expect(resolved).toBe(false);

      // Fast-forward timers
      await vi.runAllTimersAsync();
      await submitPromise;

      expect(resolved).toBe(true);
    });

    it("should return response with applicationId and timestamp", async () => {
      const formData = createMockFormData();

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();
      const response = await submitPromise;

      expect(response.data).toBeDefined();
      expect(response.data?.applicationId).toBeDefined();
      expect(typeof response.data?.applicationId).toBe("string");
      expect(response.data?.applicationId).toMatch(/^APP-\d+-[a-z0-9]+$/);

      expect(response.data?.timestamp).toBeDefined();
      expect(typeof response.data?.timestamp).toBe("string");
      // Verify it's a valid ISO date string
      expect(() => new Date(response.data!.timestamp)).not.toThrow();
    });

    it("should call PerformanceMonitor.measureAsync", async () => {
      const formData = createMockFormData();

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();
      await submitPromise;

      expect(PerformanceMonitor.measureAsync).toHaveBeenCalledWith(
        "Form Submission",
        expect.any(Function)
      );
    });

    it("should generate unique applicationId for each submission", async () => {
      const formData = createMockFormData();

      const submitPromise1 = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();
      const response1 = await submitPromise1;

      // Advance time to ensure different timestamp
      vi.advanceTimersByTime(10);

      const submitPromise2 = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();
      const response2 = await submitPromise2;

      expect(response1.data?.applicationId).not.toBe(
        response2.data?.applicationId
      );
    });

    it("should handle form data with all required fields", async () => {
      const formData: ApplicationFormData = {
        // Step 1
        name: "Jane Smith",
        nationalId: "9876543210",
        dateOfBirth: "1985-05-15",
        gender: "female",
        address: "456 Oak Avenue",
        city: "Abu Dhabi",
        state: "Abu Dhabi",
        country: "UAE",
        phone: "+971509876543",
        email: "jane.smith@example.com",

        // Step 2
        maritalStatus: "single",
        dependents: 0,
        employmentStatus: "unemployed",
        monthlyIncome: 0,
        currency: "AED",
        housingStatus: "homeless",
        hasOtherIncome: false,

        // Step 3
        financialSituation:
          "I am currently unemployed and facing severe financial hardship with no stable income source.",
        employmentCircumstances:
          "I lost my job six months ago and have been unable to find new employment despite active searching.",
        reasonForApplying:
          "I need immediate assistance to cover basic living expenses and housing costs while I continue my job search.",
      };

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();
      const response = await submitPromise;

      expect(response.success).toBe(true);
      expect(response.data?.applicationId).toBeDefined();
    });

    it("should handle form data with optional fields", async () => {
      const formData = createMockFormData({
        hasOtherIncome: true,
        otherIncomeSource: "Freelance work",
        otherIncomeAmount: 1000,
      });

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();
      const response = await submitPromise;

      expect(response.success).toBe(true);
      expect(response.data?.applicationId).toBeDefined();
    });
  });
});
