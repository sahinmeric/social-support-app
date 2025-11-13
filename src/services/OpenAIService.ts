import axios from "axios";
import type {
  OpenAIRequest,
  OpenAIResponse,
  AISuggestion,
  AIError,
} from "../types/openai.types";
import { AIErrorType } from "../types/openai.types";
import type { ApplicationFormData } from "../types/form.types";
import {
  API_CONFIG,
  OPENAI_CONFIG,
  APP_CONFIG,
  HTTP_STATUS,
  ERROR_CODES,
} from "../constants";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AI === "true";

/**
 * Service for interacting with OpenAI API to generate suggestions
 */
export class OpenAIService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY || "";
  }

  /**
   * Generate mock suggestion for testing without API calls
   */
  private generateMockSuggestion(
    fieldName: keyof ApplicationFormData,
    formData: ApplicationFormData
  ): AISuggestion {
    const mockSuggestions: Record<string, string> = {
      financialSituation: `I am currently facing significant financial challenges. With a monthly income of ${
        formData.monthlyIncome || "limited funds"
      } and ${
        formData.dependents || 0
      } dependents to support, I am struggling to meet basic needs. My housing situation is ${
        formData.housingStatus || "unstable"
      }, which adds to the financial burden. I am seeking assistance to help stabilize my situation and provide for my family's essential needs.`,
      employmentCircumstances: `My current employment status is ${
        formData.employmentStatus || "uncertain"
      }. This has significantly impacted my ability to maintain stable income and support myself and my family. I am actively seeking opportunities to improve my employment situation, but in the meantime, I need support to bridge this difficult period and ensure basic necessities are met.`,
      reasonForApplying: `I am applying for social support because I am in urgent need of assistance to meet basic living expenses. With my current financial and employment situation, I am unable to adequately provide for ${
        formData.dependents || "my"
      } dependents. This support would help me maintain housing stability, ensure food security, and cover essential expenses while I work towards improving my circumstances. I am committed to using this assistance responsibly and working towards financial independence.`,
    };

    return {
      text:
        mockSuggestions[fieldName] || "Sample suggestion text for " + fieldName,
      fieldName: fieldName as string,
    };
  }

  /**
   * Build contextual prompt for a specific field
   */
  private buildPrompt(
    fieldName: keyof ApplicationFormData,
    formData: ApplicationFormData
  ): string {
    const baseContext = `You are helping someone fill out a social support application form. Based on the information provided, generate a clear, concise, and empathetic response for the "${fieldName}" field. Keep it between 50-200 words.`;

    switch (fieldName) {
      case "financialSituation":
        return `${baseContext}

Context:
- Employment Status: ${formData.employmentStatus || "Not specified"}
- Monthly Income: ${formData.monthlyIncome || "Not specified"}
- Housing Status: ${formData.housingStatus || "Not specified"}
- Number of Dependents: ${formData.dependents || 0}

Generate a description of their current financial situation that explains their need for support.`;

      case "employmentCircumstances":
        return `${baseContext}

Context:
- Employment Status: ${formData.employmentStatus || "Not specified"}
- Monthly Income: ${formData.monthlyIncome || "Not specified"}

Generate a description of their employment circumstances and how it affects their ability to support themselves.`;

      case "reasonForApplying":
        return `${baseContext}

Context:
- Financial Situation: ${formData.financialSituation || "Not specified"}
- Employment Status: ${formData.employmentStatus || "Not specified"}
- Housing Status: ${formData.housingStatus || "Not specified"}
- Number of Dependents: ${formData.dependents || 0}

Generate a compelling reason for why they are applying for social support, focusing on their specific needs and circumstances.`;

      default:
        return `${baseContext}\n\nGenerate appropriate content for the ${fieldName} field.`;
    }
  }

  /**
   * Generate AI suggestion for a specific field
   */
  async generateSuggestion(
    fieldName: keyof ApplicationFormData,
    formData: ApplicationFormData
  ): Promise<AISuggestion> {
    // Use mock mode for testing without API calls (avoids CORS issues)
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise((resolve) =>
        setTimeout(resolve, APP_CONFIG.AI_MOCK_DELAY)
      );
      return this.generateMockSuggestion(fieldName, formData);
    }

    if (!this.apiKey) {
      throw this.createError(
        AIErrorType.GENERIC,
        "OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file."
      );
    }

    const prompt = this.buildPrompt(fieldName, formData);

    const request: OpenAIRequest = {
      model: OPENAI_CONFIG.MODEL,
      messages: [
        {
          role: "system",
          content: OPENAI_CONFIG.SYSTEM_MESSAGE,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: OPENAI_CONFIG.MAX_TOKENS,
      temperature: OPENAI_CONFIG.TEMPERATURE,
    };

    try {
      const response = await axios.post<OpenAIResponse>(
        API_CONFIG.OPENAI_URL,
        request,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: API_CONFIG.REQUEST_TIMEOUT,
        }
      );

      const suggestion = response.data.choices[0]?.message?.content?.trim();

      if (!suggestion) {
        throw this.createError(
          AIErrorType.GENERIC,
          "No suggestion was generated. Please try again."
        );
      }

      return {
        text: suggestion,
        fieldName: fieldName as string,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle errors from API calls
   */
  private handleError(error: unknown): AIError {
    if (axios.isAxiosError(error)) {
      if (
        error.code === ERROR_CODES.TIMEOUT ||
        error.code === ERROR_CODES.NETWORK_ERROR
      ) {
        return this.createError(
          AIErrorType.TIMEOUT,
          "Request took too long. Please try again."
        );
      }

      if (error.response?.status === HTTP_STATUS.RATE_LIMIT) {
        return this.createError(
          AIErrorType.RATE_LIMIT,
          "Too many requests. Please wait a moment and try again."
        );
      }

      if (!error.response) {
        return this.createError(
          AIErrorType.NETWORK,
          "Unable to connect. Please check your internet connection."
        );
      }
    }

    return this.createError(
      AIErrorType.GENERIC,
      "Something went wrong. Please try again."
    );
  }

  /**
   * Create an AIError object
   */
  private createError(type: AIErrorType, message: string): AIError {
    return { type, message };
  }
}

// Export a singleton instance
export const openAIService = new OpenAIService();
