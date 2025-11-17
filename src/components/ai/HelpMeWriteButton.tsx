import React from "react";
import Button from "@mui/material/Button";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useTranslation } from "react-i18next";
import type { ApplicationFormData } from "../../types/form.types";

export interface HelpMeWriteButtonProps {
  fieldName: keyof ApplicationFormData;
  onClick: (fieldName: keyof ApplicationFormData) => void;
  disabled?: boolean;
}

const HelpMeWriteButton: React.FC<HelpMeWriteButtonProps> = ({
  fieldName,
  onClick,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    onClick(fieldName);
  };

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<AutoAwesomeIcon />}
      onClick={handleClick}
      disabled={disabled}
      sx={{
        mt: 1,
        textTransform: "none",
        borderRadius: 2,
      }}
      data-testid={`ai-help-${fieldName}`}
      aria-label={t("ai.helpMeWrite")}
    >
      {t("ai.helpMeWrite")}
    </Button>
  );
};

export default HelpMeWriteButton;
