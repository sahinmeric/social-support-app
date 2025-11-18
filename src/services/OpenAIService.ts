import axios from "axios";
import type {
  AISuggestionRequest,
  AISuggestionResponse,
  AISuggestion,
  AIError,
} from "../types/openai.types";
import { AIErrorType } from "../types/openai.types";
import type { ApplicationFormData } from "../types/form.types";
import {
  API_CONFIG,
  API_ENDPOINTS,
  APP_CONFIG,
  HTTP_STATUS,
  ERROR_CODES,
} from "../constants";
import { sanitizeInput } from "../utils/sanitize";
import { PerformanceMonitor } from "../utils/performance";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AI === "true";

/**
 * Cache entry for storing AI suggestions
 */
interface CacheEntry {
  suggestion: AISuggestion;
  timestamp: number;
  contextHash: string;
  language: string;
}

/**
 * Service for interacting with backend API to generate AI suggestions
 */
export class OpenAIService {
  private abortController: AbortController | null = null;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Generate Arabic mock suggestion for testing without API calls
   */
  private generateArabicMockSuggestion(
    fieldName: keyof ApplicationFormData,
    formData: ApplicationFormData
  ): AISuggestion {
    const mockSuggestions: Record<string, string> = {
      financialSituation: `أواجه حاليًا تحديات مالية كبيرة. مع دخل شهري قدره ${
        formData.monthlyIncome || "موارد محدودة"
      } و ${
        formData.dependents || 0
      } من المعالين لدعمهم، أجد صعوبة في تلبية الاحتياجات الأساسية. وضعي السكني ${
        formData.housingStatus || "غير مستقر"
      }، مما يزيد من العبء المالي. أسعى للحصول على المساعدة لتحقيق الاستقرار في وضعي وتوفير احتياجات عائلتي الأساسية.`,
      employmentCircumstances: `وضعي الوظيفي الحالي ${
        formData.employmentStatus || "غير مؤكد"
      }. وقد أثر هذا بشكل كبير على قدرتي على الحفاظ على دخل مستقر وإعالة نفسي وعائلتي. أبحث بنشاط عن فرص لتحسين وضعي الوظيفي، ولكن في الوقت الحالي، أحتاج إلى الدعم لتجاوز هذه الفترة الصعبة وضمان تلبية الاحتياجات الأساسية.`,
      reasonForApplying: `أتقدم بطلب للحصول على الدعم الاجتماعي لأنني في حاجة ماسة إلى المساعدة لتغطية نفقات المعيشة الأساسية. مع وضعي المالي والوظيفي الحالي، لا أستطيع توفير ما يكفي لـ ${
        formData.dependents || "معاليّ"
      }. سيساعدني هذا الدعم في الحفاظ على استقرار السكن وضمان الأمن الغذائي وتغطية النفقات الأساسية بينما أعمل على تحسين ظروفي. أنا ملتزم باستخدام هذه المساعدة بمسؤولية والعمل نحو الاستقلال المالي.`,
    };

    const suggestion =
      mockSuggestions[fieldName] || "نص اقتراح تجريبي لـ " + fieldName;

    // Sanitize AI-generated content before returning
    return {
      text: sanitizeInput(suggestion),
      fieldName: fieldName as string,
    };
  }

  /**
   * Generate mock suggestion for testing without API calls
   */
  private generateMockSuggestion(
    fieldName: keyof ApplicationFormData,
    formData: ApplicationFormData,
    language: string
  ): AISuggestion {
    // Call Arabic mock generator when language is Arabic
    if (language === "ar") {
      return this.generateArabicMockSuggestion(fieldName, formData);
    }

    // Default to English mock suggestions
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

    const suggestion =
      mockSuggestions[fieldName] || "Sample suggestion text for " + fieldName;

    // Sanitize AI-generated content before returning
    return {
      text: sanitizeInput(suggestion),
      fieldName: fieldName as string,
    };
  }

  /**
   * Build language-aware system prompt for AI requests
   */
  private buildSystemPrompt(language: string): string {
    const languageInstruction =
      language === "ar"
        ? "Please respond in Arabic language."
        : "Please respond in English language.";

    return `You are a helpful assistant for a social support application. ${languageInstruction}

Generate a professional and empathetic response for the user's application form.
The response should be between 50-200 words and written in first person.
Focus on clearly explaining the user's situation based on the provided context.`;
  }

  /**
   * Build request payload for backend API
   */
  private buildRequestPayload(
    fieldName: keyof ApplicationFormData,
    formData: ApplicationFormData,
    language: string
  ): AISuggestionRequest {
    // Extract only relevant fields for the backend
    const relevantData: Partial<ApplicationFormData> = {};

    switch (fieldName) {
      case "financialSituation":
        relevantData.employmentStatus = formData.employmentStatus;
        relevantData.monthlyIncome = formData.monthlyIncome;
        relevantData.housingStatus = formData.housingStatus;
        relevantData.dependents = formData.dependents;
        break;
      case "employmentCircumstances":
        relevantData.employmentStatus = formData.employmentStatus;
        relevantData.monthlyIncome = formData.monthlyIncome;
        break;
      case "reasonForApplying":
        relevantData.financialSituation = formData.financialSituation;
        relevantData.employmentStatus = formData.employmentStatus;
        relevantData.housingStatus = formData.housingStatus;
        relevantData.dependents = formData.dependents;
        break;
    }

    // Build system prompt with language instruction
    const systemPrompt = this.buildSystemPrompt(language);

    return {
      fieldName: fieldName as string,
      formData: relevantData as AISuggestionRequest["formData"],
      systemPrompt,
    };
  }

  /**
   * Generate a hash of the context for cache key
   */
  private generateContextHash(
    fieldName: keyof ApplicationFormData,
    formData: ApplicationFormData,
    language: string
  ): string {
    // Create a hash based on relevant form data for this field
    const relevantData: Record<string, unknown> = {};

    switch (fieldName) {
      case "financialSituation":
        relevantData.employmentStatus = formData.employmentStatus;
        relevantData.monthlyIncome = formData.monthlyIncome;
        relevantData.housingStatus = formData.housingStatus;
        relevantData.dependents = formData.dependents;
        break;
      case "employmentCircumstances":
        relevantData.employmentStatus = formData.employmentStatus;
        relevantData.monthlyIncome = formData.monthlyIncome;
        break;
      case "reasonForApplying":
        relevantData.financialSituation = formData.financialSituation;
        relevantData.employmentStatus = formData.employmentStatus;
        relevantData.housingStatus = formData.housingStatus;
        relevantData.dependents = formData.dependents;
        break;
    }

    return JSON.stringify({ ...relevantData, language });
  }

  /**
   * Get cached suggestion if available and not expired
   */
  private getCachedSuggestion(
    fieldName: keyof ApplicationFormData,
    contextHash: string,
    language: string
  ): AISuggestion | null {
    const cacheKey = `${fieldName}-${contextHash}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL;
      const languageMatches = cached.language === language;
      if (!isExpired && cached.contextHash === contextHash && languageMatches) {
        return cached.suggestion;
      }
      // Remove expired or mismatched entry
      this.cache.delete(cacheKey);
    }

    return null;
  }

  /**
   * Store suggestion in cache
   */
  private setCachedSuggestion(
    fieldName: keyof ApplicationFormData,
    contextHash: string,
    suggestion: AISuggestion,
    language: string
  ): void {
    const cacheKey = `${fieldName}-${contextHash}`;
    this.cache.set(cacheKey, {
      suggestion,
      timestamp: Date.now(),
      contextHash,
      language,
    });
  }

  /**
   * Invalidate cache for a specific field or all fields
   */
  public invalidateCache(fieldName?: keyof ApplicationFormData): void {
    if (fieldName) {
      // Remove all cache entries for this field
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.startsWith(`${fieldName}-`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => this.cache.delete(key));
    } else {
      // Clear entire cache
      this.cache.clear();
    }
  }

  /**
   * Cancel any ongoing API request
   */
  public cancelRequest(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Generate AI suggestion for a specific field
   * Performance monitored for optimization tracking
   * Includes caching to avoid duplicate API calls
   */
  async generateSuggestion(
    fieldName: keyof ApplicationFormData,
    formData: ApplicationFormData,
    language: string
  ): Promise<AISuggestion> {
    return PerformanceMonitor.measureAsync(
      `AI Suggestion Generation - ${fieldName}`,
      async () => {
        // Generate context hash for caching
        const contextHash = this.generateContextHash(
          fieldName,
          formData,
          language
        );

        // Check cache first
        const cached = this.getCachedSuggestion(
          fieldName,
          contextHash,
          language
        );
        if (cached) {
          return cached;
        }

        // Use mock mode for testing without API calls (avoids CORS issues)
        if (USE_MOCK) {
          // Simulate network delay
          await new Promise((resolve) =>
            setTimeout(resolve, APP_CONFIG.AI_MOCK_DELAY)
          );
          const suggestion = this.generateMockSuggestion(
            fieldName,
            formData,
            language
          );
          // Cache mock suggestions too
          this.setCachedSuggestion(
            fieldName,
            contextHash,
            suggestion,
            language
          );
          return suggestion;
        }

        const suggestion = await this.generateSuggestionInternal(
          fieldName,
          formData,
          language
        );
        // Cache the result
        this.setCachedSuggestion(fieldName, contextHash, suggestion, language);
        return suggestion;
      }
    );
  }

  /**
   * Internal method for generating AI suggestions via backend API
   */
  private async generateSuggestionInternal(
    fieldName: keyof ApplicationFormData,
    formData: ApplicationFormData,
    language: string
  ): Promise<AISuggestion> {
    const requestPayload = this.buildRequestPayload(
      fieldName,
      formData,
      language
    );

    // Create new AbortController for this request
    this.abortController = new AbortController();

    try {
      const response = await axios.post<AISuggestionResponse>(
        `${this.apiBaseUrl}${API_ENDPOINTS.AI_SUGGESTIONS}`,
        requestPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: API_CONFIG.REQUEST_TIMEOUT,
          signal: this.abortController.signal,
        }
      );

      const { text, fieldName: responseFieldName } = response.data;

      if (!text) {
        throw this.createError(
          AIErrorType.GENERIC,
          "No suggestion was generated. Please try again."
        );
      }

      // Sanitize AI-generated content before returning
      return {
        text: sanitizeInput(text),
        fieldName: responseFieldName,
      };
    } catch (error) {
      // Check if request was cancelled
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ERR_CANCELED"
      ) {
        throw this.createError(AIErrorType.GENERIC, "Request was cancelled.");
      }
      throw this.handleError(error);
    } finally {
      this.abortController = null;
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
export const aiService = new OpenAIService();

// Keep backward compatibility
export const openAIService = aiService;
