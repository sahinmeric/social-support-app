import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/utils";
import ProgressBar from "./ProgressBar";

describe("ProgressBar Component", () => {
  it("renders with current step and total steps", () => {
    renderWithProviders(<ProgressBar currentStep={1} totalSteps={3} />);

    // Check for step labels
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Family & Financial Info")).toBeInTheDocument();
    expect(screen.getByText("Situation Descriptions")).toBeInTheDocument();

    // Check ARIA attributes
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "1");
    expect(progressBar).toHaveAttribute("aria-valuemin", "1");
    expect(progressBar).toHaveAttribute("aria-valuemax", "3");
  });

  it("displays completion percentage when provided", () => {
    renderWithProviders(
      <ProgressBar currentStep={2} totalSteps={3} completionPercentage={65} />
    );

    expect(screen.getByText("Overall Completion: 65%")).toBeInTheDocument();
  });

  it("does not display completion percentage when not provided", () => {
    renderWithProviders(<ProgressBar currentStep={1} totalSteps={3} />);

    expect(screen.queryByText(/Overall Completion/)).not.toBeInTheDocument();
  });

  it("highlights current step correctly", () => {
    renderWithProviders(<ProgressBar currentStep={2} totalSteps={3} />);

    // Step 2 should be active
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "2");
  });

  it("shows all three steps", () => {
    renderWithProviders(<ProgressBar currentStep={1} totalSteps={3} />);

    // Check for step labels
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Family & Financial Info")).toBeInTheDocument();
    expect(screen.getByText("Situation Descriptions")).toBeInTheDocument();
  });

  it("displays 0% completion correctly", () => {
    renderWithProviders(
      <ProgressBar currentStep={1} totalSteps={3} completionPercentage={0} />
    );

    expect(screen.getByText("Overall Completion: 0%")).toBeInTheDocument();
  });

  it("displays 100% completion correctly", () => {
    renderWithProviders(
      <ProgressBar currentStep={3} totalSteps={3} completionPercentage={100} />
    );

    expect(screen.getByText("Overall Completion: 100%")).toBeInTheDocument();
  });

  it("renders correctly on step 1", () => {
    renderWithProviders(
      <ProgressBar currentStep={1} totalSteps={3} completionPercentage={20} />
    );

    expect(screen.getByText("Overall Completion: 20%")).toBeInTheDocument();
    const progressBar = screen.getByLabelText("Step 1 of 3");
    expect(progressBar).toHaveAttribute("aria-valuenow", "1");
  });

  it("renders correctly on step 3", () => {
    renderWithProviders(
      <ProgressBar currentStep={3} totalSteps={3} completionPercentage={90} />
    );

    expect(screen.getByText("Overall Completion: 90%")).toBeInTheDocument();
    const progressBar = screen.getByLabelText("Step 3 of 3");
    expect(progressBar).toHaveAttribute("aria-valuenow", "3");
  });
});
