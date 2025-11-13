import { useContext } from "react";
import { FormContext } from "../contexts/FormContext.context";
import type { FormContextValue } from "../contexts/FormContext.types";

/**
 * Hook to access form context
 */
export const useFormContext = (): FormContextValue => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
