import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useTranslation } from "react-i18next";
import type { HelpMeWriteButtonProps } from "../../types/component.types";

const HelpMeWriteButton: React.FC<HelpMeWriteButtonProps> = ({
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isLoading] = React.useState(false);

  const handleClick = () => {
    // This will be handled by the parent component
    // The button just triggers the modal
  };

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={
        isLoading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />
      }
      onClick={handleClick}
      disabled={disabled || isLoading}
      sx={{
        textTransform: "none",
        borderRadius: 2,
        px: 2,
      }}
      aria-label={t("ai.helpMeWrite")}
    >
      {t("ai.helpMeWrite")}
    </Button>
  );
};

export default HelpMeWriteButton;
