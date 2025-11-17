import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { APIService } from "../../../services/APIService";
import { createMockFormData } from "../../mockData";
import type { ApplicationFormData } from "../../../types/form.types";

// Mock modules
vi.mock("../../../utils/sanitize", () => ({
  sanitizeFormData: vi.fn((data) => {
    // Return a copy to preserve the data structure
    return { ...data };
  }),
}));

vi.mock("../../../utils/performance", () => ({
  PerformanceMonitor: {
    measureAsync: vi.fn(async (_name, fn) => await fn()),
  },
}));

describe("APIService", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sanitizeFormData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let PerformanceMonitor: any;

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
      const formData = createMockFormData();

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();
      const response = await submitPromise;

      expect(response.success).toBe(true);
      expect(response.data?.applicationId).toBeDefined();
    });
  });

  // ============================================================================
  // Validation Tests
  // ============================================================================
  describe("submitApplication - Validation", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let consoleErrorSpy: any;

    beforeEach(() => {
      // Reset the mock to return data as-is for validation tests
      sanitizeFormData.mockImplementation((data) => ({ ...data }));

      // Suppress console.error for validation tests (expected errors)
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it("should reject submission with missing name", async () => {
      const formData = createMockFormData();
      formData.name = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Name is required");
    });

    it("should reject submission with missing nationalId", async () => {
      const formData = createMockFormData();
      formData.nationalId = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("National ID is required");
    });

    it("should reject submission with missing dateOfBirth", async () => {
      const formData = createMockFormData();
      formData.dateOfBirth = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Date of Birth is required");
    });

    it("should reject submission with missing gender", async () => {
      const formData = createMockFormData();
      formData.gender = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Gender is required");
    });

    it("should reject submission with missing address", async () => {
      const formData = createMockFormData();
      formData.address = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Address is required");
    });

    it("should reject submission with missing city", async () => {
      const formData = createMockFormData();
      formData.city = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("City is required");
    });

    it("should reject submission with missing state", async () => {
      const formData = createMockFormData();
      formData.state = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("State is required");
    });

    it("should reject submission with missing country", async () => {
      const formData = createMockFormData();
      formData.country = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Country is required");
    });

    it("should reject submission with missing phone", async () => {
      const formData = createMockFormData();
      formData.phone = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Phone is required");
    });

    it("should reject submission with missing email", async () => {
      const formData = createMockFormData();
      formData.email = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Email is required");
    });

    it("should reject submission with missing maritalStatus", async () => {
      const formData = createMockFormData();
      formData.maritalStatus = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Marital Status is required");
    });

    it("should reject submission with undefined dependents", async () => {
      const formData = createMockFormData();
      formData.dependents = "" as unknown;

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Dependents is required");
    });

    it("should reject submission with negative dependents", async () => {
      const formData = createMockFormData();
      formData.dependents = -1;

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Dependents is required");
    });

    it("should reject submission with missing employmentStatus", async () => {
      const formData = createMockFormData();
      formData.employmentStatus = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow(
        "Employment Status is required"
      );
    });

    it("should reject submission with undefined monthlyIncome", async () => {
      const formData = createMockFormData();
      formData.monthlyIncome = "" as unknown;

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Monthly Income is required");
    });

    it("should reject submission with negative monthlyIncome", async () => {
      const formData = createMockFormData();
      formData.monthlyIncome = -100;

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Monthly Income is required");
    });

    it("should reject submission with missing housingStatus", async () => {
      const formData = createMockFormData();
      formData.housingStatus = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Housing Status is required");
    });

    it("should reject submission with short financialSituation", async () => {
      const formData = createMockFormData();
      formData.financialSituation = "Too short";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow(
        "Financial Situation must be at least"
      );
    });

    it("should reject submission with empty financialSituation", async () => {
      const formData = createMockFormData();
      formData.financialSituation = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow(
        "Financial Situation must be at least"
      );
    });

    it("should reject submission with short employmentCircumstances", async () => {
      const formData = createMockFormData();
      formData.employmentCircumstances = "Too short";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow(
        "Employment Circumstances must be at least"
      );
    });

    it("should reject submission with empty employmentCircumstances", async () => {
      const formData = createMockFormData();
      formData.employmentCircumstances = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow(
        "Employment Circumstances must be at least"
      );
    });

    it("should reject submission with short reasonForApplying", async () => {
      const formData = createMockFormData();
      formData.reasonForApplying = "Too short";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow(
        "Reason for Applying must be at least"
      );
    });

    it("should reject submission with empty reasonForApplying", async () => {
      const formData = createMockFormData();
      formData.reasonForApplying = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow(
        "Reason for Applying must be at least"
      );
    });

    it("should accept submission with zero dependents", async () => {
      const formData = createMockFormData();
      formData.dependents = 0;

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();
      const response = await submitPromise;

      expect(response.success).toBe(true);
    });

    it("should accept submission with zero monthlyIncome", async () => {
      const formData = createMockFormData();
      formData.monthlyIncome = 0;

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();
      const response = await submitPromise;

      expect(response.success).toBe(true);
    });

    it("should reject submission with multiple validation errors", async () => {
      const formData = createMockFormData();
      formData.name = "";
      formData.email = "";
      formData.financialSituation = "";

      const submitPromise = APIService.submitApplication(formData);
      await vi.runAllTimersAsync();

      await expect(submitPromise).rejects.toThrow("Validation failed");
    });
  });
});
