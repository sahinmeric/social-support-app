import React, { useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "react-i18next";
import { ModalSkeleton } from "../common/SkeletonLoader";
import type { SuggestionModalProps } from "../../types/component.types";

const SuggestionModal: React.FC<SuggestionModalProps> = ({
  open,
  suggestion,
  isLoading,
  error,
  onAccept,
  onEdit,
  onDiscard,
  onRetry,
  onClose,
}) => {
  const { t } = useTranslation();
  const [editedText, setEditedText] = React.useState(suggestion);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  // Update edited text when suggestion changes
  useEffect(() => {
    setEditedText(suggestion);
  }, [suggestion]);

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (open && !isLoading && !error && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [open, isLoading, error]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  const handleEdit = () => {
    onEdit(editedText);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="suggestion-dialog-title"
      aria-describedby="suggestion-dialog-description"
      data-testid="ai-modal"
    >
      <DialogTitle id="suggestion-dialog-title">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {t("ai.helpMeWrite")}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading && (
          <Box data-testid="ai-loading">
            <ModalSkeleton />
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={onRetry}>
                {t("ai.retry")}
              </Button>
            }
            data-testid="ai-error"
          >
            {error}
          </Alert>
        )}

        {!isLoading && !error && suggestion && (
          <TextField
            fullWidth
            multiline
            rows={8}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            inputRef={textFieldRef}
            placeholder={t("ai.helpMeWrite")}
            aria-label="AI suggestion text"
            aria-describedby="suggestion-dialog-description"
            data-testid="ai-suggestion-text"
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: "inherit",
              },
            }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onDiscard}
          startIcon={<DeleteIcon />}
          color="error"
          disabled={isLoading}
          data-testid="btn-discard-suggestion"
        >
          {t("ai.discard")}
        </Button>

        <Box sx={{ flex: 1 }} />

        {error && (
          <Button
            onClick={onRetry}
            startIcon={<RefreshIcon />}
            variant="outlined"
            data-testid="btn-retry-suggestion"
          >
            {t("ai.retry")}
          </Button>
        )}

        {!isLoading && !error && suggestion && (
          <>
            <Button
              onClick={handleEdit}
              startIcon={<EditIcon />}
              variant="outlined"
              disabled={editedText === suggestion}
            >
              {t("ai.edit")}
            </Button>
            <Button
              onClick={handleAccept}
              startIcon={<CheckCircleIcon />}
              variant="contained"
              data-testid="btn-accept-suggestion"
            >
              {t("ai.accept")}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SuggestionModal;
