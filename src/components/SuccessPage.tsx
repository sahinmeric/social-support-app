import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";

interface SuccessPageProps {
  applicationId?: string;
  timestamp?: string;
  onSubmitAnother: () => void;
  onGoHome: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  applicationId,
  timestamp,
  onSubmitAnother,
  onGoHome,
}) => {
  const { t } = useTranslation();

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            textAlign: "center",
            width: "100%",
          }}
          data-testid="success-page"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <CheckCircleOutlineIcon
              sx={{
                fontSize: { xs: 80, md: 100 },
                color: "success.main",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600, mb: 2 }}
          >
            {t("submission.success")}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
          >
            {t("success.message")}
          </Typography>

          {applicationId && (
            <Box
              sx={{
                bgcolor: "grey.100",
                p: 2,
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t("success.applicationId")}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontFamily: "monospace", fontWeight: 600 }}
                data-testid="application-id"
              >
                {applicationId}
              </Typography>
              {timestamp && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  {t("success.submittedAt")}: {formatTimestamp(timestamp)}
                </Typography>
              )}
            </Box>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={onSubmitAnother}
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
              data-testid="btn-submit-another"
            >
              {t("success.submitAnother")}
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={onGoHome}
              sx={{ minWidth: { xs: "100%", sm: 200 } }}
              data-testid="btn-go-home"
            >
              {t("success.goHome")}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default SuccessPage;
