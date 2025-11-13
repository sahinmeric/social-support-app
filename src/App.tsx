import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import { useLanguage } from "./contexts/LanguageContext";
import { createAppTheme } from "./theme/theme";
import { FormProvider } from "./contexts/FormContext";
import FormWizard from "./components/FormWizard";
import "./App.css";

function App() {
  const { direction } = useLanguage();
  const theme = createAppTheme(direction);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FormProvider>
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
          <FormWizard />
        </Box>
      </FormProvider>
    </ThemeProvider>
  );
}

export default App;
