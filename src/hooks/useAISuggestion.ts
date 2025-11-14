import { useState, useCallback } from "react";
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

  /**
   * Generate a suggestion for a specific field
   * Opens the modal and initiates the AI generation process
   *
   * @param field - The form field to generate a suggestion for
   */
  const generateSuggestion = useCallback(
    async (field: keyof ApplicationFormData) => {
      setCurrentField(field);
      setIsModalOpen(true);
      setIsLoading(true);
      setError(null);
      setSuggestion("");

      try {
        const result = await openAIService.generateSuggestion(field, formData);
        setSuggestion(result.text);
      } catch (err) {
        const aiError = err as AIError;
        setError(t(`ai.errors.${aiError.type}`) || aiError.message);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, t]
  );

  /**
   * Accept the current suggestion and update the form field
   * Closes the modal after accepting
   */
  const acceptSuggestion = useCallback(() => {
    if (currentField && suggestion) {
      updateFormData(currentField, suggestion);
    }
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
      }
    }
  }, [currentField, formData, t]);

  /**
   * Close the modal and reset all state
   * Can be called directly or as a result of other actions
   */
  const closeModal = useCallback(() => {
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
    generateSuggestion,
    acceptSuggestion,
    editSuggestion,
    discardSuggestion,
    retrySuggestion,
    closeModal,
  };
};
