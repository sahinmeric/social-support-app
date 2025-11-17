import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAISuggestion } from "./useAISuggestion";
import { FormProvider } from "../contexts/FormContext";
import { openAIService } from "../services/OpenAIService";
import type { AISuggestion } from "../types/openai.types";
import { AIErrorType } from "../types/openai.types";

// Mock the OpenAI service
vi.mock("../services/OpenAIService", () => ({
  openAIService: {
    generateSuggestion: vi.fn(),
    cancelRequest: vi.fn(),
    invalidateCache: vi.fn(),
  },
}));

describe("useAISuggestion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useAISuggestion(), {
      wrapper: FormProvider,
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.currentField).toBe(null);
    expect(result.current.suggestion).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should generate suggestion successfully", async () => {
    const mockSuggestion: AISuggestion = {
      text: "This is a test suggestion",
      fieldName: "financialSituation",
    };

    vi.mocked(openAIService.generateSuggestion).mockResolvedValue(
      mockSuggestion
    );

    const { result } = renderHook(() => useAISuggestion(), {
      wrapper: FormProvider,
    });

    await act(async () => {
      await result.current.generateSuggestion("financialSituation");
    });

    await waitFor(() => {
      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.currentField).toBe("financialSituation");
      expect(result.current.suggestion).toBe("This is a test suggestion");
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it("should handle suggestion generation error", async () => {
    const mockError = {
      type: AIErrorType.NETWORK,
      message: "Network error",
    };

    vi.mocked(openAIService.generateSuggestion).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAISuggestion(), {
      wrapper: FormProvider,
    });

    await act(async () => {
      await result.current.generateSuggestion("financialSituation");
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  it("should accept suggestion and update form data", async () => {
    const mockSuggestion: AISuggestion = {
      text: "Accepted suggestion",
      fieldName: "financialSituation",
    };

    vi.mocked(openAIService.generateSuggestion).mockResolvedValue(
      mockSuggestion
    );

    const { result } = renderHook(() => useAISuggestion(), {
      wrapper: FormProvider,
    });

    await act(async () => {
      await result.current.generateSuggestion("financialSituation");
    });

    await waitFor(() => {
      expect(result.current.suggestion).toBe("Accepted suggestion");
    });

    act(() => {
      result.current.acceptSuggestion();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.currentField).toBe(null);
    expect(result.current.suggestion).toBe("");
  });

  it("should edit suggestion and update form data", async () => {
    const mockSuggestion: AISuggestion = {
      text: "Original suggestion",
      fieldName: "financialSituation",
    };

    vi.mocked(openAIService.generateSuggestion).mockResolvedValue(
      mockSuggestion
    );

    const { result } = renderHook(() => useAISuggestion(), {
      wrapper: FormProvider,
    });

    await act(async () => {
      await result.current.generateSuggestion("financialSituation");
    });

    await waitFor(() => {
      expect(result.current.suggestion).toBe("Original suggestion");
    });

    act(() => {
      result.current.editSuggestion("Edited suggestion");
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.currentField).toBe(null);
    expect(result.current.suggestion).toBe("");
  });

  it("should discard suggestion without updating form data", async () => {
    const mockSuggestion: AISuggestion = {
      text: "Discarded suggestion",
      fieldName: "financialSituation",
    };

    vi.mocked(openAIService.generateSuggestion).mockResolvedValue(
      mockSuggestion
    );

    const { result } = renderHook(() => useAISuggestion(), {
      wrapper: FormProvider,
    });

    await act(async () => {
      await result.current.generateSuggestion("financialSituation");
    });

    await waitFor(() => {
      expect(result.current.suggestion).toBe("Discarded suggestion");
    });

    act(() => {
      result.current.discardSuggestion();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.currentField).toBe(null);
    expect(result.current.suggestion).toBe("");
  });

  it("should retry suggestion generation", async () => {
    const mockSuggestion: AISuggestion = {
      text: "Retry suggestion",
      fieldName: "financialSituation",
    };

    vi.mocked(openAIService.generateSuggestion).mockResolvedValue(
      mockSuggestion
    );

    const { result } = renderHook(() => useAISuggestion(), {
      wrapper: FormProvider,
    });

    await act(async () => {
      await result.current.generateSuggestion("financialSituation");
    });

    await waitFor(() => {
      expect(result.current.suggestion).toBe("Retry suggestion");
    });

    // Clear the mock and set new value
    vi.mocked(openAIService.generateSuggestion).mockResolvedValue({
      text: "New retry suggestion",
      fieldName: "financialSituation",
    });

    await act(async () => {
      await result.current.retrySuggestion();
    });

    await waitFor(() => {
      expect(result.current.suggestion).toBe("New retry suggestion");
    });
  });

  it("should close modal and reset state", async () => {
    const mockSuggestion: AISuggestion = {
      text: "Test suggestion",
      fieldName: "financialSituation",
    };

    vi.mocked(openAIService.generateSuggestion).mockResolvedValue(
      mockSuggestion
    );

    const { result } = renderHook(() => useAISuggestion(), {
      wrapper: FormProvider,
    });

    await act(async () => {
      await result.current.generateSuggestion("financialSituation");
    });

    await waitFor(() => {
      expect(result.current.isModalOpen).toBe(true);
    });

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.currentField).toBe(null);
    expect(result.current.suggestion).toBe("");
    expect(result.current.error).toBe(null);
  });
});
