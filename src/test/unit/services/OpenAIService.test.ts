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
  let sanitizeInput: unknown;
  let PerformanceMonitor: unknown;
  let mockedAxios: unknown;

  const mockApiKey = "test-api-key-123";

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
    it("should use provided API key when passed as parameter", () => {
      service = new OpenAIService(mockApiKey);
      expect(service["apiKey"]).toBe(mockApiKey);
    });

    it("should use environment variable API key when no parameter provided", () => {
      const envApiKey = "env-api-key-456";
      vi.stubEnv("VITE_OPENAI_API_KEY", envApiKey);

      service = new OpenAIService();
      expect(service["apiKey"]).toBe(envApiKey);
    });

    it("should use empty string when no API key is available", () => {
      vi.stubEnv("VITE_OPENAI_API_KEY", "");

      service = new OpenAIService();
      expect(service["apiKey"]).toBe("");
    });

    it("should prioritize parameter API key over environment variable", () => {
      vi.stubEnv("VITE_OPENAI_API_KEY", "env-key");

      service = new OpenAIService(mockApiKey);
      expect(service["apiKey"]).toBe(mockApiKey);
    });
  });

  // ============================================================================
  // Task 1.2: Mock Suggestion Generation Tests
  // ============================================================================
  describe("generateMockSuggestion", () => {
    beforeEach(() => {
      service = new OpenAIService(mockApiKey);
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
  describe("buildPrompt", () => {
    beforeEach(() => {
      service = new OpenAIService(mockApiKey);
    });

    it("should build prompt for financialSituation with complete form data", () => {
      const formData = createMockFormData({
        employmentStatus: "employed",
        monthlyIncome: 5000,
        housingStatus: "owned",
        dependents: 2,
      });

      const prompt = service["buildPrompt"]("financialSituation", formData);

      expect(prompt).toContain("financialSituation");
      expect(prompt).toContain("Employment Status: employed");
      expect(prompt).toContain("Monthly Income: 5000");
      expect(prompt).toContain("Housing Status: owned");
      expect(prompt).toContain("Number of Dependents: 2");
      expect(prompt).toContain("50-200 words");
    });

    it("should build prompt for financialSituation with missing data", () => {
      const formData = createMockFormData({
        employmentStatus: undefined,
        monthlyIncome: undefined,
        housingStatus: undefined,
        dependents: undefined,
      });

      const prompt = service["buildPrompt"]("financialSituation", formData);

      expect(prompt).toContain("Employment Status: Not specified");
      expect(prompt).toContain("Monthly Income: Not specified");
      expect(prompt).toContain("Housing Status: Not specified");
      expect(prompt).toContain("Number of Dependents: 0");
    });

    it("should build prompt for employmentCircumstances with complete form data", () => {
      const formData = createMockFormData({
        employmentStatus: "selfEmployed",
        monthlyIncome: 4000,
      });

      const prompt = service["buildPrompt"](
        "employmentCircumstances",
        formData
      );

      expect(prompt).toContain("employmentCircumstances");
      expect(prompt).toContain("Employment Status: selfEmployed");
      expect(prompt).toContain("Monthly Income: 4000");
      expect(prompt).toContain("employment circumstances");
    });

    it("should build prompt for employmentCircumstances with missing data", () => {
      const formData = createMockFormData({
        employmentStatus: undefined,
        monthlyIncome: undefined,
      });

      const prompt = service["buildPrompt"](
        "employmentCircumstances",
        formData
      );

      expect(prompt).toContain("Employment Status: Not specified");
      expect(prompt).toContain("Monthly Income: Not specified");
    });

    it("should build prompt for reasonForApplying with complete form data", () => {
      const formData = createMockFormData({
        financialSituation: "Facing hardship",
        employmentStatus: "unemployed",
        housingStatus: "homeless",
        dependents: 3,
      });

      const prompt = service["buildPrompt"]("reasonForApplying", formData);

      expect(prompt).toContain("reasonForApplying");
      expect(prompt).toContain("Financial Situation: Facing hardship");
      expect(prompt).toContain("Employment Status: unemployed");
      expect(prompt).toContain("Housing Status: homeless");
      expect(prompt).toContain("Number of Dependents: 3");
    });

    it("should build prompt for reasonForApplying with missing data", () => {
      const formData = createMockFormData({
        financialSituation: undefined,
        employmentStatus: undefined,
        housingStatus: undefined,
        dependents: undefined,
      });

      const prompt = service["buildPrompt"]("reasonForApplying", formData);

      expect(prompt).toContain("Financial Situation: Not specified");
      expect(prompt).toContain("Employment Status: Not specified");
      expect(prompt).toContain("Housing Status: Not specified");
      expect(prompt).toContain("Number of Dependents: 0");
    });

    it("should build default prompt for unknown field", () => {
      const formData = createMockFormData();
      const unknownField = "customField" as keyof ApplicationFormData;

      const prompt = service["buildPrompt"](unknownField, formData);

      expect(prompt).toContain("customField");
      expect(prompt).toContain("Generate appropriate content");
    });

    it("should include base context in all prompts", () => {
      const formData = createMockFormData();
      const fields: Array<keyof ApplicationFormData> = [
        "financialSituation",
        "employmentCircumstances",
        "reasonForApplying",
      ];

      fields.forEach((field) => {
        const prompt = service["buildPrompt"](field, formData);
        expect(prompt).toContain("social support application form");
        expect(prompt).toContain("clear, concise, and empathetic");
      });
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
      service = new OpenAIService(mockApiKey);
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
      service = new OpenAIService(mockApiKey);
    });

    it("should throw error when API key is not configured", async () => {
      service = new OpenAIService(""); // No API key
      const formData = createMockFormData();

      await expect(
        service.generateSuggestion("financialSituation", formData)
      ).rejects.toMatchObject({
        type: AIErrorType.GENERIC,
        message: expect.stringContaining("API key is not configured"),
      });
    });

    it("should call OpenAI API with correct parameters", async () => {
      const formData = createMockFormData();
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: "AI generated suggestion",
              },
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await service.generateSuggestion("financialSituation", formData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.openai.com/v1/chat/completions",
        expect.objectContaining({
          model: "gpt-3.5-turbo",
          max_tokens: 300,
          temperature: 0.7,
          messages: expect.arrayContaining([
            expect.objectContaining({ role: "system" }),
            expect.objectContaining({ role: "user" }),
          ]),
        }),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockApiKey}`,
          },
          timeout: 30000,
        })
      );
    });

    it("should return sanitized suggestion from successful API call", async () => {
      const formData = createMockFormData();
      const mockSuggestion = "  AI generated suggestion  ";
      const mockSanitized = "sanitized suggestion";

      mockedAxios.post.mockResolvedValue({
        data: {
          choices: [{ message: { content: mockSuggestion } }],
        },
      });

      sanitizeInput.mockReturnValue(mockSanitized);

      const result = await service.generateSuggestion(
        "financialSituation",
        formData
      );

      expect(result.text).toBe(mockSanitized);
      expect(sanitizeInput).toHaveBeenCalledWith(mockSuggestion.trim());
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
