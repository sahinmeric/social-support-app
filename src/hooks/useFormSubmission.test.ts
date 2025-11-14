import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFormSubmission } from "./useFormSubmission";
import { APIService } from "../services/APIService";
import { StorageService } from "../services/StorageService";
import { createMockFormData } from "../test/mockData";
import type { SubmissionResponse } from "../types/api.types";

// Mock the services
vi.mock("../services/APIService");
vi.mock("../services/StorageService");

describe("useFormSubmission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFormSubmission());

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.submissionData).toBe(null);
  });

  it("should submit form successfully", async () => {
    const mockFormData = createMockFormData();
    const mockResponse: SubmissionResponse = {
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationId: "APP-123",
        timestamp: new Date().toISOString(),
      },
    };

    vi.mocked(APIService.submitApplication).mockResolvedValue(mockResponse);
    vi.mocked(StorageService.clearFormData).mockImplementation(() => {});

    const { result } = renderHook(() => useFormSubmission());

    const mockValidate = vi.fn().mockResolvedValue(true);

    await act(async () => {
      await result.current.submitForm(mockFormData, mockValidate);
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.submissionData).toEqual(mockResponse.data);
    });

    expect(mockValidate).toHaveBeenCalled();
    expect(APIService.submitApplication).toHaveBeenCalledWith(mockFormData);
    expect(StorageService.clearFormData).toHaveBeenCalled();
  });

  it("should handle validation failure", async () => {
    const mockFormData = createMockFormData();
    const { result } = renderHook(() => useFormSubmission());

    const mockValidate = vi.fn().mockResolvedValue(false);

    await act(async () => {
      await result.current.submitForm(mockFormData, mockValidate);
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBeTruthy();
    });

    expect(mockValidate).toHaveBeenCalled();
    expect(APIService.submitApplication).not.toHaveBeenCalled();
  });

  it("should handle submission error", async () => {
    const mockFormData = createMockFormData();
    const mockError = new Error("Network error");

    vi.mocked(APIService.submitApplication).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFormSubmission());

    const mockValidate = vi.fn().mockResolvedValue(true);

    await act(async () => {
      await result.current.submitForm(mockFormData, mockValidate);
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBe("Network error");
    });
  });

  it("should handle API response without success flag", async () => {
    const mockFormData = createMockFormData();
    const mockResponse: SubmissionResponse = {
      success: false,
      message: "Submission failed",
      data: null,
    };

    vi.mocked(APIService.submitApplication).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFormSubmission());

    const mockValidate = vi.fn().mockResolvedValue(true);

    await act(async () => {
      await result.current.submitForm(mockFormData, mockValidate);
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  it("should reset submission state", async () => {
    const mockFormData = createMockFormData();
    const mockResponse: SubmissionResponse = {
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationId: "APP-123",
        timestamp: new Date().toISOString(),
      },
    };

    vi.mocked(APIService.submitApplication).mockResolvedValue(mockResponse);
    vi.mocked(StorageService.clearFormData).mockImplementation(() => {});

    const { result } = renderHook(() => useFormSubmission());

    const mockValidate = vi.fn().mockResolvedValue(true);

    await act(async () => {
      await result.current.submitForm(mockFormData, mockValidate);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    act(() => {
      result.current.resetSubmission();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.submissionData).toBe(null);
  });

  it("should set isSubmitting to true during submission", async () => {
    const mockFormData = createMockFormData();
    const mockResponse: SubmissionResponse = {
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationId: "APP-123",
        timestamp: new Date().toISOString(),
      },
    };

    // Create a promise that we can control
    let resolveSubmission: (value: SubmissionResponse) => void;
    const submissionPromise = new Promise<SubmissionResponse>((resolve) => {
      resolveSubmission = resolve;
    });

    vi.mocked(APIService.submitApplication).mockReturnValue(submissionPromise);
    vi.mocked(StorageService.clearFormData).mockImplementation(() => {});

    const { result } = renderHook(() => useFormSubmission());

    const mockValidate = vi.fn().mockResolvedValue(true);

    // Start submission
    act(() => {
      result.current.submitForm(mockFormData, mockValidate);
    });

    // Check that isSubmitting is true
    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(true);
    });

    // Resolve the submission
    await act(async () => {
      resolveSubmission!(mockResponse);
    });

    // Check that isSubmitting is false after completion
    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
