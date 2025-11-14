import { describe, it, expect } from "vitest";
import {
  calculateCompletionPercentage,
  calculateStepCompletion,
} from "./progress";
import type { ApplicationFormData } from "../types/form.types";

describe("calculateStepCompletion", () => {
  describe("Step 1 - Personal Information", () => {
    it("should return 0% when no fields are filled", () => {
      const formData = {} as ApplicationFormData;
      const result = calculateStepCompletion(formData, 1);
      expect(result).toBe(0);
    });

    it("should return 100% when all Step 1 fields are filled", () => {
      const formData: ApplicationFormData = {
        name: "John Doe",
        nationalId: "1234567890",
        dateOfBirth: "1990-01-01",
        gender: "male",
        address: "123 Main St",
        city: "Dubai",
        state: "Dubai",
        country: "UAE",
        phone: "+971501234567",
        email: "john@example.com",
      } as ApplicationFormData;

      const result = calculateStepCompletion(formData, 1);
      expect(result).toBe(100);
    });

    it("should return 50% when half of Step 1 fields are filled", () => {
      const formData: ApplicationFormData = {
        name: "John Doe",
        nationalId: "1234567890",
        dateOfBirth: "1990-01-01",
        gender: "male",
        address: "123 Main St",
      } as ApplicationFormData;

      const result = calculateStepCompletion(formData, 1);
      expect(result).toBe(50);
    });

    it("should not count empty strings as filled", () => {
      const formData: ApplicationFormData = {
        name: "",
        nationalId: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        country: "",
        phone: "",
        email: "",
      } as ApplicationFormData;

      const result = calculateStepCompletion(formData, 1);
      expect(result).toBe(0);
    });

    it("should not count whitespace-only strings as filled", () => {
      const formData: ApplicationFormData = {
        name: "   ",
        nationalId: "  ",
        dateOfBirth: "",
        gender: "",
        address: "",
      } as ApplicationFormData;

      const result = calculateStepCompletion(formData, 1);
      expect(result).toBe(0);
    });
  });

  describe("Step 2 - Family & Financial Information", () => {
    it("should return 0% when no fields are filled", () => {
      const formData = {} as ApplicationFormData;
      const result = calculateStepCompletion(formData, 2);
      expect(result).toBe(0);
    });

    it("should return 100% when all Step 2 fields are filled", () => {
      const formData: ApplicationFormData = {
        maritalStatus: "married",
        dependents: 2,
        employmentStatus: "employed",
        monthlyIncome: 5000,
        housingStatus: "rented",
      } as ApplicationFormData;

      const result = calculateStepCompletion(formData, 2);
      expect(result).toBe(100);
    });

    it("should count 0 as a filled numeric field", () => {
      const formData: ApplicationFormData = {
        maritalStatus: "single",
        dependents: 0,
        employmentStatus: "unemployed",
        monthlyIncome: 0,
        housingStatus: "homeless",
      } as ApplicationFormData;

      const result = calculateStepCompletion(formData, 2);
      expect(result).toBe(100);
    });

    it("should return 60% when 3 out of 5 fields are filled", () => {
      const formData: ApplicationFormData = {
        maritalStatus: "married",
        dependents: 2,
        employmentStatus: "employed",
      } as ApplicationFormData;

      const result = calculateStepCompletion(formData, 2);
      expect(result).toBe(60);
    });
  });

  describe("Step 3 - Situation Descriptions", () => {
    it("should return 0% when no fields are filled", () => {
      const formData = {} as ApplicationFormData;
      const result = calculateStepCompletion(formData, 3);
      expect(result).toBe(0);
    });

    it("should return 100% when all Step 3 fields are filled", () => {
      const formData: ApplicationFormData = {
        financialSituation: "I am facing financial difficulties",
        employmentCircumstances: "I am currently unemployed",
        reasonForApplying: "I need support for my family",
      } as ApplicationFormData;

      const result = calculateStepCompletion(formData, 3);
      expect(result).toBe(100);
    });

    it("should return 33% when 1 out of 3 fields are filled", () => {
      const formData: ApplicationFormData = {
        financialSituation: "I am facing financial difficulties",
      } as ApplicationFormData;

      const result = calculateStepCompletion(formData, 3);
      expect(result).toBe(33);
    });

    it("should return 67% when 2 out of 3 fields are filled", () => {
      const formData: ApplicationFormData = {
        financialSituation: "I am facing financial difficulties",
        employmentCircumstances: "I am currently unemployed",
      } as ApplicationFormData;

      const result = calculateStepCompletion(formData, 3);
      expect(result).toBe(67);
    });
  });
});

describe("calculateCompletionPercentage", () => {
  it("should return 0% when no fields are filled", () => {
    const formData = {} as ApplicationFormData;
    const result = calculateCompletionPercentage(formData);
    expect(result).toBe(0);
  });

  it("should return 100% when all required fields are filled", () => {
    const formData: ApplicationFormData = {
      // Step 1
      name: "John Doe",
      nationalId: "1234567890",
      dateOfBirth: "1990-01-01",
      gender: "male",
      address: "123 Main St",
      city: "Dubai",
      state: "Dubai",
      country: "UAE",
      phone: "+971501234567",
      email: "john@example.com",
      // Step 2
      maritalStatus: "married",
      dependents: 2,
      employmentStatus: "employed",
      monthlyIncome: 5000,
      currency: "AED",
      housingStatus: "rented",
      // Step 3
      financialSituation: "I am facing financial difficulties",
      employmentCircumstances: "I am currently unemployed",
      reasonForApplying: "I need support for my family",
    };

    const result = calculateCompletionPercentage(formData);
    expect(result).toBe(100);
  });

  it("should calculate correct percentage for partially filled form", () => {
    const formData: ApplicationFormData = {
      // Step 1 - 5 out of 10 fields
      name: "John Doe",
      nationalId: "1234567890",
      dateOfBirth: "1990-01-01",
      gender: "male",
      address: "123 Main St",
    } as ApplicationFormData;

    const result = calculateCompletionPercentage(formData);
    // 5 out of 18 total required fields = 28%
    expect(result).toBe(28);
  });

  it("should handle form with only Step 1 completed", () => {
    const formData: ApplicationFormData = {
      name: "John Doe",
      nationalId: "1234567890",
      dateOfBirth: "1990-01-01",
      gender: "male",
      address: "123 Main St",
      city: "Dubai",
      state: "Dubai",
      country: "UAE",
      phone: "+971501234567",
      email: "john@example.com",
    } as ApplicationFormData;

    const result = calculateCompletionPercentage(formData);
    // 10 out of 18 total required fields = 56%
    expect(result).toBe(56);
  });

  it("should handle form with Steps 1 and 2 completed", () => {
    const formData: ApplicationFormData = {
      // Step 1
      name: "John Doe",
      nationalId: "1234567890",
      dateOfBirth: "1990-01-01",
      gender: "male",
      address: "123 Main St",
      city: "Dubai",
      state: "Dubai",
      country: "UAE",
      phone: "+971501234567",
      email: "john@example.com",
      // Step 2
      maritalStatus: "married",
      dependents: 2,
      employmentStatus: "employed",
      monthlyIncome: 5000,
      housingStatus: "rented",
    } as ApplicationFormData;

    const result = calculateCompletionPercentage(formData);
    // 15 out of 18 total required fields = 83%
    expect(result).toBe(83);
  });

  it("should count numeric 0 values as filled", () => {
    const formData: ApplicationFormData = {
      dependents: 0,
      monthlyIncome: 0,
    } as ApplicationFormData;

    const result = calculateCompletionPercentage(formData);
    // 2 out of 18 total required fields = 11%
    expect(result).toBe(11);
  });

  it("should not count empty strings as filled", () => {
    const formData: ApplicationFormData = {
      name: "",
      address: "",
      email: "",
    } as ApplicationFormData;

    const result = calculateCompletionPercentage(formData);
    expect(result).toBe(0);
  });

  it("should not count null or undefined values as filled", () => {
    const formData: ApplicationFormData = {
      name: null as unknown as string,
      address: undefined as unknown as string,
    } as ApplicationFormData;

    const result = calculateCompletionPercentage(formData);
    expect(result).toBe(0);
  });
});
