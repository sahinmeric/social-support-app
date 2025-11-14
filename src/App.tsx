import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useLanguage } from "./contexts/LanguageContext";
import { createAppTheme } from "./theme/theme";
import { FormProvider } from "./contexts/FormContext";
import FormWizard from "./components/FormWizard";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./App.css";

function App() {
  const { direction } = useLanguage();
  const theme = createAppTheme(direction);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <FormProvider>
          <Box
            sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}
          >
            <FormWizard />
          </Box>
        </FormProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
