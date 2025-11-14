import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFormPersistence } from "./useFormPersistence";
import { StorageService } from "../services/StorageService";
import { createMockFormData } from "../test/mockData";
import type { FormStep } from "../types/form.types";
import { APP_CONFIG } from "../constants";

// Mock the StorageService
vi.mock("../services/StorageService");

describe("useFormPersistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should save form data after debounce delay", () => {
    const mockFormData = createMockFormData();
    const currentStep: FormStep = 1;

    vi.mocked(StorageService.saveFormData).mockImplementation(() => {});
    vi.mocked(StorageService.saveCurrentStep).mockImplementation(() => {});

    renderHook(() => useFormPersistence(mockFormData, currentStep));

    // Initially, nothing should be saved
    expect(StorageService.saveFormData).not.toHaveBeenCalled();
    expect(StorageService.saveCurrentStep).not.toHaveBeenCalled();

    // Fast-forward time by debounce delay
    vi.advanceTimersByTime(APP_CONFIG.DEBOUNCE_DELAY);

    expect(StorageService.saveFormData).toHaveBeenCalledWith(mockFormData);
    expect(StorageService.saveCurrentStep).toHaveBeenCalledWith(currentStep);
  });

  it("should debounce multiple updates", () => {
    const mockFormData = createMockFormData();
    const currentStep: FormStep = 1;

    vi.mocked(StorageService.saveFormData).mockImplementation(() => {});
    vi.mocked(StorageService.saveCurrentStep).mockImplementation(() => {});

    const { rerender } = renderHook(
      ({ formData, step }) => useFormPersistence(formData, step),
      {
        initialProps: { formData: mockFormData, step: currentStep },
      }
    );

    // Update form data multiple times
    const updatedFormData1 = { ...mockFormData, name: "Jane Doe" };
    rerender({ formData: updatedFormData1, step: currentStep });

    vi.advanceTimersByTime(APP_CONFIG.DEBOUNCE_DELAY / 2);

    const updatedFormData2 = { ...mockFormData, name: "John Smith" };
    rerender({ formData: updatedFormData2, step: currentStep });

    vi.advanceTimersByTime(APP_CONFIG.DEBOUNCE_DELAY / 2);

    // Should not have saved yet
    expect(StorageService.saveFormData).not.toHaveBeenCalled();

    // Fast-forward remaining time
    vi.advanceTimersByTime(APP_CONFIG.DEBOUNCE_DELAY / 2);

    // Should only save once with the latest data
    expect(StorageService.saveFormData).toHaveBeenCalledTimes(1);
    expect(StorageService.saveFormData).toHaveBeenCalledWith(updatedFormData2);
  });

  it("should save when step changes", () => {
    const mockFormData = createMockFormData();
    const currentStep: FormStep = 1;

    vi.mocked(StorageService.saveFormData).mockImplementation(() => {});
    vi.mocked(StorageService.saveCurrentStep).mockImplementation(() => {});

    const { rerender } = renderHook(
      ({ formData, step }) => useFormPersistence(formData, step),
      {
        initialProps: { formData: mockFormData, step: currentStep },
      }
    );

    // Change step
    const newStep: FormStep = 2;
    rerender({ formData: mockFormData, step: newStep });

    // Fast-forward time
    vi.advanceTimersByTime(APP_CONFIG.DEBOUNCE_DELAY);

    expect(StorageService.saveFormData).toHaveBeenCalledWith(mockFormData);
    expect(StorageService.saveCurrentStep).toHaveBeenCalledWith(newStep);
  });

  it("should cleanup timeout on unmount", () => {
    const mockFormData = createMockFormData();
    const currentStep: FormStep = 1;

    vi.mocked(StorageService.saveFormData).mockImplementation(() => {});
    vi.mocked(StorageService.saveCurrentStep).mockImplementation(() => {});

    const { unmount } = renderHook(() =>
      useFormPersistence(mockFormData, currentStep)
    );

    // Unmount before debounce delay
    unmount();

    // Fast-forward time
    vi.advanceTimersByTime(APP_CONFIG.DEBOUNCE_DELAY);

    // Should not save after unmount
    expect(StorageService.saveFormData).not.toHaveBeenCalled();
    expect(StorageService.saveCurrentStep).not.toHaveBeenCalled();
  });

  it("should handle rapid form data changes", () => {
    const mockFormData = createMockFormData();
    const currentStep: FormStep = 1;

    vi.mocked(StorageService.saveFormData).mockImplementation(() => {});
    vi.mocked(StorageService.saveCurrentStep).mockImplementation(() => {});

    const { rerender } = renderHook(
      ({ formData, step }) => useFormPersistence(formData, step),
      {
        initialProps: { formData: mockFormData, step: currentStep },
      }
    );

    // Simulate rapid typing
    for (let i = 0; i < 10; i++) {
      const updatedFormData = { ...mockFormData, name: `Name ${i}` };
      rerender({ formData: updatedFormData, step: currentStep });
      vi.advanceTimersByTime(100); // Advance by small amount
    }

    // Should not have saved yet
    expect(StorageService.saveFormData).not.toHaveBeenCalled();

    // Fast-forward to complete debounce
    vi.advanceTimersByTime(APP_CONFIG.DEBOUNCE_DELAY);

    // Should only save once with the final data
    expect(StorageService.saveFormData).toHaveBeenCalledTimes(1);
  });

  it("should save both form data and current step together", () => {
    const mockFormData = createMockFormData();
    const currentStep: FormStep = 2;

    vi.mocked(StorageService.saveFormData).mockImplementation(() => {});
    vi.mocked(StorageService.saveCurrentStep).mockImplementation(() => {});

    renderHook(() => useFormPersistence(mockFormData, currentStep));

    vi.advanceTimersByTime(APP_CONFIG.DEBOUNCE_DELAY);

    expect(StorageService.saveFormData).toHaveBeenCalledWith(mockFormData);
    expect(StorageService.saveCurrentStep).toHaveBeenCalledWith(currentStep);
    expect(StorageService.saveFormData).toHaveBeenCalledTimes(1);
    expect(StorageService.saveCurrentStep).toHaveBeenCalledTimes(1);
  });
});
