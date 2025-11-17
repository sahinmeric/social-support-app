import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { FormProvider } from "./FormContext";
import { useFormContext } from "../hooks/useFormContext";
import { StorageService } from "../services/StorageService";
import type { FormStep } from "../types/form.types";

describe("FormContext", () => {
  beforeEach(() => {
    StorageService.clearFormData();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useFormContext(), {
      wrapper: FormProvider,
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.formData).toBeDefined();
  });

  it("should update form data", () => {
    const { result } = renderHook(() => useFormContext(), {
      wrapper: FormProvider,
    });

    act(() => {
      result.current.updateFormData("name", "John Doe");
    });

    expect(result.current.formData.name).toBe("John Doe");
  });

  it("should not advance step when validation fails", async () => {
    const { result } = renderHook(() => useFormContext(), {
      wrapper: FormProvider,
    });

    // Set invalid data (empty required field)
    act(() => {
      result.current.updateFormData("name", "");
    });

    const initialStep = result.current.currentStep;

    // Try to advance
    await act(async () => {
      const isValid = await result.current.validateCurrentStep();
      if (isValid) {
        result.current.setCurrentStep((initialStep + 1) as FormStep);
      }
    });

    // Should still be on same step due to validation failure
    expect(result.current.currentStep).toBe(initialStep);
  });

  it("should allow setting current step", () => {
    const { result } = renderHook(() => useFormContext(), {
      wrapper: FormProvider,
    });

    // Start on step 1
    expect(result.current.currentStep).toBe(1);

    // Set to step 2
    act(() => {
      result.current.setCurrentStep(2);
    });

    expect(result.current.currentStep).toBe(2);

    // Set to step 3
    act(() => {
      result.current.setCurrentStep(3);
    });

    expect(result.current.currentStep).toBe(3);
  });

  it("should advance to next step when validation passes", async () => {
    const { result } = renderHook(() => useFormContext(), {
      wrapper: FormProvider,
    });

    // Set valid data for step 1
    act(() => {
      result.current.updateFormData("name", "John Doe");
      result.current.updateFormData("nationalId", "1234567890");
      result.current.updateFormData("dateOfBirth", "1990-01-01");
      result.current.updateFormData("gender", "male");
      result.current.updateFormData("address", "123 Main St");
      result.current.updateFormData("city", "Dubai");
      result.current.updateFormData("state", "Dubai");
      result.current.updateFormData("country", "UAE");
      result.current.updateFormData("phone", "+971501234567");
      result.current.updateFormData("email", "john@example.com");
    });

    // Try to advance
    await act(async () => {
      const isValid = await result.current.validateCurrentStep();
      if (isValid) {
        result.current.setCurrentStep(2);
      }
    });

    // Should advance to step 2
    expect(result.current.currentStep).toBe(2);
  });

  it("should go back to previous step", async () => {
    const { result } = renderHook(() => useFormContext(), {
      wrapper: FormProvider,
    });

    // Advance to step 2
    act(() => {
      result.current.setCurrentStep(2);
    });

    expect(result.current.currentStep).toBe(2);

    // Go back
    act(() => {
      result.current.setCurrentStep(1);
    });

    expect(result.current.currentStep).toBe(1);
  });

  it("should reset form data", () => {
    const { result } = renderHook(() => useFormContext(), {
      wrapper: FormProvider,
    });

    // Set some data
    act(() => {
      result.current.updateFormData("name", "John Doe");
    });

    expect(result.current.formData.name).toBe("John Doe");

    // Reset
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.name).toBe("");
    expect(result.current.currentStep).toBe(1);
  });
});
