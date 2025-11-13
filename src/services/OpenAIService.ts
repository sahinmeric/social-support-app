import axios from "axios";
import type {
  OpenAIRequest,
  OpenAIResponse,
  AISuggestion,
  AIError,
} from "../types/openai.types";
import { AIErrorType } from "../types/openai.types";
import type { ApplicationFormData } from "../types/form.types";

const OPENAI_API_URL = "https://api.openai.com/v4/chat/completions";
const TIMEOUT_MS = 30000; // 30 seconds

/**
 * Service for interacting with OpenAI API to generate suggestions
 */
export class OpenAIService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY || "";
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
    if (!this.apiKey) {
      throw this.createError(
        AIErrorType.GENERIC,
        "OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file."
      );
    }

    const prompt = this.buildPrompt(fieldName, formData);

    const request: OpenAIRequest = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that helps people write clear and empathetic descriptions for social support applications.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    };

    try {
      const response = await axios.post<OpenAIResponse>(
        OPENAI_API_URL,
        request,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: TIMEOUT_MS,
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
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        return this.createError(
          AIErrorType.TIMEOUT,
          "Request took too long. Please try again."
        );
      }

      if (error.response?.status === 429) {
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
