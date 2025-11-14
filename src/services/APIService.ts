import type { ApplicationFormData } from "../types/form.types";
import type { SubmissionResponse } from "../types/api.types";
import { APP_CONFIG, MIN_TEXT_LENGTH } from "../constants";
import { sanitizeFormData } from "../utils/sanitize";
import { PerformanceMonitor } from "../utils/performance";

/**
 * Service for submitting application data to the backend
 */
export class APIService {
  // API endpoint for production use (currently using mock implementation)
  // Reserved for future use when implementing real API calls
  // private static readonly API_URL =
  //   import.meta.env.VITE_API_URL || API_ENDPOINTS.SUBMIT_APPLICATION;

  /**
   * Submit application to the backend
   * Currently uses a mock implementation with 1-2 second delay
   * Performance monitored for optimization tracking
   */
  static async submitApplication(
    data: ApplicationFormData
  ): Promise<SubmissionResponse> {
    return PerformanceMonitor.measureAsync("Form Submission", async () => {
      try {
        // Sanitize form data before submission
        const sanitizedData = sanitizeFormData(data) as ApplicationFormData;

        // Validate all required fields are present
        const validationErrors = this.validateSubmission(sanitizedData);
        if (validationErrors.length > 0) {
          throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
        }

        // Simulate network delay (1-2 seconds)
        const delay =
          APP_CONFIG.MOCK_API_DELAY_MIN +
          Math.random() *
            (APP_CONFIG.MOCK_API_DELAY_MAX - APP_CONFIG.MOCK_API_DELAY_MIN);
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Mock API response
        // In production, this would be:
        // const response = await axios.post(this.API_URL, data);
        // return response.data;

        const mockResponse: SubmissionResponse = {
          success: true,
          message: "Application submitted successfully",
          data: {
            applicationId: `APP-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            timestamp: new Date().toISOString(),
          },
        };

        // eslint-disable-next-line no-console
        console.log("Application submitted:", {
          data: sanitizedData,
          response: mockResponse,
        });

        return mockResponse;
      } catch (error) {
        console.error("Submission error:", error);
        throw error;
      }
    });
  }

  /**
   * Validate that all required fields are filled
   */
  private static validateSubmission(data: ApplicationFormData): string[] {
    const errors: string[] = [];

    // Step 1 validations
    if (!data.name?.trim()) errors.push("Name is required");
    if (!data.nationalId?.trim()) errors.push("National ID is required");
    if (!data.dateOfBirth) errors.push("Date of Birth is required");
    if (!data.gender) errors.push("Gender is required");
    if (!data.address?.trim()) errors.push("Address is required");
    if (!data.city?.trim()) errors.push("City is required");
    if (!data.state?.trim()) errors.push("State is required");
    if (!data.country?.trim()) errors.push("Country is required");
    if (!data.phone?.trim()) errors.push("Phone is required");
    if (!data.email?.trim()) errors.push("Email is required");

    // Step 2 validations
    if (!data.maritalStatus) errors.push("Marital Status is required");
    if (
      data.dependents === undefined ||
      data.dependents === "" ||
      (typeof data.dependents === "number" && data.dependents < 0)
    )
      errors.push("Dependents is required");
    if (!data.employmentStatus) errors.push("Employment Status is required");
    if (
      data.monthlyIncome === undefined ||
      data.monthlyIncome === "" ||
      (typeof data.monthlyIncome === "number" && data.monthlyIncome < 0)
    )
      errors.push("Monthly Income is required");
    if (!data.housingStatus) errors.push("Housing Status is required");

    // Step 3 validations
    if (
      !data.financialSituation?.trim() ||
      data.financialSituation.length < MIN_TEXT_LENGTH.DESCRIPTION
    )
      errors.push(
        `Financial Situation must be at least ${MIN_TEXT_LENGTH.DESCRIPTION} characters`
      );
    if (
      !data.employmentCircumstances?.trim() ||
      data.employmentCircumstances.length < MIN_TEXT_LENGTH.DESCRIPTION
    )
      errors.push(
        `Employment Circumstances must be at least ${MIN_TEXT_LENGTH.DESCRIPTION} characters`
      );
    if (
      !data.reasonForApplying?.trim() ||
      data.reasonForApplying.length < MIN_TEXT_LENGTH.DESCRIPTION
    )
      errors.push(
        `Reason for Applying must be at least ${MIN_TEXT_LENGTH.DESCRIPTION} characters`
      );

    return errors;
  }
}
