import { screen, within } from "@testing-library/react";
import { expect } from "vitest";

/**
 * Helper to check if a form field has an error
 */
export const expectFieldError = (fieldName: string, errorMessage?: string) => {
  const field = screen.getByRole("textbox", {
    name: new RegExp(fieldName, "i"),
  });
  expect(field).toHaveAttribute("aria-invalid", "true");

  if (errorMessage) {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  }
};

/**
 * Helper to check if a form field is valid (has success indicator)
 */
export const expectFieldValid = (fieldName: string) => {
  const field = screen.getByRole("textbox", {
    name: new RegExp(fieldName, "i"),
  });
  expect(field).not.toHaveAttribute("aria-invalid", "true");
};

/**
 * Helper to check if a button is disabled
 */
export const expectButtonDisabled = (buttonName: string) => {
  const button = screen.getByRole("button", {
    name: new RegExp(buttonName, "i"),
  });
  expect(button).toBeDisabled();
};

/**
 * Helper to check if a button is enabled
 */
export const expectButtonEnabled = (buttonName: string) => {
  const button = screen.getByRole("button", {
    name: new RegExp(buttonName, "i"),
  });
  expect(button).toBeEnabled();
};

/**
 * Helper to check if an element is visible
 */
export const expectVisible = (text: string | RegExp) => {
  expect(screen.getByText(text)).toBeVisible();
};

/**
 * Helper to check if an element is not in the document
 */
export const expectNotInDocument = (text: string | RegExp) => {
  expect(screen.queryByText(text)).not.toBeInTheDocument();
};

/**
 * Helper to check progress bar step
 */
export const expectCurrentStep = (stepNumber: number) => {
  const stepper = screen.getByRole("progressbar", { name: /progress/i });
  // Check if the correct step is active
  const steps = within(stepper).getAllByRole("step");
  expect(steps[stepNumber - 1]).toHaveAttribute("aria-current", "step");
};

/**
 * Helper to check completion percentage
 */
export const expectCompletionPercentage = (percentage: number) => {
  const progressText = screen.getByText(new RegExp(`${percentage}%`, "i"));
  expect(progressText).toBeInTheDocument();
};

/**
 * Helper to check localStorage value
 */
export const expectLocalStorageValue = (key: string, value: string) => {
  expect(localStorage.getItem(key)).toBe(value);
};

/**
 * Helper to check localStorage is cleared
 */
export const expectLocalStorageCleared = (key: string) => {
  expect(localStorage.getItem(key)).toBeNull();
};

/**
 * Helper to wait for loading to finish
 */
export const waitForLoadingToFinish = async () => {
  const loadingIndicators = screen.queryAllByRole("progressbar");
  if (loadingIndicators.length > 0) {
    await screen.findByRole("progressbar", {}, { timeout: 5000 });
  }
};

/**
 * Helper to check if modal is open
 */
export const expectModalOpen = (modalTitle: string) => {
  const modal = screen.getByRole("dialog");
  expect(modal).toBeInTheDocument();
  expect(within(modal).getByText(modalTitle)).toBeInTheDocument();
};

/**
 * Helper to check if modal is closed
 */
export const expectModalClosed = () => {
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
};
