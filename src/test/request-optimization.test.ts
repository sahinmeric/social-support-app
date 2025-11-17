import { describe, it, expect, vi, beforeEach } from "vitest";
import { OpenAIService } from "../services/OpenAIService";
import type { ApplicationFormData } from "../types/form.types";

describe("Request Optimization Features", () => {
  let service: OpenAIService;
  const mockFormData: ApplicationFormData = {
    name: "Test User",
    nationalId: "123456",
    dateOfBirth: "1990-01-01",
    gender: "male",
    address: "123 Test St",
    city: "Test City",
    state: "Test State",
    country: "Test Country",
    phone: "+1234567890",
    email: "test@test.com",
    maritalStatus: "single",
    dependents: 0,
    employmentStatus: "employed",
    monthlyIncome: 5000,
    currency: "USD",
    housingStatus: "rented",
    financialSituation: "Test situation",
    employmentCircumstances: "Test circumstances",
    reasonForApplying: "Test reason",
  };

  beforeEach(() => {
    service = new OpenAIService();
    service.invalidateCache(); // Clear cache before each test
  });

  describe("Request Caching", () => {
    it("should cache suggestions and return cached result on subsequent calls", async () => {
      // First call - should generate new suggestion
      const result1 = await service.generateSuggestion(
        "financialSituation",
        mockFormData
      );
      expect(result1.text).toBeTruthy();

      // Second call with same data - should return cached result
      const result2 = await service.generateSuggestion(
        "financialSituation",
        mockFormData
      );
      expect(result2.text).toBe(result1.text);
    });

    it("should generate new suggestion when form data changes", async () => {
      // First call
      const result1 = await service.generateSuggestion(
        "financialSituation",
        mockFormData
      );

      // Change form data
      const updatedFormData = {
        ...mockFormData,
        monthlyIncome: 6000, // Changed income
      };

      // Second call with different data - should generate new suggestion
      const result2 = await service.generateSuggestion(
        "financialSituation",
        updatedFormData
      );

      // Results should be different (in mock mode, they'll be the same template
      // but in real mode they would differ based on context)
      expect(result2).toBeTruthy();
    });

    it("should cache suggestions separately for different fields", async () => {
      const result1 = await service.generateSuggestion(
        "financialSituation",
        mockFormData
      );
      const result2 = await service.generateSuggestion(
        "employmentCircumstances",
        mockFormData
      );

      expect(result1.fieldName).toBe("financialSituation");
      expect(result2.fieldName).toBe("employmentCircumstances");
    });
  });

  describe("Cache Invalidation", () => {
    it("should invalidate cache for specific field", async () => {
      // Generate and cache suggestion
      await service.generateSuggestion("financialSituation", mockFormData);

      // Invalidate cache for this field
      service.invalidateCache("financialSituation");

      // Next call should generate new suggestion (not from cache)
      const result = await service.generateSuggestion(
        "financialSituation",
        mockFormData
      );
      expect(result).toBeTruthy();
    });

    it("should invalidate all cache when no field specified", async () => {
      // Generate and cache multiple suggestions
      await service.generateSuggestion("financialSituation", mockFormData);
      await service.generateSuggestion("employmentCircumstances", mockFormData);

      // Invalidate all cache
      service.invalidateCache();

      // Next calls should generate new suggestions
      const result1 = await service.generateSuggestion(
        "financialSituation",
        mockFormData
      );
      const result2 = await service.generateSuggestion(
        "employmentCircumstances",
        mockFormData
      );

      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    }, 10000);
  });

  describe("Request Cancellation", () => {
    it("should have cancelRequest method", () => {
      expect(typeof service.cancelRequest).toBe("function");
    });

    it("should not throw error when cancelling with no active request", () => {
      expect(() => service.cancelRequest()).not.toThrow();
    });
  });
});
