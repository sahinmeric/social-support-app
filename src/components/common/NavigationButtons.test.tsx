import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/utils";
import NavigationButtons from "./NavigationButtons";

describe("NavigationButtons Component", () => {
  const defaultProps = {
    currentStep: 2 as const,
    totalSteps: 3,
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    onSubmit: vi.fn(),
    isSubmitting: false,
    isValid: true,
  };

  it("renders Next and Previous buttons on middle step", () => {
    renderWithProviders(<NavigationButtons {...defaultProps} />);

    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
  });

  it("disables Previous button on first step", () => {
    renderWithProviders(
      <NavigationButtons {...defaultProps} currentStep={1 as const} />
    );

    const previousButton = screen.getByText("Previous");
    expect(previousButton).toBeDisabled();
  });

  it("shows Submit button on last step", () => {
    renderWithProviders(
      <NavigationButtons {...defaultProps} currentStep={3 as const} />
    );

    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
  });

  it("calls onNext when Next button is clicked", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();

    renderWithProviders(
      <NavigationButtons {...defaultProps} onNext={onNext} />
    );

    const nextButton = screen.getByText("Next");
    await user.click(nextButton);

    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("calls onPrevious when Previous button is clicked", async () => {
    const user = userEvent.setup();
    const onPrevious = vi.fn();

    renderWithProviders(
      <NavigationButtons {...defaultProps} onPrevious={onPrevious} />
    );

    const previousButton = screen.getByText("Previous");
    await user.click(previousButton);

    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when Submit button is clicked", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(
      <NavigationButtons
        {...defaultProps}
        currentStep={3 as const}
        onSubmit={onSubmit}
      />
    );

    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables Submit button when form is invalid", () => {
    renderWithProviders(
      <NavigationButtons
        {...defaultProps}
        currentStep={3 as const}
        isValid={false}
      />
    );

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeDisabled();
  });

  it("shows loading state when submitting", () => {
    renderWithProviders(
      <NavigationButtons
        {...defaultProps}
        currentStep={3 as const}
        isSubmitting={true}
      />
    );

    expect(
      screen.getByText("Submitting your application...")
    ).toBeInTheDocument();
    const submitButton = screen.getByText("Submitting your application...");
    expect(submitButton).toBeDisabled();
  });

  it("disables all buttons when submitting", () => {
    renderWithProviders(
      <NavigationButtons
        {...defaultProps}
        currentStep={2 as const}
        isSubmitting={true}
      />
    );

    const nextButton = screen.getByText("Next");
    const previousButton = screen.getByText("Previous");

    expect(nextButton).toBeDisabled();
    expect(previousButton).toBeDisabled();
  });

  it("has correct ARIA labels", () => {
    renderWithProviders(<NavigationButtons {...defaultProps} />);

    expect(screen.getByLabelText("Next")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous")).toBeInTheDocument();
  });

  it("has correct ARIA label for Submit button", () => {
    renderWithProviders(
      <NavigationButtons {...defaultProps} currentStep={3 as const} />
    );

    expect(screen.getByLabelText("Submit")).toBeInTheDocument();
  });

  it("sets aria-busy when submitting", () => {
    renderWithProviders(
      <NavigationButtons
        {...defaultProps}
        currentStep={3 as const}
        isSubmitting={true}
      />
    );

    const submitButton = screen.getByLabelText("Submit");
    expect(submitButton).toHaveAttribute("aria-busy", "true");
  });
});
