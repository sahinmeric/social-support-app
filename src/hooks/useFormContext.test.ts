import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFormContext } from "./useFormContext";
import { FormProvider } from "../contexts/FormContext";

describe("useFormContext", () => {
  it("should throw error when used outside FormProvider", () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useFormContext());
    }).toThrow("useFormContext must be used within a FormProvider");

    console.error = originalError;
  });

  it("should return form context when used within FormProvider", () => {
    const { result } = renderHook(() => useFormContext(), {
      wrapper: FormProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current.formData).toBeDefined();
    expect(result.current.currentStep).toBe(1);
    expect(result.current.errors).toBeDefined();
    expect(typeof result.current.updateFormData).toBe("function");
    expect(typeof result.current.setCurrentStep).toBe("function");
    expect(typeof result.current.validateCurrentStep).toBe("function");
    expect(typeof result.current.clearErrors).toBe("function");
    expect(typeof result.current.setErrors).toBe("function");
    expect(typeof result.current.resetForm).toBe("function");
  });
});
