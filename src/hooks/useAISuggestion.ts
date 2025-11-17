import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "./useFormContext";
import { openAIService } from "../services/OpenAIService";
import type { ApplicationFormData } from "../types/form.types";
import type { AIError } from "../types/openai.types";

/**
 * Return type for useAISuggestion hook
 */
export interface UseAISuggestionReturn {
  /** Whether the modal is open */
  isModalOpen: boolean;
  /** Current field being suggested for */
  currentField: keyof ApplicationFormData | null;
  /** Generated suggestion text */
  suggestion: string;
  /** Whether suggestion is being generated */
  isLoading: boolean;
  /** Error message if generation failed */
  error: string | null;
  /** Map of loading states per field to prevent multiple simultaneous requests */
  loadingFields: Record<string, boolean>;
  /** Generate a suggestion for a specific field */
  generateSuggestion: (field: keyof ApplicationFormData) => Promise<void>;
  /** Accept the suggestion and update form data */
  acceptSuggestion: () => void;
  /** Edit the suggestion and update form data */
  editSuggestion: (editedText: string) => void;
  /** Discard the suggestion without updating */
  discardSuggestion: () => void;
  /** Retry generating a suggestion for the current field */
  retrySuggestion: () => Promise<void>;
  /** Close the modal and reset state */
  closeModal: () => void;
}

/**
 * Custom hook for managing AI suggestion workflow
 *
 * Encapsulates all AI suggestion logic including:
 * - Generating suggestions for form fields
 * - Managing modal state
 * - Handling loading and error states
 * - Accepting, editing, or discarding suggestions
 * - Retrying failed generations
 *
 * @returns {UseAISuggestionReturn} AI suggestion state and handlers
 *
 * @example
 * ```tsx
 * const {
 *   isModalOpen,
 *   suggestion,
 *   isLoading,
 *   error,
 *   generateSuggestion,
 *   acceptSuggestion,
 *   editSuggestion,
 *   discardSuggestion,
 *   retrySuggestion,
 *   closeModal
 * } = useAISuggestion();
 *
 * return (
 *   <>
 *     <button onClick={() => generateSuggestion('financialSituation')}>
 *       Help Me Write
 *     </button>
 *     <SuggestionModal
 *       open={isModalOpen}
 *       suggestion={suggestion}
 *       isLoading={isLoading}
 *       error={error}
 *       onAccept={acceptSuggestion}
 *       onEdit={editSuggestion}
 *       onDiscard={discardSuggestion}
 *       onRetry={retrySuggestion}
 *       onClose={closeModal}
 *     />
 *   </>
 * );
 * ```
 */
export const useAISuggestion = (): UseAISuggestionReturn => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormContext();

  // Modal and suggestion state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState<
    keyof ApplicationFormData | null
  >(null);
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({
    financialSituation: false,
    employmentCircumstances: false,
    reasonForApplying: false,
  });

  // Track previous form data for cache invalidation
  const prevFormDataRef = useRef<ApplicationFormData>(formData);

  // Invalidate cache when relevant form data changes
  useEffect(() => {
    const prev = prevFormDataRef.current;
    const current = formData;

    // Check if any relevant fields have changed
    const relevantFields: (keyof ApplicationFormData)[] = [
      "employmentStatus",
      "monthlyIncome",
      "housingStatus",
      "dependents",
      "financialSituation",
    ];

    const hasChanged = relevantFields.some(
      (field) => prev[field] !== current[field]
    );

    if (hasChanged) {
      // Invalidate cache when form data changes
      openAIService.invalidateCache();
      prevFormDataRef.current = current;
    }
  }, [formData]);

  /**
   * Generate a suggestion for a specific field
   * Opens the modal and initiates the AI generation process
   * Prevents multiple simultaneous requests for the same field
   *
   * @param field - The form field to generate a suggestion for
   */
  const generateSuggestion = useCallback(
    async (field: keyof ApplicationFormData) => {
      // Prevent multiple simultaneous requests for the same field
      if (loadingFields[field]) {
        return;
      }

      setCurrentField(field);
      setIsModalOpen(true);
      setIsLoading(true);
      setError(null);
      setSuggestion("");
      setLoadingFields((prev) => ({ ...prev, [field]: true }));

      try {
        const result = await openAIService.generateSuggestion(field, formData);
        setSuggestion(result.text);
      } catch (err) {
        const aiError = err as AIError;
        setError(t(`ai.errors.${aiError.type}`) || aiError.message);
      } finally {
        setIsLoading(false);
        setLoadingFields((prev) => ({ ...prev, [field]: false }));
      }
    },
    [formData, t, loadingFields]
  );

  /**
   * Accept the current suggestion and update the form field
   * Closes the modal after accepting
   */
  const acceptSuggestion = useCallback(() => {
    if (currentField && suggestion) {
      updateFormData(currentField, suggestion);
    }
    // Cancel any ongoing request
    openAIService.cancelRequest();
    setIsModalOpen(false);
    setCurrentField(null);
    setSuggestion("");
    setError(null);
  }, [currentField, suggestion, updateFormData]);

  /**
   * Edit the suggestion and update the form field with edited text
   * Closes the modal after editing
   *
   * @param editedText - The edited suggestion text
   */
  const editSuggestion = useCallback(
    (editedText: string) => {
      if (currentField) {
        updateFormData(currentField, editedText);
      }
      // Cancel any ongoing request
      openAIService.cancelRequest();
      setIsModalOpen(false);
      setCurrentField(null);
      setSuggestion("");
      setError(null);
    },
    [currentField, updateFormData]
  );

  /**
   * Discard the suggestion without updating the form
   * Closes the modal and resets state
   */
  const discardSuggestion = useCallback(() => {
    // Cancel any ongoing request
    openAIService.cancelRequest();
    setIsModalOpen(false);
    setCurrentField(null);
    setSuggestion("");
    setError(null);
  }, []);

  /**
   * Retry generating a suggestion for the current field
   * Used when the initial generation fails or user wants a different suggestion
   */
  const retrySuggestion = useCallback(async () => {
    if (currentField) {
      setIsLoading(true);
      setError(null);
      setSuggestion("");
      setLoadingFields((prev) => ({ ...prev, [currentField]: true }));

      try {
        const result = await openAIService.generateSuggestion(
          currentField,
          formData
        );
        setSuggestion(result.text);
      } catch (err) {
        const aiError = err as AIError;
        setError(t(`ai.errors.${aiError.type}`) || aiError.message);
      } finally {
        setIsLoading(false);
        setLoadingFields((prev) => ({ ...prev, [currentField]: false }));
      }
    }
  }, [currentField, formData, t]);

  /**
   * Close the modal and reset all state
   * Can be called directly or as a result of other actions
   * Cancels any ongoing API request
   */
  const closeModal = useCallback(() => {
    // Cancel any ongoing request when modal closes
    openAIService.cancelRequest();
    setIsModalOpen(false);
    setCurrentField(null);
    setSuggestion("");
    setError(null);
  }, []);

  return {
    isModalOpen,
    currentField,
    suggestion,
    isLoading,
    error,
    loadingFields,
    generateSuggestion,
    acceptSuggestion,
    editSuggestion,
    discardSuggestion,
    retrySuggestion,
    closeModal,
  };
};
