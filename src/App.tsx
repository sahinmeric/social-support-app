import {
  Box,
  Container,
  Typography,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { useLanguage } from "./contexts/LanguageContext";
import { createAppTheme } from "./theme/theme";
import LanguageSelector from "./components/common/LanguageSelector";
import { useTranslation } from "react-i18next";
import "./App.css";

function App() {
  const { direction } = useLanguage();
  const { t } = useTranslation();
  const theme = createAppTheme(direction);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <LanguageSelector />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t("steps.personalInfo")}
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            {t("common.loading")}
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
