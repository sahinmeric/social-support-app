import React, { useState, useCallback } from "react";
import { Box, TextField, Stack, Button } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useTranslation } from "react-i18next";
import { useFormContext } from "../../hooks/useFormContext";
import SuggestionModal from "../ai/SuggestionModal";
import { openAIService } from "../../services/OpenAIService";
import type { ApplicationFormData } from "../../types/form.types";
import type { AIError } from "../../types/openai.types";
import { MIN_TEXT_LENGTH } from "../../constants";
import { sanitizeInput } from "../../utils/sanitize";

const Step3SituationDescriptions: React.FC = () => {
  const { t } = useTranslation();
  const { formData, errors, updateFormData } = useFormContext();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState<
    keyof ApplicationFormData | null
  >(null);
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleHelpMeWrite = async (field: keyof ApplicationFormData) => {
    setCurrentField(field);
    setModalOpen(true);
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
  };

  const handleAccept = () => {
    if (currentField && suggestion) {
      updateFormData(currentField, suggestion);
    }
    handleCloseModal();
  };

  const handleEdit = (editedText: string) => {
    if (currentField) {
      updateFormData(currentField, editedText);
    }
    handleCloseModal();
  };

  const handleDiscard = () => {
    handleCloseModal();
  };

  const handleRetry = async () => {
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
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentField(null);
    setSuggestion("");
    setError(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        {/* Financial Situation */}
        <Box>
          <TextField
            fullWidth
            required
            id="financialSituation"
            name="financialSituation"
            label={t("fields.financialSituation")}
            value={formData.financialSituation}
            onChange={handleChange("financialSituation")}
            onBlur={handleBlur("financialSituation")}
            error={!!errors.financialSituation}
            helperText={
              errors.financialSituation
                ? t(errors.financialSituation, {
                    min: MIN_TEXT_LENGTH.DESCRIPTION,
                  })
                : `${t("validation.minLength", {
                    min: MIN_TEXT_LENGTH.DESCRIPTION,
                  })} (${formData.financialSituation.length}/${
                    MIN_TEXT_LENGTH.DESCRIPTION
                  })`
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
          <Button
            variant="outlined"
            size="small"
            startIcon={<AutoAwesomeIcon />}
            onClick={() => handleHelpMeWrite("financialSituation")}
            sx={{
              mt: 1,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {t("ai.helpMeWrite")}
          </Button>
        </Box>

        {/* Employment Circumstances */}
        <Box>
          <TextField
            fullWidth
            required
            id="employmentCircumstances"
            name="employmentCircumstances"
            label={t("fields.employmentCircumstances")}
            value={formData.employmentCircumstances}
            onChange={handleChange("employmentCircumstances")}
            onBlur={handleBlur("employmentCircumstances")}
            error={!!errors.employmentCircumstances}
            helperText={
              errors.employmentCircumstances
                ? t(errors.employmentCircumstances, {
                    min: MIN_TEXT_LENGTH.DESCRIPTION,
                  })
                : `${t("validation.minLength", {
                    min: MIN_TEXT_LENGTH.DESCRIPTION,
                  })} (${formData.employmentCircumstances.length}/${
                    MIN_TEXT_LENGTH.DESCRIPTION
                  })`
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
          <Button
            variant="outlined"
            size="small"
            startIcon={<AutoAwesomeIcon />}
            onClick={() => handleHelpMeWrite("employmentCircumstances")}
            sx={{
              mt: 1,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {t("ai.helpMeWrite")}
          </Button>
        </Box>

        {/* Reason for Applying */}
        <Box>
          <TextField
            fullWidth
            required
            id="reasonForApplying"
            name="reasonForApplying"
            label={t("fields.reasonForApplying")}
            value={formData.reasonForApplying}
            onChange={handleChange("reasonForApplying")}
            onBlur={handleBlur("reasonForApplying")}
            error={!!errors.reasonForApplying}
            helperText={
              errors.reasonForApplying
                ? t(errors.reasonForApplying, {
                    min: MIN_TEXT_LENGTH.DESCRIPTION,
                  })
                : `${t("validation.minLength", {
                    min: MIN_TEXT_LENGTH.DESCRIPTION,
                  })} (${formData.reasonForApplying.length}/${
                    MIN_TEXT_LENGTH.DESCRIPTION
                  })`
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
          <Button
            variant="outlined"
            size="small"
            startIcon={<AutoAwesomeIcon />}
            onClick={() => handleHelpMeWrite("reasonForApplying")}
            sx={{
              mt: 1,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {t("ai.helpMeWrite")}
          </Button>
        </Box>
      </Stack>

      {/* AI Suggestion Modal */}
      <SuggestionModal
        open={modalOpen}
        suggestion={suggestion}
        isLoading={isLoading}
        error={error}
        onAccept={handleAccept}
        onEdit={handleEdit}
        onDiscard={handleDiscard}
        onRetry={handleRetry}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default React.memo(Step3SituationDescriptions);
