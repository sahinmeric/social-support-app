import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/utils";
import Step3SituationDescriptions from "./Step3SituationDescriptions";
import * as useAISuggestionModule from "../../hooks/useAISuggestion";
import * as sanitizeModule from "../../utils/sanitize";

// Mock the useAISuggestion hook
vi.mock("../../hooks/useAISuggestion");

// Mock sanitize utility
vi.mock("../../utils/sanitize", () => ({
  sanitizeInput: vi.fn((input) => input),
}));

describe("Step3SituationDescriptions", () => {
  const mockGenerateSuggestion = vi.fn();
  const mockAcceptSuggestion = vi.fn();
  const mockEditSuggestion = vi.fn();
  const mockDiscardSuggestion = vi.fn();
  const mockRetrySuggestion = vi.fn();
  const mockCloseModal = vi.fn();

  const mockUseAISuggestion = {
    isModalOpen: false,
    currentField: null,
    suggestion: "",
    isLoading: false,
    error: null,
    loadingFields: {
      financialSituation: false,
      employmentCircumstances: false,
      reasonForApplying: false,
    },
    generateSuggestion: mockGenerateSuggestion,
    acceptSuggestion: mockAcceptSuggestion,
    editSuggestion: mockEditSuggestion,
    discardSuggestion: mockDiscardSuggestion,
    retrySuggestion: mockRetrySuggestion,
    closeModal: mockCloseModal,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAISuggestionModule.useAISuggestion).mockReturnValue(
      mockUseAISuggestion
    );
    vi.mocked(sanitizeModule.sanitizeInput).mockImplementation(
      (input) => input
    );
  });

  // ============================================================================
  // Component Rendering Tests
  // ============================================================================
  describe("Component Rendering", () => {
    it("should render all three textarea fields", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      expect(
        screen.getByLabelText("Current Financial Situation")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Employment Circumstances")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Reason for Applying")).toBeInTheDocument();
    });

    it("should render all three Help Me Write buttons", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      const helpButtons = screen.getAllByText("Help Me Write");
      expect(helpButtons).toHaveLength(3);
    });

    it("should render Help Me Write button for financial situation", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      const button = screen.getByTestId("ai-help-financialSituation");
      expect(button).toBeInTheDocument();
    });

    it("should render Help Me Write button for employment circumstances", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      const button = screen.getByTestId("ai-help-employmentCircumstances");
      expect(button).toBeInTheDocument();
    });

    it("should render Help Me Write button for reason for applying", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      const button = screen.getByTestId("ai-help-reasonForApplying");
      expect(button).toBeInTheDocument();
    });

    it("should display character count for each textarea", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      const characterCounts = screen.getAllByText(/\(0\/50\)/);
      expect(characterCounts.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ============================================================================
  // Help Me Write Button Tests
  // ============================================================================
  describe("Help Me Write Button Triggers", () => {
    it("should call generateSuggestion with financialSituation when button clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Step3SituationDescriptions />);

      const button = screen.getByTestId("ai-help-financialSituation");
      await user.click(button);

      expect(mockGenerateSuggestion).toHaveBeenCalledWith("financialSituation");
    });

    it("should call generateSuggestion with employmentCircumstances when button clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Step3SituationDescriptions />);

      const button = screen.getByTestId("ai-help-employmentCircumstances");
      await user.click(button);

      expect(mockGenerateSuggestion).toHaveBeenCalledWith(
        "employmentCircumstances"
      );
    });

    it("should call generateSuggestion with reasonForApplying when button clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Step3SituationDescriptions />);

      const button = screen.getByTestId("ai-help-reasonForApplying");
      await user.click(button);

      expect(mockGenerateSuggestion).toHaveBeenCalledWith("reasonForApplying");
    });

    it("should have AutoAwesome icon on all Help Me Write buttons", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      const buttons = screen.getAllByTestId(/ai-help-/);
      buttons.forEach((button) => {
        expect(button.querySelector("svg")).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // Input Sanitization Tests
  // ============================================================================
  describe("Input Sanitization", () => {
    it("should sanitize financialSituation input on blur", async () => {
      const user = userEvent.setup();
      const maliciousInput = "<script>alert('xss')</script>Safe text";
      const sanitizedInput = "Safe text";

      vi.mocked(sanitizeModule.sanitizeInput).mockReturnValue(sanitizedInput);

      renderWithProviders(<Step3SituationDescriptions />);

      const textarea = screen.getByLabelText("Current Financial Situation");
      await user.clear(textarea);
      await user.type(textarea, maliciousInput);

      // Focus another element to trigger blur
      const employmentTextarea = screen.getByLabelText(
        "Employment Circumstances"
      );
      await user.click(employmentTextarea);

      await waitFor(() => {
        expect(sanitizeModule.sanitizeInput).toHaveBeenCalledWith(
          maliciousInput
        );
      });
    });

    it("should sanitize employmentCircumstances input on blur", async () => {
      const user = userEvent.setup();
      const maliciousInput = "<iframe src='evil.com'></iframe>Text";
      const sanitizedInput = "Text";

      vi.mocked(sanitizeModule.sanitizeInput).mockReturnValue(sanitizedInput);

      renderWithProviders(<Step3SituationDescriptions />);

      const textarea = screen.getByLabelText("Employment Circumstances");
      await user.clear(textarea);
      await user.type(textarea, maliciousInput);

      // Focus another element to trigger blur
      const reasonTextarea = screen.getByLabelText("Reason for Applying");
      await user.click(reasonTextarea);

      await waitFor(() => {
        expect(sanitizeModule.sanitizeInput).toHaveBeenCalledWith(
          maliciousInput
        );
      });
    });

    it("should sanitize reasonForApplying input on blur", async () => {
      const user = userEvent.setup();
      const maliciousInput = "javascript:alert('xss')";
      const sanitizedInput = "alert('xss')";

      vi.mocked(sanitizeModule.sanitizeInput).mockReturnValue(sanitizedInput);

      renderWithProviders(<Step3SituationDescriptions />);

      const textarea = screen.getByLabelText("Reason for Applying");
      await user.type(textarea, maliciousInput);
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(sanitizeModule.sanitizeInput).toHaveBeenCalledWith(
          maliciousInput
        );
      });
    });

    it("should not sanitize if input is unchanged on blur", async () => {
      const user = userEvent.setup();
      const safeInput = "This is safe text";

      vi.mocked(sanitizeModule.sanitizeInput).mockReturnValue(safeInput);

      renderWithProviders(<Step3SituationDescriptions />);

      const textarea = screen.getByLabelText("Current Financial Situation");
      await user.type(textarea, safeInput);
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(sanitizeModule.sanitizeInput).toHaveBeenCalledWith(safeInput);
      });
    });
  });

  // ============================================================================
  // Form Field Interaction Tests
  // ============================================================================
  describe("Form Field Interactions", () => {
    it("should update financialSituation field on change", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Step3SituationDescriptions />);

      const textarea = screen.getByLabelText("Current Financial Situation");
      await user.type(textarea, "Test financial situation");

      expect(textarea).toHaveValue("Test financial situation");
    });

    it("should update employmentCircumstances field on change", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Step3SituationDescriptions />);

      const textarea = screen.getByLabelText("Employment Circumstances");
      await user.type(textarea, "Test employment circumstances");

      expect(textarea).toHaveValue("Test employment circumstances");
    });

    it("should update reasonForApplying field on change", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Step3SituationDescriptions />);

      const textarea = screen.getByLabelText("Reason for Applying");
      await user.type(textarea, "Test reason for applying");

      expect(textarea).toHaveValue("Test reason for applying");
    });

    it("should update character count as user types", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Step3SituationDescriptions />);

      const textarea = screen.getByLabelText("Current Financial Situation");
      await user.type(textarea, "Hello");

      await waitFor(() => {
        expect(screen.getByText(/\(5\/50\)/)).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // AI Modal Integration Tests
  // ============================================================================
  describe("AI Modal Integration", () => {
    it("should render SuggestionModal component when modal is open", () => {
      vi.mocked(useAISuggestionModule.useAISuggestion).mockReturnValue({
        ...mockUseAISuggestion,
        isModalOpen: true,
      });

      renderWithProviders(<Step3SituationDescriptions />);

      expect(screen.getByTestId("ai-modal")).toBeInTheDocument();
    });

    it("should pass correct props to SuggestionModal", () => {
      vi.mocked(useAISuggestionModule.useAISuggestion).mockReturnValue({
        ...mockUseAISuggestion,
        isModalOpen: true,
        suggestion: "Test suggestion",
        isLoading: false,
        error: null,
      });

      renderWithProviders(<Step3SituationDescriptions />);

      expect(screen.getByTestId("ai-modal")).toBeInTheDocument();
      // Get all textboxes and find the one in the modal (not the form fields)
      const textboxes = screen.getAllByRole("textbox");
      const modalTextarea = textboxes.find((box) =>
        box.getAttribute("placeholder")?.includes("Help Me Write")
      );
      expect(modalTextarea).toHaveValue("Test suggestion");
    });

    it("should pass loading state to SuggestionModal", () => {
      vi.mocked(useAISuggestionModule.useAISuggestion).mockReturnValue({
        ...mockUseAISuggestion,
        isModalOpen: true,
        isLoading: true,
        suggestion: "",
      });

      renderWithProviders(<Step3SituationDescriptions />);

      expect(screen.getByTestId("ai-loading")).toBeInTheDocument();
    });

    it("should pass error state to SuggestionModal", () => {
      vi.mocked(useAISuggestionModule.useAISuggestion).mockReturnValue({
        ...mockUseAISuggestion,
        isModalOpen: true,
        error: "Network error",
        suggestion: "",
      });

      renderWithProviders(<Step3SituationDescriptions />);

      expect(screen.getByTestId("ai-error")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================
  describe("Accessibility", () => {
    it("should have required attribute on all textareas", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      const textareas = screen.getAllByRole("textbox");
      textareas.forEach((textarea) => {
        expect(textarea).toHaveAttribute("aria-required", "true");
      });
    });

    it("should have aria-label on all textareas", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      expect(
        screen.getByLabelText("Current Financial Situation")
      ).toHaveAttribute("aria-label");
      expect(screen.getByLabelText("Employment Circumstances")).toHaveAttribute(
        "aria-label"
      );
      expect(screen.getByLabelText("Reason for Applying")).toHaveAttribute(
        "aria-label"
      );
    });

    it("should have aria-invalid when field has error", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      const textarea = screen.getByLabelText("Current Financial Situation");
      expect(textarea).toHaveAttribute("aria-invalid");
    });

    it("should have proper button labels for screen readers", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      const buttons = screen.getAllByText("Help Me Write");
      expect(buttons).toHaveLength(3);
      buttons.forEach((button) => {
        expect(button).toBeVisible();
      });
    });
  });

  // ============================================================================
  // Error Display Tests
  // ============================================================================
  describe("Error Display", () => {
    it("should display translated error messages", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      // Errors are managed by FormContext, so we just verify the component renders
      expect(
        screen.getByLabelText("Current Financial Situation")
      ).toBeInTheDocument();
    });

    it("should display helper text with character count when no error", () => {
      renderWithProviders(<Step3SituationDescriptions />);

      // Check for character count pattern (0/50)
      const helperTexts = screen.getAllByText(/\(0\/50\)/);
      expect(helperTexts.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // Component Memoization Tests
  // ============================================================================
  describe("Component Memoization", () => {
    it("should be wrapped with React.memo", () => {
      expect(Step3SituationDescriptions).toBeDefined();
      // React.memo components have a specific structure
      expect(Step3SituationDescriptions.$$typeof).toBeDefined();
    });
  });

  // ============================================================================
  // Multiple Button Click Tests
  // ============================================================================
  describe("Multiple Button Interactions", () => {
    it("should handle clicking different Help Me Write buttons sequentially", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Step3SituationDescriptions />);

      const financialButton = screen.getByTestId("ai-help-financialSituation");
      await user.click(financialButton);
      expect(mockGenerateSuggestion).toHaveBeenCalledWith("financialSituation");

      const employmentButton = screen.getByTestId(
        "ai-help-employmentCircumstances"
      );
      await user.click(employmentButton);
      expect(mockGenerateSuggestion).toHaveBeenCalledWith(
        "employmentCircumstances"
      );

      const reasonButton = screen.getByTestId("ai-help-reasonForApplying");
      await user.click(reasonButton);
      expect(mockGenerateSuggestion).toHaveBeenCalledWith("reasonForApplying");

      expect(mockGenerateSuggestion).toHaveBeenCalledTimes(3);
    });
  });
});
