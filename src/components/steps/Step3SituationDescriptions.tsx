import React, { useCallback } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { useFormContext } from "../../hooks/useFormContext";
import { useAISuggestion } from "../../hooks/useAISuggestion";
import SuggestionModal from "../ai/SuggestionModal";
import HelpMeWriteButton from "../ai/HelpMeWriteButton";
import { MIN_TEXT_LENGTH } from "../../constants";
import { sanitizeInput } from "../../utils/sanitize";
import FormField from "../common/FormField";

const Step3SituationDescriptions: React.FC = () => {
  const { t } = useTranslation();
  const { formData, errors, updateFormData } = useFormContext();
  const {
    isModalOpen,
    suggestion,
    isLoading,
    error,
    generateSuggestion,
    acceptSuggestion,
    editSuggestion,
    discardSuggestion,
    retrySuggestion,
    closeModal,
  } = useAISuggestion();

  const translateError = useCallback(
    (error: string | undefined): string | undefined => {
      if (!error) return undefined;
      // Check if error contains parameter (format: "key|value")
      if (error.includes("|")) {
        const [key, value] = error.split("|");
        return t(key, { min: parseInt(value), max: parseInt(value) });
      }
      return t(error);
    },
    [t]
  );

  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateFormData(field, event.target.value);
    };

  const handleBlur = useCallback(
    (field: keyof typeof formData) =>
      (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        if (typeof value === "string") {
          const sanitized = sanitizeInput(value);
          if (sanitized !== value) {
            updateFormData(field, sanitized);
          }
        }
      },
    [updateFormData]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        {/* Financial Situation */}
        <Box>
          <FormField
            fullWidth
            required
            id="financialSituation"
            name="financialSituation"
            label={t("fields.financialSituation")}
            value={formData.financialSituation}
            onChange={handleChange("financialSituation")}
            onBlur={handleBlur("financialSituation")}
            error={translateError(errors.financialSituation)}
            helperText={
              !errors.financialSituation
                ? `${t("validation.minLength", {
                    min: MIN_TEXT_LENGTH.DESCRIPTION,
                  })} (${formData.financialSituation.length}/${
                    MIN_TEXT_LENGTH.DESCRIPTION
                  })`
                : undefined
            }
            multiline
            rows={4}
            slotProps={{
              htmlInput: {
                "aria-label": t("fields.financialSituation"),
                "aria-required": "true",
                "aria-invalid": !!errors.financialSituation,
                "aria-describedby": errors.financialSituation
                  ? "financialSituation-error"
                  : undefined,
              },
            }}
          />
          <HelpMeWriteButton
            fieldName="financialSituation"
            onClick={generateSuggestion}
          />
        </Box>

        {/* Employment Circumstances */}
        <Box>
          <FormField
            fullWidth
            required
            id="employmentCircumstances"
            name="employmentCircumstances"
            label={t("fields.employmentCircumstances")}
            value={formData.employmentCircumstances}
            onChange={handleChange("employmentCircumstances")}
            onBlur={handleBlur("employmentCircumstances")}
            error={translateError(errors.employmentCircumstances)}
            helperText={
              !errors.employmentCircumstances
                ? `${t("validation.minLength", {
                    min: MIN_TEXT_LENGTH.DESCRIPTION,
                  })} (${formData.employmentCircumstances.length}/${
                    MIN_TEXT_LENGTH.DESCRIPTION
                  })`
                : undefined
            }
            multiline
            rows={4}
            slotProps={{
              htmlInput: {
                "aria-label": t("fields.employmentCircumstances"),
                "aria-required": "true",
                "aria-invalid": !!errors.employmentCircumstances,
                "aria-describedby": errors.employmentCircumstances
                  ? "employmentCircumstances-error"
                  : undefined,
              },
            }}
          />
          <HelpMeWriteButton
            fieldName="employmentCircumstances"
            onClick={generateSuggestion}
          />
        </Box>

        {/* Reason for Applying */}
        <Box>
          <FormField
            fullWidth
            required
            id="reasonForApplying"
            name="reasonForApplying"
            label={t("fields.reasonForApplying")}
            value={formData.reasonForApplying}
            onChange={handleChange("reasonForApplying")}
            onBlur={handleBlur("reasonForApplying")}
            error={translateError(errors.reasonForApplying)}
            helperText={
              !errors.reasonForApplying
                ? `${t("validation.minLength", {
                    min: MIN_TEXT_LENGTH.DESCRIPTION,
                  })} (${formData.reasonForApplying.length}/${
                    MIN_TEXT_LENGTH.DESCRIPTION
                  })`
                : undefined
            }
            multiline
            rows={4}
            slotProps={{
              htmlInput: {
                "aria-label": t("fields.reasonForApplying"),
                "aria-required": "true",
                "aria-invalid": !!errors.reasonForApplying,
                "aria-describedby": errors.reasonForApplying
                  ? "reasonForApplying-error"
                  : undefined,
              },
            }}
          />
          <HelpMeWriteButton
            fieldName="reasonForApplying"
            onClick={generateSuggestion}
          />
        </Box>
      </Stack>

      {/* AI Suggestion Modal */}
      <SuggestionModal
        open={isModalOpen}
        suggestion={suggestion}
        isLoading={isLoading}
        error={error}
        onAccept={acceptSuggestion}
        onEdit={editSuggestion}
        onDiscard={discardSuggestion}
        onRetry={retrySuggestion}
        onClose={closeModal}
      />
    </Box>
  );
};

export default React.memo(Step3SituationDescriptions);
