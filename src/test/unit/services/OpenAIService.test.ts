import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AIErrorType } from "../../../types/openai.types";
import type { ApplicationFormData } from "../../../types/form.types";
import { createMockFormData } from "../../mockData";

// Mock modules before importing OpenAIService
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));
vi.mock("../../../utils/sanitize", () => ({
  sanitizeInput: vi.fn((input) => input),
}));
vi.mock("../../../utils/performance", () => ({
  PerformanceMonitor: {
    measureAsync: vi.fn(async (_name, fn) => await fn()),
  },
}));

describe("OpenAIService", () => {
  let OpenAIService: typeof import("../../../services/OpenAIService").OpenAIService;
  let service: InstanceType<typeof OpenAIService>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sanitizeInput: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let PerformanceMonitor: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockedAxios: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    // Set default env vars
    vi.stubEnv("VITE_USE_MOCK_AI", "false");
    vi.stubEnv("VITE_OPENAI_API_KEY", "");

    // Import modules after env is set
    const axiosModule = await import("axios");
    mockedAxios = axiosModule.default;

    const sanitizeModule = await import("../../../utils/sanitize");
    const performanceModule = await import("../../../utils/performance");
    sanitizeInput = sanitizeModule.sanitizeInput;
    PerformanceMonitor = performanceModule.PerformanceMonitor;

    const serviceModule = await import("../../../services/OpenAIService");
    OpenAIService = serviceModule.OpenAIService;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // ============================================================================
  // Task 1.1: Constructor Tests
  // ============================================================================
  describe("constructor", () => {
    it("should initialize with default API base URL", () => {
      service = new OpenAIService();
      expect(service["apiBaseUrl"]).toBe("/api");
    });

    it("should use environment variable for API base URL when provided", async () => {
      const customBaseUrl = "http://localhost:3000/api";
      vi.stubEnv("VITE_API_BASE_URL", customBaseUrl);

      // Need to reload the module to pick up the new env variable
      vi.resetModules();
      const serviceModule = await import("../../../services/OpenAIService");
      OpenAIService = serviceModule.OpenAIService;

      service = new OpenAIService();
      expect(service["apiBaseUrl"]).toBe(customBaseUrl);
    });

    it("should initialize cache as empty Map", () => {
      service = new OpenAIService();
      expect(service["cache"]).toBeInstanceOf(Map);
      expect(service["cache"].size).toBe(0);
    });

    it("should initialize abortController as null", () => {
      service = new OpenAIService();
      expect(service["abortController"]).toBeNull();
    });
  });

  // ============================================================================
  // Task 1.2: Mock Suggestion Generation Tests
  // ============================================================================
  describe("generateMockSuggestion", () => {
    beforeEach(() => {
      service = new OpenAIService();
    });

    it("should generate suggestion for financialSituation field", () => {
      const formData = createMockFormData({
        monthlyIncome: 3000,
        dependents: 2,
        housingStatus: "rented",
      });

      const result = service["generateMockSuggestion"](
        "financialSituation",
        formData
      );

      expect(result.fieldName).toBe("financialSituation");
      expect(result.text).toContain("3000");
      expect(result.text).toContain("2");
      expect(result.text).toContain("rented");
      expect(result.text).toContain("financial challenges");
    });

    it("should generate suggestion for financialSituation with missing data", () => {
      const formData = createMockFormData({
        monthlyIncome: undefined,
        dependents: undefined,
        housingStatus: undefined,
      });

      const result = service["generateMockSuggestion"](
        "financialSituation",
        formData
      );

      expect(result.fieldName).toBe("financialSituation");
      expect(result.text).toContain("limited funds");
      expect(result.text).toContain("0");
      expect(result.text).toContain("unstable");
    });

    it("should generate suggestion for employmentCircumstances field", () => {
      const formData = createMockFormData({
        employmentStatus: "unemployed",
      });

      const result = service["generateMockSuggestion"](
        "employmentCircumstances",
        formData
      );

      expect(result.fieldName).toBe("employmentCircumstances");
      expect(result.text).toContain("unemployed");
      expect(result.text).toContain("employment status");
    });

    it("should generate suggestion for employmentCircumstances with missing data", () => {
      const formData = createMockFormData({
        employmentStatus: undefined,
      });

      const result = service["generateMockSuggestion"](
        "employmentCircumstances",
        formData
      );

      expect(result.fieldName).toBe("employmentCircumstances");
      expect(result.text).toContain("uncertain");
    });

    it("should generate suggestion for reasonForApplying field", () => {
      const formData = createMockFormData({
        dependents: 3,
      });

      const result = service["generateMockSuggestion"](
        "reasonForApplying",
        formData
      );

      expect(result.fieldName).toBe("reasonForApplying");
      expect(result.text).toContain("3");
      expect(result.text).toContain("social support");
    });

    it("should generate suggestion for reasonForApplying with missing dependents", () => {
      const formData = createMockFormData({
        dependents: undefined,
      });

      const result = service["generateMockSuggestion"](
        "reasonForApplying",
        formData
      );

      expect(result.fieldName).toBe("reasonForApplying");
      expect(result.text).toContain("my");
    });

    it("should generate default suggestion for unknown field", () => {
      const formData = createMockFormData();
      const unknownField = "unknownField" as keyof ApplicationFormData;

      const result = service["generateMockSuggestion"](unknownField, formData);

      expect(result.fieldName).toBe(unknownField);
      expect(result.text).toContain("Sample suggestion text for");
      expect(result.text).toContain(unknownField);
    });

    it("should sanitize generated content before returning", () => {
      const formData = createMockFormData();
      const mockSanitized = "sanitized content";
      sanitizeInput.mockReturnValue(mockSanitized);

      const result = service["generateMockSuggestion"](
        "financialSituation",
        formData
      );

      expect(sanitizeInput).toHaveBeenCalled();
      expect(result.text).toBe(mockSanitized);
    });
  });

  // ============================================================================
  // Task 1.3: Prompt Building Tests
  // ============================================================================
  describe("buildRequestPayload", () => {
    beforeEach(() => {
      service = new OpenAIService();
    });

    it("should build payload for financialSituation with complete form data", () => {
      const formData = createMockFormData({
        employmentStatus: "employed",
        monthlyIncome: 5000,
        housingStatus: "owned",
        dependents: 2,
      });

      const payload = service["buildRequestPayload"](
        "financialSituation",
        formData
      );

      expect(payload.fieldName).toBe("financialSituation");
      expect(payload.formData.employmentStatus).toBe("employed");
      expect(payload.formData.monthlyIncome).toBe(5000);
      expect(payload.formData.housingStatus).toBe("owned");
      expect(payload.formData.dependents).toBe(2);
    });

    it("should build payload for employmentCircumstances with relevant fields only", () => {
      const formData = createMockFormData({
        employmentStatus: "selfEmployed",
        monthlyIncome: 4000,
        housingStatus: "owned", // Should not be included
        dependents: 2, // Should not be included
      });

      const payload = service["buildRequestPayload"](
        "employmentCircumstances",
        formData
      );

      expect(payload.fieldName).toBe("employmentCircumstances");
      expect(payload.formData.employmentStatus).toBe("selfEmployed");
      expect(payload.formData.monthlyIncome).toBe(4000);
      expect(payload.formData.housingStatus).toBeUndefined();
      expect(payload.formData.dependents).toBeUndefined();
    });

    it("should build payload for reasonForApplying with complete form data", () => {
      const formData = createMockFormData({
        financialSituation: "Facing hardship",
        employmentStatus: "unemployed",
        housingStatus: "homeless",
        dependents: 3,
      });

      const payload = service["buildRequestPayload"](
        "reasonForApplying",
        formData
      );

      expect(payload.fieldName).toBe("reasonForApplying");
      expect(payload.formData.financialSituation).toBe("Facing hardship");
      expect(payload.formData.employmentStatus).toBe("unemployed");
      expect(payload.formData.housingStatus).toBe("homeless");
      expect(payload.formData.dependents).toBe(3);
    });

    it("should handle empty/undefined values in form data", () => {
      const formData = createMockFormData({
        employmentStatus: "",
        monthlyIncome: "",
        housingStatus: "",
        dependents: "",
      });

      const payload = service["buildRequestPayload"](
        "financialSituation",
        formData
      );

      expect(payload.fieldName).toBe("financialSituation");
      expect(payload.formData.employmentStatus).toBe("");
      expect(payload.formData.monthlyIncome).toBe("");
    });
  });

  // ============================================================================
  // Task 1.4: API Integration & Error Handling Tests
  // ============================================================================
  describe("generateSuggestion - Mock Mode", () => {
    beforeEach(async () => {
      vi.stubEnv("VITE_USE_MOCK_AI", "true");
      vi.resetModules();
      const serviceModule = await import("../../../services/OpenAIService");
      OpenAIService = serviceModule.OpenAIService;
      service = new OpenAIService();
    });

    it("should return mock suggestion when USE_MOCK is true", async () => {
      const formData = createMockFormData();

      const result = await service.generateSuggestion(
        "financialSituation",
        formData
      );

      expect(result.fieldName).toBe("financialSituation");
      expect(result.text).toBeTruthy();
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("should call PerformanceMonitor.measureAsync", async () => {
      const formData = createMockFormData();

      await service.generateSuggestion("financialSituation", formData);

      expect(PerformanceMonitor.measureAsync).toHaveBeenCalledWith(
        "AI Suggestion Generation - financialSituation",
        expect.any(Function)
      );
    });

    it("should simulate network delay in mock mode", async () => {
      const formData = createMockFormData();
      const startTime = Date.now();

      await service.generateSuggestion("financialSituation", formData);

      const endTime = Date.now();
      const elapsed = endTime - startTime;

      // Should take at least the mock delay time (1500ms)
      expect(elapsed).toBeGreaterThanOrEqual(1400); // Allow small margin
    });
  });

  describe("generateSuggestion - API Mode", () => {
    beforeEach(() => {
      service = new OpenAIService();
    });

    it("should call backend API with correct endpoint", async () => {
      const formData = createMockFormData();
      const mockResponse = {
        data: {
          text: "AI generated suggestion",
          fieldName: "financialSituation",
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await service.generateSuggestion("financialSituation", formData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/ai/suggestions",
        expect.objectContaining({
          fieldName: "financialSituation",
          formData: expect.any(Object),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          timeout: 30000,
        })
      );
    });

    it("should call backend API with correct payload structure", async () => {
      const formData = createMockFormData({
        employmentStatus: "employed",
        monthlyIncome: 5000,
        housingStatus: "owned",
        dependents: 2,
      });

      const mockResponse = {
        data: {
          text: "AI generated suggestion",
          fieldName: "financialSituation",
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await service.generateSuggestion("financialSituation", formData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/ai/suggestions",
        {
          fieldName: "financialSituation",
          formData: {
            employmentStatus: "employed",
            monthlyIncome: 5000,
            housingStatus: "owned",
            dependents: 2,
          },
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("should return sanitized suggestion from successful API call", async () => {
      const formData = createMockFormData();
      const mockSuggestion = "  AI generated suggestion  ";
      const mockSanitized = "sanitized suggestion";

      mockedAxios.post.mockResolvedValue({
        data: {
          text: mockSuggestion,
          fieldName: "financialSituation",
        },
      });

      sanitizeInput.mockReturnValue(mockSanitized);

      const result = await service.generateSuggestion(
        "financialSituation",
        formData
      );

      expect(result.text).toBe(mockSanitized);
      expect(sanitizeInput).toHaveBeenCalledWith(mockSuggestion);
    });

    it("should throw error when API returns empty suggestion", async () => {
      const formData = createMockFormData();

      mockedAxios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: "" } }],
        },
      });

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toMatchObject({
        type: AIErrorType.GENERIC,
        message: expect.any(String),
      });
    });

    it("should throw error when API returns no choices", async () => {
      const formData = createMockFormData();

      mockedAxios.post.mockResolvedValue({
        data: {
          choices: [],
        },
      });

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toMatchObject({
        type: AIErrorType.GENERIC,
        message: expect.any(String),
      });
    });

    it("should handle API timeout error", async () => {
      const formData = createMockFormData();
      const timeoutError = {
        code: "ECONNABORTED",
        isAxiosError: true,
      };

      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValue(timeoutError);

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toMatchObject({
        type: AIErrorType.TIMEOUT,
        message: expect.stringContaining("Request took too long"),
      });
    });

    it("should handle network timeout error", async () => {
      const formData = createMockFormData();
      const networkError = {
        code: "ETIMEDOUT",
        isAxiosError: true,
      };

      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValue(networkError);

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toMatchObject({
        type: AIErrorType.TIMEOUT,
        message: expect.stringContaining("Request took too long"),
      });
    });

    it("should handle rate limit error (429)", async () => {
      const formData = createMockFormData();
      const rateLimitError = {
        isAxiosError: true,
        response: {
          status: 429,
        },
      };

      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValue(rateLimitError);

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toMatchObject({
        type: AIErrorType.RATE_LIMIT,
        message: expect.stringContaining("Too many requests"),
      });
    });

    it("should handle authentication error (401)", async () => {
      const formData = createMockFormData();
      const authError = {
        isAxiosError: true,
        response: {
          status: 401,
        },
      };

      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValue(authError);

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toMatchObject({
        type: AIErrorType.GENERIC,
        message: expect.stringContaining("Something went wrong"),
      });
    });

    it("should handle network error (no response)", async () => {
      const formData = createMockFormData();
      const networkError = {
        isAxiosError: true,
        response: undefined,
      };

      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValue(networkError);

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toMatchObject({
        type: AIErrorType.NETWORK,
        message: expect.stringContaining("Unable to connect"),
      });
    });

    it("should handle server error (500)", async () => {
      const formData = createMockFormData();
      const serverError = {
        isAxiosError: true,
        response: {
          status: 500,
        },
      };

      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValue(serverError);

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toMatchObject({
        type: AIErrorType.GENERIC,
        message: expect.stringContaining("Something went wrong"),
      });
    });

    it("should handle non-axios errors", async () => {
      const formData = createMockFormData();
      const genericError = new Error("Unknown error");

      mockedAxios.isAxiosError.mockReturnValue(false);
      mockedAxios.post.mockRejectedValue(genericError);

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toMatchObject({
        type: AIErrorType.GENERIC,
        message: expect.stringContaining("Something went wrong"),
      });
    });

    it("should handle malformed API response", async () => {
      const formData = createMockFormData();

      mockedAxios.post.mockResolvedValue({
        data: {
          // Missing choices array
        },
      });

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toThrow();
    });
  });

  // ============================================================================
  // Singleton Instance Tests
  // ============================================================================
  describe("singleton instance", () => {
    it("should export a singleton instance", async () => {
      const { openAIService } = await import("../../../services/OpenAIService");
      expect(openAIService).toBeInstanceOf(OpenAIService);
    });
  });
});
