import React, { useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "react-i18next";
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Box sx={{ color: "text.secondary" }}>{t("ai.generating")}</Box>
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
        >
          {t("ai.discard")}
        </Button>

        <Box sx={{ flex: 1 }} />

        {error && (
          <Button
            onClick={onRetry}
            startIcon={<RefreshIcon />}
            variant="outlined"
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
