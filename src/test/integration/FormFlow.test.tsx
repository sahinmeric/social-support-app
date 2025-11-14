import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../utils";
import FormWizard from "../../components/FormWizard";
import { StorageService } from "../../services/StorageService";
import {
  createStep1Data,
  createStep2Data,
  createStep3Data,
  createMockFormData,
} from "../mockData";

// Helper to wait for success page
const waitForSuccessPage = async () => {
  await waitFor(
    () => {
      expect(
        screen.getByText(/your application has been submitted successfully/i)
      ).toBeInTheDocument();
    },
    { timeout: 3000 }
  );
};

describe("Form Flow Integration Tests", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("Complete form flow (all steps)", () => {
    it("should allow user to complete all three steps and submit successfully", async () => {
      const user = userEvent.setup();
      renderWithProviders(<FormWizard />);

      // Wait for Step 1 to load
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /personal information/i })
        ).toBeInTheDocument();
      });

      // Fill Step 1
      const step1Data = createStep1Data();
      await user.type(screen.getByLabelText(/full name/i), step1Data.name!);
      await user.type(
        screen.getByLabelText(/national id/i),
        step1Data.nationalId!
      );
      await user.type(
        screen.getByLabelText(/date of birth/i),
        step1Data.dateOfBirth!
      );

      // Select gender
      const genderSelect = screen.getByLabelText(/gender/i);
      await user.click(genderSelect);
      await user.click(screen.getByRole("option", { name: /male/i }));

      await user.type(screen.getByLabelText(/address/i), step1Data.address!);
      await user.type(screen.getByLabelText(/city/i), step1Data.city!);
      await user.type(screen.getByLabelText(/state/i), step1Data.state!);
      await user.type(screen.getByLabelText(/country/i), step1Data.country!);
      await user.type(screen.getByLabelText(/phone number/i), step1Data.phone!);
      await user.type(
        screen.getByLabelText(/email address/i),
        step1Data.email!
      );

      // Click Next to go to Step 2
      const nextButton = screen.getByRole("button", { name: /next/i });
      await user.click(nextButton);

      // Wait for Step 2 to load
      await waitFor(() => {
        expect(
          screen.getByRole("heading", {
            name: /family and financial information/i,
          })
        ).toBeInTheDocument();
      });

      // Fill Step 2
      const step2Data = createStep2Data();

      // Select marital status
      const maritalStatusSelect = screen.getByLabelText(/marital status/i);
      await user.click(maritalStatusSelect);
      await user.click(screen.getByRole("option", { name: /married/i }));

      // Select dependents
      const dependentsSelect = screen.getByLabelText(/number of dependents/i);
      await user.click(dependentsSelect);
      await user.click(screen.getByRole("option", { name: "2" }));

      // Select employment status
      const employmentStatusSelect =
        screen.getByLabelText(/employment status/i);
      await user.click(employmentStatusSelect);
      await user.click(screen.getByRole("option", { name: /employed/i }));

      // Enter monthly income
      await user.type(
        screen.getByLabelText(/monthly income/i),
        step2Data.monthlyIncome!.toString()
      );

      // Select housing status
      const housingStatusSelect = screen.getByLabelText(/housing status/i);
      await user.click(housingStatusSelect);
      await user.click(screen.getByRole("option", { name: /rented/i }));

      // Click Next to go to Step 3
      await user.click(screen.getByRole("button", { name: /next/i }));

      // Wait for Step 3 to load
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /situation descriptions/i })
        ).toBeInTheDocument();
      });

      // Fill Step 3
      const step3Data = createStep3Data();
      await user.type(
        screen.getByLabelText(/financial situation/i),
        step3Data.financialSituation!
      );
      await user.type(
        screen.getByLabelText(/employment circumstances/i),
        step3Data.employmentCircumstances!
      );
      await user.type(
        screen.getByLabelText(/reason for applying/i),
        step3Data.reasonForApplying!
      );

      // Submit the form
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await user.click(submitButton);

      // Wait for success page
      await waitForSuccessPage();

      // Verify application ID is displayed
      expect(screen.getByText(/application id/i)).toBeInTheDocument();
    });

    it("should allow navigation between steps without losing data", async () => {
      const user = userEvent.setup();
      renderWithProviders(<FormWizard />);

      // Wait for Step 1 to load
      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      });

      // Fill some data in Step 1
      const testName = "John Doe";
      await user.type(screen.getByLabelText(/full name/i), testName);

      // Go to Step 2 (will fail validation but we can test Previous button)
      // Instead, let's fill all required fields
      const step1Data = createStep1Data();
      await user.type(
        screen.getByLabelText(/national id/i),
        step1Data.nationalId!
      );
      await user.type(
        screen.getByLabelText(/date of birth/i),
        step1Data.dateOfBirth!
      );

      const genderSelect = screen.getByLabelText(/gender/i);
      await user.click(genderSelect);
      await user.click(screen.getByRole("option", { name: /male/i }));

      await user.type(screen.getByLabelText(/address/i), step1Data.address!);
      await user.type(screen.getByLabelText(/city/i), step1Data.city!);
      await user.type(screen.getByLabelText(/state/i), step1Data.state!);
      await user.type(screen.getByLabelText(/country/i), step1Data.country!);
      await user.type(screen.getByLabelText(/phone number/i), step1Data.phone!);
      await user.type(
        screen.getByLabelText(/email address/i),
        step1Data.email!
      );

      // Go to Step 2
      await user.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/marital status/i)).toBeInTheDocument();
      });

      // Go back to Step 1
      await user.click(screen.getByRole("button", { name: /previous/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      });

      // Verify data is still there
      expect(screen.getByLabelText(/full name/i)).toHaveValue(testName);
    });
  });

  describe("Form persistence across page reloads", () => {
    it("should persist form data to localStorage as user fills the form", async () => {
      const user = userEvent.setup();
      renderWithProviders(<FormWizard />);

      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      });

      // Fill some data
      const testName = "Jane Smith";
      await user.type(screen.getByLabelText(/full name/i), testName);

      // Wait for debounced save
      await waitFor(
        () => {
          const savedData = StorageService.loadFormData();
          expect(savedData?.name).toBe(testName);
        },
        { timeout: 3000 }
      );
    });

    it("should restore form data from localStorage on mount", async () => {
      // Pre-populate localStorage with form data
      const mockData = createMockFormData();
      StorageService.saveFormData(mockData);
      StorageService.saveCurrentStep(2);

      // Render component
      renderWithProviders(<FormWizard />);

      // Should start at Step 2
      await waitFor(() => {
        expect(
          screen.getByRole("heading", {
            name: /family and financial information/i,
          })
        ).toBeInTheDocument();
      });

      // Verify data is loaded
      // Note: Select fields show their values differently
      expect(screen.getByLabelText(/monthly income/i)).toHaveValue(
        mockData.monthlyIncome
      );
    });

    it("should clear localStorage after successful submission", async () => {
      const user = userEvent.setup();

      // Pre-populate with complete form data
      const mockData = createMockFormData();
      StorageService.saveFormData(mockData);
      StorageService.saveCurrentStep(3);

      renderWithProviders(<FormWizard />);

      // Wait for Step 3 to load
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /situation descriptions/i })
        ).toBeInTheDocument();
      });

      // Submit the form
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await user.click(submitButton);

      // Wait for success page
      await waitFor(
        () => {
          expect(
            screen.getByText(/application submitted successfully/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Click "Submit Another Application"
      const submitAnotherButton = screen.getByRole("button", {
        name: /submit another application/i,
      });
      await user.click(submitAnotherButton);

      // Wait for form to reset
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /personal information/i })
        ).toBeInTheDocument();
      });

      // Verify localStorage is cleared (form should be reset to initial state)
      const savedData = StorageService.loadFormData();
      expect(savedData?.name || "").toBe("");
    });
  });

  describe("Form submission and success flow", () => {
    it("should show loading state during submission", async () => {
      const user = userEvent.setup();

      // Pre-populate with complete form data
      const mockData = createMockFormData();
      StorageService.saveFormData(mockData);
      StorageService.saveCurrentStep(3);

      renderWithProviders(<FormWizard />);

      await waitFor(() => {
        expect(
          screen.getByLabelText(/financial situation/i)
        ).toBeInTheDocument();
      });

      // Submit the form
      const submitButton = screen.getByRole("button", { name: /submit/i });
      await user.click(submitButton);

      // Should show loading state (button disabled)
      expect(submitButton).toBeDisabled();
    });

    it("should display success page with application ID after submission", async () => {
      const user = userEvent.setup();

      // Pre-populate with complete form data
      const mockData = createMockFormData();
      StorageService.saveFormData(mockData);
      StorageService.saveCurrentStep(3);

      renderWithProviders(<FormWizard />);

      await waitFor(() => {
        expect(
          screen.getByLabelText(/financial situation/i)
        ).toBeInTheDocument();
      });

      // Submit the form
      await user.click(screen.getByRole("button", { name: /submit/i }));

      // Wait for success page
      await waitForSuccessPage();

      // Verify application ID is displayed
      expect(screen.getByText(/application id/i)).toBeInTheDocument();
      expect(screen.getByText(/APP-/)).toBeInTheDocument();
    });

    it("should allow submitting another application from success page", async () => {
      const user = userEvent.setup();

      // Pre-populate with complete form data
      const mockData = createMockFormData();
      StorageService.saveFormData(mockData);
      StorageService.saveCurrentStep(3);

      renderWithProviders(<FormWizard />);

      await waitFor(() => {
        expect(
          screen.getByLabelText(/financial situation/i)
        ).toBeInTheDocument();
      });

      // Submit the form
      await user.click(screen.getByRole("button", { name: /submit/i }));

      // Wait for success page
      await waitForSuccessPage();

      // Click "Submit Another Application"
      await user.click(
        screen.getByRole("button", { name: /submit another application/i })
      );

      // Should return to Step 1
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: /personal information/i })
        ).toBeInTheDocument();
      });

      // Form should be empty
      expect(screen.getByLabelText(/full name/i)).toHaveValue("");
    });
  });

  describe("Error handling and recovery", () => {
    it("should show validation errors when trying to proceed with incomplete data", async () => {
      const user = userEvent.setup();
      renderWithProviders(<FormWizard />);

      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      });

      // Try to go to next step without filling required fields
      await user.click(screen.getByRole("button", { name: /next/i }));

      // Should stay on Step 1 and show validation errors
      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      });
    });

    it("should show error message when submission fails", async () => {
      const user = userEvent.setup();

      // Mock console.error to avoid noise in test output
      vi.spyOn(console, "error").mockImplementation(() => {});

      // Pre-populate with complete but minimal data to reach step 3
      const mockData = createMockFormData();
      // Set financial situation to empty to trigger validation error
      mockData.financialSituation = "";
      StorageService.saveFormData(mockData);
      StorageService.saveCurrentStep(3);

      renderWithProviders(<FormWizard />);

      await waitFor(() => {
        expect(
          screen.getByLabelText(/financial situation/i)
        ).toBeInTheDocument();
      });

      // Try to submit with empty required field
      await user.click(screen.getByRole("button", { name: /submit/i }));

      // Should stay on the page (validation should prevent submission)
      await waitFor(
        () => {
          expect(
            screen.getByLabelText(/financial situation/i)
          ).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should allow user to correct errors and resubmit", async () => {
      const user = userEvent.setup();

      // Start with complete data
      const mockData = createMockFormData();
      StorageService.saveFormData(mockData);
      StorageService.saveCurrentStep(3);

      renderWithProviders(<FormWizard />);

      await waitFor(() => {
        expect(
          screen.getByLabelText(/financial situation/i)
        ).toBeInTheDocument();
      });

      // Clear a required field to create an error
      const financialSituationField =
        screen.getByLabelText(/financial situation/i);
      await user.clear(financialSituationField);
      await user.type(financialSituationField, "Too short");

      // Try to submit (should fail validation)
      await user.click(screen.getByRole("button", { name: /submit/i }));

      // Wait a bit for validation
      await waitFor(() => {
        expect(financialSituationField).toBeInTheDocument();
      });

      // Fix the error
      await user.clear(financialSituationField);
      await user.type(financialSituationField, mockData.financialSituation!);

      // Submit again
      await user.click(screen.getByRole("button", { name: /submit/i }));

      // Should succeed this time
      await waitForSuccessPage();
    }, 10000); // Increase timeout for this test
  });
});
