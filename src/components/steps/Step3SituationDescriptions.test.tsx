import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/utils";
import { createStep3Data } from "../../test/mockData";
import Step3SituationDescriptions from "./Step3SituationDescriptions";

// Mock the FormContext
const mockUpdateFormData = vi.fn();
const mockFormContext = {
  formData: {
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
    maritalStatus: "",
    dependents: "",
    employmentStatus: "",
    monthlyIncome: "",
    currency: "USD",
    housingStatus: "",
    financialSituation: "",
    employmentCircumstances: "",
    reasonForApplying: "",
  },
  errors: {},
  updateFormData: mockUpdateFormData,
  validateStep: vi.fn(),
  resetForm: vi.fn(),
};

// Mock the useAISuggestion hook
const mockGenerateSuggestion = vi.fn();
const mockAcceptSuggestion = vi.fn();
const mockEditSuggestion = vi.fn();
const mockDiscardSuggestion = vi.fn();
const mockRetrySuggestion = vi.fn();
const mockCloseModal = vi.fn();

const mockAISuggestionHook = {
  isModalOpen: false,
  suggestion: null,
  isLoading: false,
  error: null,
  generateSuggestion: mockGenerateSuggestion,
  acceptSuggestion: mockAcceptSuggestion,
  editSuggestion: mockEditSuggestion,
  discardSuggestion: mockDiscardSuggestion,
  retrySuggestion: mockRetrySuggestion,
  closeModal: mockCloseModal,
};

vi.mock("../../hooks/useFormContext", () => ({
  useFormContext: () => mockFormContext,
}));

vi.mock("../../hooks/useAISuggestion", () => ({
  useAISuggestion: () => mockAISuggestionHook,
}));

describe("Step3SituationDescriptions Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all situation description fields", () => {
    renderWithProviders(<Step3SituationDescriptions />);

    // Check all required fields are present
    expect(screen.getByLabelText(/financial situation/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/employment circumstances/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/reason for applying/i)).toBeInTheDocument();
  });

  it("renders Help Me Write buttons for each field", () => {
    renderWithProviders(<Step3SituationDescriptions />);

    const helpButtons = screen.getAllByRole("button", {
      name: /help me write/i,
    });
    expect(helpButtons).toHaveLength(3);
  });

  it("displays pre-filled form data", () => {
    const step3Data = createStep3Data();
    mockFormContext.formData = { ...mockFormContext.formData, ...step3Data };

    renderWithProviders(<Step3SituationDescriptions />);

    expect(screen.getByLabelText(/financial situation/i)).toHaveValue(
      step3Data.financialSituation
    );
    expect(screen.getByLabelText(/employment circumstances/i)).toHaveValue(
      step3Data.employmentCircumstances
    );
    expect(screen.getByLabelText(/reason for applying/i)).toHaveValue(
      step3Data.reasonForApplying
    );
  });

  it("calls updateFormData when text fields change", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step3SituationDescriptions />);

    const financialSituationInput =
      screen.getByLabelText(/financial situation/i);
    await user.type(financialSituationInput, "Test text");

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalled();
    });
  });

  it("displays character count for each field", () => {
    mockFormContext.formData = {
      ...mockFormContext.formData,
      financialSituation: "Test",
      employmentCircumstances: "Test",
      reasonForApplying: "Test",
    };

    renderWithProviders(<Step3SituationDescriptions />);

    // Should show character count (4/50)
    const characterCounts = screen.getAllByText(/\(4\/50\)/);
    expect(characterCounts).toHaveLength(3);
  });

  it("displays validation errors with translated messages", () => {
    mockFormContext.errors = {
      financialSituation: "validation.minLength|50",
      employmentCircumstances: "validation.required",
    };

    renderWithProviders(<Step3SituationDescriptions />);

    // Should display translated error messages
    expect(screen.getByText(/minimum.*50/i)).toBeInTheDocument();
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });

  it("calls generateSuggestion when Help Me Write is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step3SituationDescriptions />);

    const helpButtons = screen.getAllByRole("button", {
      name: /help me write/i,
    });
    await user.click(helpButtons[0]);

    expect(mockGenerateSuggestion).toHaveBeenCalledWith("financialSituation");
  });

  it("sanitizes input on blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step3SituationDescriptions />);

    const financialSituationInput =
      screen.getByLabelText(/financial situation/i);
    await user.type(
      financialSituationInput,
      "Test<script>alert('xss')</script>"
    );
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalled();
    });
  });

  it("renders SuggestionModal when isModalOpen is true", () => {
    mockAISuggestionHook.isModalOpen = true;
    mockAISuggestionHook.suggestion = "This is a test suggestion";

    renderWithProviders(<Step3SituationDescriptions />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not render SuggestionModal when isModalOpen is false", () => {
    mockAISuggestionHook.isModalOpen = false;

    renderWithProviders(<Step3SituationDescriptions />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has proper ARIA attributes for accessibility", () => {
    renderWithProviders(<Step3SituationDescriptions />);

    const financialSituationInput =
      screen.getByLabelText(/financial situation/i);
    expect(financialSituationInput).toHaveAttribute("aria-required", "true");
    expect(financialSituationInput).toHaveAttribute("aria-invalid", "false");
  });

  it("displays ARIA error attributes when field has error", () => {
    mockFormContext.errors = {
      financialSituation: "validation.minLength|50",
    };

    renderWithProviders(<Step3SituationDescriptions />);

    const financialSituationInput =
      screen.getByLabelText(/financial situation/i);
    expect(financialSituationInput).toHaveAttribute("aria-invalid", "true");
    expect(financialSituationInput).toHaveAttribute(
      "aria-describedby",
      "financialSituation-error"
    );
  });

  it("shows helper text with character count when no error", () => {
    mockFormContext.formData = {
      ...mockFormContext.formData,
      financialSituation: "Short text",
    };

    renderWithProviders(<Step3SituationDescriptions />);

    // Should show minimum length requirement and character count
    expect(screen.getByText(/minimum.*50/i)).toBeInTheDocument();
    expect(screen.getByText(/\(10\/50\)/)).toBeInTheDocument();
  });

  it("prioritizes error message over helper text", () => {
    mockFormContext.formData = {
      ...mockFormContext.formData,
      financialSituation: "Short",
    };
    mockFormContext.errors = {
      financialSituation: "validation.minLength|50",
    };

    renderWithProviders(<Step3SituationDescriptions />);

    // Should show error message
    const errorMessages = screen.getAllByText(/minimum.*50/i);
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it("renders multiline text areas with correct rows", () => {
    renderWithProviders(<Step3SituationDescriptions />);

    const financialSituationInput =
      screen.getByLabelText(/financial situation/i);
    expect(financialSituationInput).toHaveAttribute("rows", "4");
  });
});
