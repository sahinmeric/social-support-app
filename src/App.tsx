import {
  Box,
  Container,
  Typography,
  ThemeProvider,
  CssBaseline,
  Paper,
} from "@mui/material";
import { useLanguage } from "./contexts/LanguageContext";
import { createAppTheme } from "./theme/theme";
import LanguageSelector from "./components/common/LanguageSelector";
import ProgressBar from "./components/common/ProgressBar";
import NavigationButtons from "./components/common/NavigationButtons";
import Step1PersonalInfo from "./components/steps/Step1PersonalInfo";
import Step2FamilyFinancial from "./components/steps/Step2FamilyFinancial";
import Step3SituationDescriptions from "./components/steps/Step3SituationDescriptions";
import { FormProvider } from "./contexts/FormContext";
import { useFormContext } from "./hooks/useFormContext";
import { useTranslation } from "react-i18next";
import "./App.css";

function FormContent() {
  const { t } = useTranslation();
  const { currentStep, setCurrentStep, validateCurrentStep } = useFormContext();

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 3) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      alert("Form submitted! (This is a test)");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <LanguageSelector />
      </Box>

      <Typography variant="h4" component="h1" gutterBottom align="center">
        {currentStep === 1 && t("steps.personalInfo")}
        {currentStep === 2 && t("steps.familyFinancial")}
        {currentStep === 3 && t("steps.situationDescriptions")}
      </Typography>

      <ProgressBar currentStep={currentStep} totalSteps={3} />

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        {currentStep === 1 && <Step1PersonalInfo />}
        {currentStep === 2 && <Step2FamilyFinancial />}
        {currentStep === 3 && <Step3SituationDescriptions />}
      </Paper>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={3}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        isSubmitting={false}
        isValid={true}
      />
    </Container>
  );
}

function App() {
  const { direction } = useLanguage();
  const theme = createAppTheme(direction);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FormProvider>
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
          <FormContent />
        </Box>
      </FormProvider>
    </ThemeProvider>
  );
}

export default App;
