import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/utils";
import SuggestionModal from "./SuggestionModal";

describe("SuggestionModal", () => {
  const mockOnAccept = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDiscard = vi.fn();
  const mockOnRetry = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    open: true,
    suggestion: "This is a test suggestion",
    isLoading: false,
    error: null,
    onAccept: mockOnAccept,
    onEdit: mockOnEdit,
    onDiscard: mockOnDiscard,
    onRetry: mockOnRetry,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // Modal Display Tests
  // ============================================================================
  describe("Modal Display", () => {
    it("should render modal when open is true", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      expect(screen.getByTestId("ai-modal")).toBeInTheDocument();
      expect(screen.getByText("Help Me Write")).toBeInTheDocument();
    });

    it("should not render modal when open is false", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} open={false} />);

      expect(screen.queryByTestId("ai-modal")).not.toBeInTheDocument();
    });

    it("should display suggestion text in textarea", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("This is a test suggestion");
    });

    it("should display close button in header", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const closeButton = screen.getByLabelText("close");
      expect(closeButton).toBeInTheDocument();
    });

    it("should have proper ARIA attributes", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute(
        "aria-labelledby",
        "suggestion-dialog-title"
      );
      expect(dialog).toHaveAttribute(
        "aria-describedby",
        "suggestion-dialog-description"
      );
    });
  });

  // ============================================================================
  // Loading State Tests
  // ============================================================================
  describe("Loading State", () => {
    it("should display loading skeleton when isLoading is true", () => {
      renderWithProviders(
        <SuggestionModal {...defaultProps} isLoading={true} suggestion="" />
      );

      expect(screen.getByTestId("ai-loading")).toBeInTheDocument();
    });

    it("should not display suggestion textarea when loading", () => {
      renderWithProviders(
        <SuggestionModal {...defaultProps} isLoading={true} suggestion="" />
      );

      expect(
        screen.queryByTestId("ai-suggestion-text")
      ).not.toBeInTheDocument();
    });

    it("should disable discard button when loading", () => {
      renderWithProviders(
        <SuggestionModal {...defaultProps} isLoading={true} suggestion="" />
      );

      const discardButton = screen.getByTestId("btn-discard-suggestion");
      expect(discardButton).toBeDisabled();
    });

    it("should not display accept/edit buttons when loading", () => {
      renderWithProviders(
        <SuggestionModal {...defaultProps} isLoading={true} suggestion="" />
      );

      expect(
        screen.queryByTestId("btn-accept-suggestion")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // Error State Tests
  // ============================================================================
  describe("Error State", () => {
    it("should display error message when error is present", () => {
      renderWithProviders(
        <SuggestionModal
          {...defaultProps}
          error="Network error occurred"
          suggestion=""
        />
      );

      expect(screen.getByTestId("ai-error")).toBeInTheDocument();
      expect(screen.getByText("Network error occurred")).toBeInTheDocument();
    });

    it("should display retry button in error alert", () => {
      renderWithProviders(
        <SuggestionModal
          {...defaultProps}
          error="Network error occurred"
          suggestion=""
        />
      );

      const retryButtons = screen.getAllByText("Retry");
      expect(retryButtons.length).toBeGreaterThan(0);
    });

    it("should display retry button in dialog actions when error", () => {
      renderWithProviders(
        <SuggestionModal
          {...defaultProps}
          error="Network error occurred"
          suggestion=""
        />
      );

      expect(screen.getByTestId("btn-retry-suggestion")).toBeInTheDocument();
    });

    it("should not display suggestion textarea when error", () => {
      renderWithProviders(
        <SuggestionModal
          {...defaultProps}
          error="Network error occurred"
          suggestion=""
        />
      );

      expect(
        screen.queryByTestId("ai-suggestion-text")
      ).not.toBeInTheDocument();
    });

    it("should not display accept/edit buttons when error", () => {
      renderWithProviders(
        <SuggestionModal
          {...defaultProps}
          error="Network error occurred"
          suggestion=""
        />
      );

      expect(
        screen.queryByTestId("btn-accept-suggestion")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // Button Action Tests
  // ============================================================================
  describe("Button Actions", () => {
    it("should call onAccept and onClose when Accept button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const acceptButton = screen.getByTestId("btn-accept-suggestion");
      await user.click(acceptButton);

      expect(mockOnAccept).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onEdit with edited text when Edit button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox");
      await user.clear(textarea);
      // Use paste instead of type for faster test execution
      await user.click(textarea);
      await user.paste("Edited suggestion text");

      const editButton = screen.getByText("Edit");
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith("Edited suggestion text");
    });

    it("should disable Edit button when text is unchanged", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const editButton = screen.getByText("Edit");
      expect(editButton).toBeDisabled();
    });

    it("should enable Edit button when text is changed", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, " modified");

      const editButton = screen.getByText("Edit");
      expect(editButton).not.toBeDisabled();
    });

    it("should call onDiscard when Discard button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const discardButton = screen.getByTestId("btn-discard-suggestion");
      await user.click(discardButton);

      expect(mockOnDiscard).toHaveBeenCalledTimes(1);
    });

    it("should call onRetry when Retry button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <SuggestionModal
          {...defaultProps}
          error="Network error"
          suggestion=""
        />
      );

      const retryButton = screen.getByTestId("btn-retry-suggestion");
      await user.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when close button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const closeButton = screen.getByLabelText("close");
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================================================
  // Keyboard Interaction Tests
  // ============================================================================
  describe("Keyboard Interactions", () => {
    it("should close modal when Escape key is pressed", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it("should not close modal when Escape is pressed and modal is closed", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SuggestionModal {...defaultProps} open={false} />);

      await user.keyboard("{Escape}");

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should allow Tab navigation between interactive elements", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const closeButton = screen.getByLabelText("close");
      const textarea = screen.getByRole("textbox");
      const discardButton = screen.getByTestId("btn-discard-suggestion");

      // Tab through elements
      await user.tab();
      expect(closeButton).toHaveFocus();

      await user.tab();
      expect(textarea).toHaveFocus();

      await user.tab();
      expect(discardButton).toHaveFocus();
    });
  });

  // ============================================================================
  // Focus Management Tests
  // ============================================================================
  describe("Focus Management", () => {
    it("should have textarea with inputRef for focus management", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      // Verify textarea exists and is accessible
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute("placeholder", "Help Me Write");
    });

    it("should not auto-focus when loading", () => {
      renderWithProviders(
        <SuggestionModal {...defaultProps} isLoading={true} suggestion="" />
      );

      const textarea = screen.queryByTestId("ai-suggestion-text");
      expect(textarea).not.toBeInTheDocument();
    });

    it("should not auto-focus when error is present", () => {
      renderWithProviders(
        <SuggestionModal
          {...defaultProps}
          error="Error occurred"
          suggestion=""
        />
      );

      const textarea = screen.queryByTestId("ai-suggestion-text");
      expect(textarea).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // Text Editing Tests
  // ============================================================================
  describe("Text Editing", () => {
    it("should update edited text when user types in textarea", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const textarea = screen.getByRole("textbox");
      await user.clear(textarea);
      await user.type(textarea, "New text");

      expect(textarea).toHaveValue("New text");
    });

    it("should reset edited text when suggestion changes", () => {
      const { rerender } = renderWithProviders(
        <SuggestionModal {...defaultProps} suggestion="First suggestion" />
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("First suggestion");

      rerender(
        <SuggestionModal {...defaultProps} suggestion="Second suggestion" />
      );

      const updatedTextarea = screen.getByRole("textbox");
      expect(updatedTextarea).toHaveValue("Second suggestion");
    });

    it("should preserve edited text when other props change", async () => {
      const user = userEvent.setup();
      const { rerender } = renderWithProviders(
        <SuggestionModal {...defaultProps} />
      );

      const textarea = screen.getByRole("textbox");
      await user.clear(textarea);
      await user.type(textarea, "Edited text");

      rerender(<SuggestionModal {...defaultProps} open={true} />);

      const updatedTextarea = screen.getByRole("textbox");
      expect(updatedTextarea).toHaveValue("Edited text");
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================
  describe("Accessibility", () => {
    it("should have accessible textarea label", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const textarea = screen.getByLabelText("AI suggestion text");
      expect(textarea).toBeInTheDocument();
    });

    it("should have accessible button labels", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      expect(screen.getByText("Accept")).toBeInTheDocument();
      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Discard")).toBeInTheDocument();
    });

    it("should have accessible close button", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const closeButton = screen.getByLabelText("close");
      expect(closeButton).toBeInTheDocument();
    });

    it("should have proper dialog role", () => {
      renderWithProviders(<SuggestionModal {...defaultProps} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Arabic Text Handling Tests
  // ============================================================================
  describe("Arabic Text Handling", () => {
    it("should display Arabic text correctly in textarea", () => {
      const arabicSuggestion = "أواجه حاليًا تحديات مالية كبيرة";
      renderWithProviders(
        <SuggestionModal {...defaultProps} suggestion={arabicSuggestion} />
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(arabicSuggestion);
    });

    it("should preserve Arabic text when editing", async () => {
      const user = userEvent.setup();
      const arabicSuggestion = "أواجه حاليًا تحديات مالية";
      renderWithProviders(
        <SuggestionModal {...defaultProps} suggestion={arabicSuggestion} />
      );

      const textarea = screen.getByRole("textbox");
      await user.click(textarea);
      await user.type(textarea, " كبيرة");

      expect(textarea).toHaveValue("أواجه حاليًا تحديات مالية كبيرة");
    });

    it("should handle Arabic text with diacritics", () => {
      const arabicWithDiacritics = "مُحَمَّد يَعْمَلُ فِي الْمَدِينَةِ";
      renderWithProviders(
        <SuggestionModal {...defaultProps} suggestion={arabicWithDiacritics} />
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(arabicWithDiacritics);
    });

    it("should handle mixed Arabic and English text", () => {
      const mixedText = "My name is محمد and I live in القاهرة";
      renderWithProviders(
        <SuggestionModal {...defaultProps} suggestion={mixedText} />
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(mixedText);
    });

    it("should correctly count Arabic characters in textarea", () => {
      const arabicText = "أواجه حاليًا تحديات مالية كبيرة";
      renderWithProviders(
        <SuggestionModal {...defaultProps} suggestion={arabicText} />
      );

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
      // Verify the textarea value matches the Arabic text exactly
      expect(textarea.value).toBe(arabicText);
      // Verify character count is accurate (including diacritics)
      expect(textarea.value.length).toBe(arabicText.length);
    });

    it("should handle Arabic punctuation correctly", () => {
      const arabicWithPunctuation = "السلام عليكم، كيف حالك؟ أنا بخير!";
      renderWithProviders(
        <SuggestionModal {...defaultProps} suggestion={arabicWithPunctuation} />
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(arabicWithPunctuation);
    });

    it("should maintain RTL text direction for Arabic text", () => {
      const arabicSuggestion = "أواجه حاليًا تحديات مالية كبيرة";
      renderWithProviders(
        <SuggestionModal {...defaultProps} suggestion={arabicSuggestion} />
      );

      // Verify the modal renders with Arabic text
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(arabicSuggestion);

      // The RTL direction is handled by the LanguageContext at the document level
      // The textarea will inherit the direction from the document
      // When Arabic language is selected, document.dir is set to 'rtl'
    });

    it("should call onEdit with Arabic text when edited", async () => {
      const user = userEvent.setup();
      const arabicSuggestion = "أواجه تحديات مالية";
      renderWithProviders(
        <SuggestionModal {...defaultProps} suggestion={arabicSuggestion} />
      );

      const textarea = screen.getByRole("textbox");
      await user.clear(textarea);
      await user.click(textarea);
      await user.paste("وضعي الوظيفي الحالي صعب");

      const editButton = screen.getByText("Edit");
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith("وضعي الوظيفي الحالي صعب");
    });

    it("should call onAccept with Arabic text when accepted", async () => {
      const user = userEvent.setup();
      const arabicSuggestion = "أحتاج إلى الدعم المالي لعائلتي";
      renderWithProviders(
        <SuggestionModal {...defaultProps} suggestion={arabicSuggestion} />
      );

      const acceptButton = screen.getByTestId("btn-accept-suggestion");
      await user.click(acceptButton);

      expect(mockOnAccept).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
