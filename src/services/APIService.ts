import type { ApplicationFormData } from "../types/form.types";

/**
 * Response from the API after submitting an application
 */
export interface SubmissionResponse {
  success: boolean;
  message: string;
  applicationId?: string;
  timestamp?: string;
}

/**
 * Service for submitting application data to the backend
 */
export class APIService {
  // API endpoint for production use (currently using mock implementation)
  // @ts-ignore - Reserved for future use
  private static readonly API_URL =
    import.meta.env.VITE_API_URL || "/api/applications";

  /**
   * Submit application to the backend
   * Currently uses a mock implementation with 1-2 second delay
   */
  static async submitApplication(
    data: ApplicationFormData
  ): Promise<SubmissionResponse> {
    try {
      // Validate all required fields are present
      const validationErrors = this.validateSubmission(data);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
      }

      // Simulate network delay (1-2 seconds)
      const delay = 1000 + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Mock API response
      // In production, this would be:
      // const response = await axios.post(this.API_URL, data);
      // return response.data;

      const mockResponse: SubmissionResponse = {
        success: true,
        message: "Application submitted successfully",
        applicationId: `APP-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };

      console.log("Application submitted:", {
        data,
        response: mockResponse,
      });

      return mockResponse;
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
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
    if (data.dependents === undefined || data.dependents < 0)
      errors.push("Dependents is required");
    if (!data.employmentStatus) errors.push("Employment Status is required");
    if (data.monthlyIncome === undefined || data.monthlyIncome < 0)
      errors.push("Monthly Income is required");
    if (!data.housingStatus) errors.push("Housing Status is required");

    // Step 3 validations
    if (!data.financialSituation?.trim() || data.financialSituation.length < 50)
      errors.push("Financial Situation must be at least 50 characters");
    if (
      !data.employmentCircumstances?.trim() ||
      data.employmentCircumstances.length < 50
    )
      errors.push("Employment Circumstances must be at least 50 characters");
    if (!data.reasonForApplying?.trim() || data.reasonForApplying.length < 50)
      errors.push("Reason for Applying must be at least 50 characters");

    return errors;
  }
}
