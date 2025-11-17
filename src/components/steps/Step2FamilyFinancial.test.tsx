import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/utils";
import { createStep2Data } from "../../test/mockData";
import Step2FamilyFinancial from "./Step2FamilyFinancial";

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

describe("Step2FamilyFinancial Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all family and financial fields", () => {
    renderWithProviders(<Step2FamilyFinancial />);

    // Check all required fields are present
    expect(screen.getByLabelText(/marital status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dependents/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/employment status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monthly income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/currency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/housing status/i)).toBeInTheDocument();
  });

  it("displays pre-filled form data", () => {
    const step2Data = createStep2Data();
    mockFormContext.formData = {
      ...mockFormContext.formData,
      ...step2Data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    renderWithProviders(<Step2FamilyFinancial />);

    expect(screen.getByLabelText(/marital status/i)).toHaveTextContent(
      /married/i
    );
    expect(screen.getByLabelText(/dependents/i)).toHaveTextContent("2");
    expect(screen.getByLabelText(/employment status/i)).toHaveTextContent(
      /employed/i
    );
    expect(screen.getByLabelText(/monthly income/i)).toHaveValue(5000);
    expect(screen.getByLabelText(/currency/i)).toHaveTextContent(/AED/i);
    expect(screen.getByLabelText(/housing status/i)).toHaveTextContent(
      /rented/i
    );
  });

  it("calls updateFormData when marital status changes", async () => {
    const user = userEvent.setup();
    mockFormContext.formData = {
      ...mockFormContext.formData,
      maritalStatus: "", // Start with empty to test selection
    };
    renderWithProviders(<Step2FamilyFinancial />);

    const maritalStatusSelect = screen.getByLabelText(/marital status/i);
    await user.click(maritalStatusSelect);

    const marriedOption = screen.getByRole("option", { name: /married/i });
    await user.click(marriedOption);

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalledWith(
        "maritalStatus",
        "married"
      );
    });
  });

  it("calls updateFormData when dependents changes", async () => {
    const user = userEvent.setup();
    mockFormContext.formData = {
      ...mockFormContext.formData,
      dependents: "", // Start with empty to test selection
    };
    renderWithProviders(<Step2FamilyFinancial />);

    const dependentsSelect = screen.getByLabelText(/dependents/i);
    await user.click(dependentsSelect);

    const option2 = screen.getByRole("option", { name: "2" });
    await user.click(option2);

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalledWith("dependents", 2);
    });
  });

  it("calls updateFormData when employment status changes", async () => {
    const user = userEvent.setup();
    mockFormContext.formData = {
      ...mockFormContext.formData,
      employmentStatus: "", // Start with empty to test selection
    };
    renderWithProviders(<Step2FamilyFinancial />);

    const employmentStatusSelect = screen.getByLabelText(/employment status/i);
    await user.click(employmentStatusSelect);

    const employedOption = screen.getByRole("option", {
      name: /^employed$/i,
    });
    await user.click(employedOption);

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalledWith(
        "employmentStatus",
        "employed"
      );
    });
  });

  it("calls updateFormData when monthly income changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step2FamilyFinancial />);

    const incomeInput = screen.getByLabelText(/monthly income/i);
    await user.type(incomeInput, "5000");

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalled();
    });
  });

  it("calls updateFormData when currency changes", async () => {
    const user = userEvent.setup();
    mockFormContext.formData = {
      ...mockFormContext.formData,
      currency: "USD", // Start with USD to test changing to AED
    };
    renderWithProviders(<Step2FamilyFinancial />);

    const currencySelect = screen.getByLabelText(/currency/i);
    await user.click(currencySelect);

    const aedOption = screen.getByRole("option", { name: /AED \(د\.إ\)/i });
    await user.click(aedOption);

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalledWith("currency", "AED");
    });
  });

  it("calls updateFormData when housing status changes", async () => {
    const user = userEvent.setup();
    mockFormContext.formData = {
      ...mockFormContext.formData,
      housingStatus: "", // Start with empty to test selection
    };
    renderWithProviders(<Step2FamilyFinancial />);

    const housingStatusSelect = screen.getByLabelText(/housing status/i);
    await user.click(housingStatusSelect);

    const rentedOption = screen.getByRole("option", { name: /rented/i });
    await user.click(rentedOption);

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalledWith(
        "housingStatus",
        "rented"
      );
    });
  });

  it("displays validation errors", () => {
    mockFormContext.errors = {
      maritalStatus: "validation.required",
      dependents: "validation.required",
      monthlyIncome: "validation.nonNegative",
    };

    renderWithProviders(<Step2FamilyFinancial />);

    const errorMessages = screen.getAllByText(/required|non-negative/i);
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it("renders marital status dropdown with all options", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step2FamilyFinancial />);

    const maritalStatusSelect = screen.getByLabelText(/marital status/i);
    await user.click(maritalStatusSelect);

    expect(screen.getByRole("option", { name: /single/i })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /married/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /divorced/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /widowed/i })
    ).toBeInTheDocument();
  });

  it("renders employment status dropdown with all options", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step2FamilyFinancial />);

    const employmentStatusSelect = screen.getByLabelText(/employment status/i);
    await user.click(employmentStatusSelect);

    const options = screen.getAllByRole("option");
    const optionTexts = options.map((opt) => opt.textContent);

    expect(optionTexts).toContain("Employed");
    expect(optionTexts).toContain("Unemployed");
    expect(optionTexts).toContain("Self-Employed");
    expect(optionTexts).toContain("Retired");
  });

  it("renders housing status dropdown with all options", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step2FamilyFinancial />);

    const housingStatusSelect = screen.getByLabelText(/housing status/i);
    await user.click(housingStatusSelect);

    expect(screen.getByRole("option", { name: /owned/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /rented/i })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /homeless/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /other/i })).toBeInTheDocument();
  });

  it("renders dependents dropdown with numbers 0-10", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step2FamilyFinancial />);

    const dependentsSelect = screen.getByLabelText(/dependents/i);
    await user.click(dependentsSelect);

    // Check for a few key numbers
    expect(screen.getByRole("option", { name: "0" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "5" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();
  });

  it("converts numeric input to number type", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Step2FamilyFinancial />);

    const incomeInput = screen.getByLabelText(/monthly income/i);
    await user.type(incomeInput, "1000");

    await waitFor(() => {
      expect(mockUpdateFormData).toHaveBeenCalled();
      // Verify that the value is converted to a number
      const calls = mockUpdateFormData.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(typeof lastCall[1]).toBe("number");
    });
  });

  it("has proper ARIA attributes for accessibility", () => {
    renderWithProviders(<Step2FamilyFinancial />);

    const maritalStatusSelect = screen.getByLabelText(/marital status/i);
    expect(maritalStatusSelect).toHaveAttribute("aria-required", "true");
  });
});
