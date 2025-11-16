import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  LanguageProvider,
  useLanguage,
} from "../../../contexts/LanguageContext";
import { SUPPORTED_LANGUAGES } from "../../../constants";
import type { ReactNode } from "react";
import { loadLanguageResources } from "../../../i18n/config";

// Mock i18n
const mockChangeLanguage = vi.fn();
const mockHasResourceBundle = vi.fn();
const mockAddResourceBundle = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: mockChangeLanguage,
      hasResourceBundle: mockHasResourceBundle,
      addResourceBundle: mockAddResourceBundle,
    },
  }),
}));

// Mock loadLanguageResources
vi.mock("../../../i18n/config", () => ({
  loadLanguageResources: vi.fn(),
}));

// Get the mocked function
const mockLoadLanguageResources = vi.mocked(loadLanguageResources);

describe("LanguageContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset document attributes
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
  });

  afterEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <LanguageProvider>{children}</LanguageProvider>
  );

  // ============================================================================
  // Task 6.1: Dynamic Language Loading Tests
  // ============================================================================
  describe("setLanguage with dynamic loading", () => {
    it("should load language resources when not already loaded", async () => {
      mockHasResourceBundle.mockReturnValue(false);
      mockLoadLanguageResources.mockResolvedValue({ test: "value" });
      mockChangeLanguage.mockResolvedValue(undefined);

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      await waitFor(() => {
        expect(mockHasResourceBundle).toHaveBeenCalledWith("ar", "translation");
        expect(mockLoadLanguageResources).toHaveBeenCalledWith("ar");
        expect(mockAddResourceBundle).toHaveBeenCalledWith(
          "ar",
          "translation",
          { test: "value" }
        );
      });
    });

    it("should not load resources if already loaded", async () => {
      mockHasResourceBundle.mockReturnValue(true);
      mockChangeLanguage.mockResolvedValue(undefined);

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      await waitFor(() => {
        expect(mockHasResourceBundle).toHaveBeenCalledWith("ar", "translation");
        expect(mockLoadLanguageResources).not.toHaveBeenCalled();
        expect(mockAddResourceBundle).not.toHaveBeenCalled();
      });
    });

    it("should call i18n.changeLanguage after loading resources", async () => {
      mockHasResourceBundle.mockReturnValue(false);
      mockLoadLanguageResources.mockResolvedValue({ test: "value" });
      mockChangeLanguage.mockResolvedValue(undefined);

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      await waitFor(() => {
        expect(mockChangeLanguage).toHaveBeenCalledWith("ar");
      });
    });

    it("should update localStorage after language change", async () => {
      mockHasResourceBundle.mockReturnValue(true);
      mockChangeLanguage.mockResolvedValue(undefined);

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      await waitFor(() => {
        expect(localStorage.getItem("language")).toBe("ar");
      });
    });
  });

  // ============================================================================
  // Task 6.2: RTL Direction Handling Tests
  // ============================================================================
  describe("RTL direction handling", () => {
    it("should set direction to rtl when Arabic language is selected", async () => {
      mockHasResourceBundle.mockReturnValue(true);
      mockChangeLanguage.mockResolvedValue(undefined);

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      await waitFor(() => {
        expect(result.current.direction).toBe("rtl");
      });
    });

    it("should set direction to ltr when English language is selected", async () => {
      mockHasResourceBundle.mockReturnValue(true);
      mockChangeLanguage.mockResolvedValue(undefined);

      const { result } = renderHook(() => useLanguage(), { wrapper });

      // First set to Arabic
      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      await waitFor(() => {
        expect(result.current.direction).toBe("rtl");
      });

      // Then switch back to English
      await result.current.setLanguage(SUPPORTED_LANGUAGES.ENGLISH);

      await waitFor(() => {
        expect(result.current.direction).toBe("ltr");
      });
    });

    it("should update document.documentElement.dir to rtl for Arabic", async () => {
      mockHasResourceBundle.mockReturnValue(true);
      mockChangeLanguage.mockResolvedValue(undefined);

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      await waitFor(() => {
        expect(document.documentElement.dir).toBe("rtl");
      });
    });

    it("should update document.documentElement.lang to ar for Arabic", async () => {
      mockHasResourceBundle.mockReturnValue(true);
      mockChangeLanguage.mockResolvedValue(undefined);

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      await waitFor(() => {
        expect(document.documentElement.lang).toBe("ar");
      });
    });

    it("should update document.documentElement.dir to ltr for English", async () => {
      mockHasResourceBundle.mockReturnValue(true);
      mockChangeLanguage.mockResolvedValue(undefined);

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ENGLISH);

      await waitFor(() => {
        expect(document.documentElement.dir).toBe("ltr");
        expect(document.documentElement.lang).toBe("en");
      });
    });
  });

  // ============================================================================
  // Task 6.3: Error Handling Tests
  // ============================================================================
  describe("error handling", () => {
    it("should catch and log error when loadLanguageResources fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockHasResourceBundle.mockReturnValue(false);
      mockLoadLanguageResources.mockRejectedValue(new Error("Load failed"));

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to switch to language ar:",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it("should not update language state when loading fails", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      mockHasResourceBundle.mockReturnValue(false);
      mockLoadLanguageResources.mockRejectedValue(new Error("Load failed"));

      const { result } = renderHook(() => useLanguage(), { wrapper });

      const initialLanguage = result.current.language;

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      // Wait a bit to ensure state doesn't change
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Language should remain unchanged
      expect(result.current.language).toBe(initialLanguage);
    });

    it("should catch error when i18n.changeLanguage fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockHasResourceBundle.mockReturnValue(true);
      mockChangeLanguage.mockRejectedValue(new Error("Change language failed"));

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await result.current.setLanguage(SUPPORTED_LANGUAGES.ARABIC);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to switch to language ar:",
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  // ============================================================================
  // Task 6.4: useLanguage Hook Outside Provider Tests
  // ============================================================================
  describe("useLanguage hook", () => {
    it("should throw error when used outside LanguageProvider", () => {
      expect(() => {
        renderHook(() => useLanguage());
      }).toThrow("useLanguage must be used within a LanguageProvider");
    });

    it("should return context value when used inside LanguageProvider", () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.language).toBeDefined();
      expect(result.current.setLanguage).toBeDefined();
      expect(result.current.direction).toBeDefined();
    });
  });

  // ============================================================================
  // Additional Tests for Complete Coverage
  // ============================================================================
  describe("initialization", () => {
    it("should initialize with default language from localStorage", () => {
      localStorage.setItem("language", "ar");

      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.language).toBe("ar");
      expect(result.current.direction).toBe("rtl");
    });

    it("should initialize with default language when localStorage is empty", () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.language).toBe("en");
      expect(result.current.direction).toBe("ltr");
    });

    it("should set document attributes on mount", () => {
      renderHook(() => useLanguage(), { wrapper });

      expect(document.documentElement.dir).toBe("ltr");
      expect(document.documentElement.lang).toBe("en");
    });
  });
});
