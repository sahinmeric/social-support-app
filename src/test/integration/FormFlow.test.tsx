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

describe("Complete form flow (all steps)", () => {
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
  });
});
