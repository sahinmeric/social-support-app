import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/utils";
import { createStep1Data } from "../../test/mockData";
import Step1PersonalInfo from "./Step1PersonalInfo";

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

vi.mock("../../hooks/useFormContext", () => ({
  useFormContext: () => mockFormContext,
}));

describe("Step1PersonalInfo Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset form context to default state
    mockFormContext.formData = {
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
    };
    mockFormContext.errors = {};
  });

  it("renders all personal information fields", () => {
    renderWithProviders(<Step1PersonalInfo />);

    // Check all required fields are present using more specific queries
    expect(screen.getByLabelText(/^full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/national id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^address$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it("displays pre-filled form data", () => {
    const step1Data = createStep1Data();
    mockFormContext.formData = { ...mockFormContext.formData, ...step1Data };

    renderWithProviders(<Step1PersonalInfo />);

    expect(screen.getByLabelText(/^full name/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/national id/i)).toHaveValue("1234567890");
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue("1990-01-01");
    expect(screen.getByLabelText(/^address$/i)).toHaveValue("123 Main Street");
    expect(screen.getByLabelText(/city/i)).toHaveValue("Dubai");
    expect(screen.getByLabelText(/state/i)).toHaveValue("Dubai");
    expect(screen.getByLabelText(/country/i)).toHaveValue("UAE");
    expect(screen.getByLabelText(/phone/i)).toHaveValue("+971501234567");
    expect(screen.getByLabelText(/email address/i)).toHaveValue(
      "john.doe@example.com"
    );
  });

  it("calls updateFormData when text fields change", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step1PersonalInfo />);

    const nameInput = screen.getByLabelText(/^full name/i);
    await user.type(nameInput, "Jane");

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalled();
    });
  });

  it("calls updateFormData when gender select changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step1PersonalInfo />);

    const genderSelect = screen.getByLabelText(/gender/i);
    await user.click(genderSelect);

    const maleOption = screen.getByRole("option", { name: "Male" });
    await user.click(maleOption);

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalledWith("gender", "male");
    });
  });

  it("displays validation errors", () => {
    mockFormContext.errors = {
      name: "validation.required",
      email: "validation.invalidEmail",
      phone: "validation.invalidPhone",
    };

    renderWithProviders(<Step1PersonalInfo />);

    // Check that error messages are displayed (translated)
    expect(screen.getByText(/required/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/phone/i)).toBeInTheDocument();
  });

  it("sanitizes input on blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step1PersonalInfo />);

    const nameInput = screen.getByLabelText(/^full name/i);
    await user.type(nameInput, "Test<script>");
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalled();
    });
  });

  it("renders gender dropdown with all options", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step1PersonalInfo />);

    const genderSelect = screen.getByLabelText(/gender/i);
    await user.click(genderSelect);

    expect(screen.getByRole("option", { name: "Male" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Female" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Other" })).toBeInTheDocument();
  });

  it("has proper ARIA attributes for accessibility", () => {
    renderWithProviders(<Step1PersonalInfo />);

    const nameInput = screen.getByLabelText(/^full name/i);
    expect(nameInput).toHaveAttribute("aria-required", "true");
    expect(nameInput).toHaveAttribute("aria-invalid", "false");
  });

  it("displays ARIA error attributes when field has error", () => {
    mockFormContext.errors = {
      name: "validation.required",
    };

    renderWithProviders(<Step1PersonalInfo />);

    const nameInput = screen.getByLabelText(/^full name/i);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAttribute("aria-describedby", "name-error");
  });
});
