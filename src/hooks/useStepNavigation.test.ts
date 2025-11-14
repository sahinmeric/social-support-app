import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useStepNavigation } from "./useStepNavigation";
import { FormProvider } from "../contexts/FormContext";
import type { FormStep } from "../types/form.types";

describe("useStepNavigation", () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
  });

  it("should initialize with step 1", () => {
    const { result } = renderHook(() => useStepNavigation(), {
      wrapper: FormProvider,
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.canGoNext).toBe(true);
    expect(result.current.canGoPrevious).toBe(false);
  });

  it("should not navigate to next step when validation fails", async () => {
    const { result } = renderHook(() => useStepNavigation(), {
      wrapper: FormProvider,
    });

    const initialStep = result.current.currentStep;

    await act(async () => {
      await result.current.handleNext();
    });

    // Should stay on same step when validation fails
    expect(result.current.currentStep).toBe(initialStep);
  });

  it("should navigate to previous step", () => {
    const { result } = renderHook(() => useStepNavigation(), {
      wrapper: FormProvider,
    });

    // First go to step 2
    act(() => {
      result.current.goToStep(2);
    });

    expect(result.current.currentStep).toBe(2);

    // Then go back
    act(() => {
      result.current.handlePrevious();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it("should not go to previous step when on step 1", () => {
    const { result } = renderHook(() => useStepNavigation(), {
      wrapper: FormProvider,
    });

    expect(result.current.currentStep).toBe(1);

    act(() => {
      result.current.handlePrevious();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it("should navigate directly to a specific step", () => {
    const { result } = renderHook(() => useStepNavigation(), {
      wrapper: FormProvider,
    });

    act(() => {
      result.current.goToStep(3 as FormStep);
    });

    expect(result.current.currentStep).toBe(3);
  });

  it("should update canGoNext and canGoPrevious based on current step", () => {
    const { result } = renderHook(() => useStepNavigation(), {
      wrapper: FormProvider,
    });

    // Step 1
    expect(result.current.canGoNext).toBe(true);
    expect(result.current.canGoPrevious).toBe(false);

    // Step 2
    act(() => {
      result.current.goToStep(2 as FormStep);
    });

    expect(result.current.canGoNext).toBe(true);
    expect(result.current.canGoPrevious).toBe(true);

    // Step 3
    act(() => {
      result.current.goToStep(3 as FormStep);
    });

    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrevious).toBe(true);
  });

  it("should scroll to top when navigating", () => {
    const { result } = renderHook(() => useStepNavigation(), {
      wrapper: FormProvider,
    });

    act(() => {
      result.current.goToStep(2 as FormStep);
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
