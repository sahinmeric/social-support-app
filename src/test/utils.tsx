import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { FormProvider } from "../contexts/FormContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { createAppTheme } from "../theme/theme";

/**
 * Custom render function that wraps components with necessary providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialLanguage?: "en" | "ar";
  withFormProvider?: boolean;
  withLanguageProvider?: boolean;
  withThemeProvider?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialLanguage: _initialLanguage = "en",
    withFormProvider = true,
    withLanguageProvider = true,
    withThemeProvider = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const theme = createAppTheme("ltr");

  function Wrapper({ children }: { children: React.ReactNode }) {
    let content = children;

    if (withFormProvider) {
      content = <FormProvider>{content}</FormProvider>;
    }

    if (withLanguageProvider) {
      content = <LanguageProvider>{content}</LanguageProvider>;
    }

    if (withThemeProvider) {
      content = (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {content}
        </ThemeProvider>
      );
    }

    return <>{content}</>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing library
export * from "@testing-library/react";
export { renderWithProviders as render };
