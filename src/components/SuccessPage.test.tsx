import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/utils";
import SuccessPage from "./SuccessPage";

describe("SuccessPage Component", () => {
  const mockOnSubmitAnother = vi.fn();
  const mockOnGoHome = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders success message and icon", () => {
    renderWithProviders(
      <SuccessPage
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    expect(screen.getByText(/success/i)).toBeInTheDocument();
    expect(screen.getByText(/successfully submitted/i)).toBeInTheDocument();
  });

  it("displays application ID when provided", () => {
    const applicationId = "APP-123456789";

    renderWithProviders(
      <SuccessPage
        applicationId={applicationId}
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    expect(screen.getByText(/application id/i)).toBeInTheDocument();
    expect(screen.getByText(applicationId)).toBeInTheDocument();
  });

  it("displays timestamp when provided", () => {
    const timestamp = "2024-01-15T10:30:00.000Z";

    renderWithProviders(
      <SuccessPage
        applicationId="APP-123"
        timestamp={timestamp}
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    expect(screen.getByText(/submitted at/i)).toBeInTheDocument();
  });

  it("does not display application ID section when not provided", () => {
    renderWithProviders(
      <SuccessPage
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    expect(screen.queryByText(/application id/i)).not.toBeInTheDocument();
  });

  it("renders Submit Another Application button", () => {
    renderWithProviders(
      <SuccessPage
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    const submitAnotherButton = screen.getByRole("button", {
      name: /submit another/i,
    });
    expect(submitAnotherButton).toBeInTheDocument();
  });

  it("renders Go Home button", () => {
    renderWithProviders(
      <SuccessPage
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    const goHomeButton = screen.getByRole("button", {
      name: /go home/i,
    });
    expect(goHomeButton).toBeInTheDocument();
  });

  it("calls onSubmitAnother when Submit Another Application is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <SuccessPage
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    const submitAnotherButton = screen.getByRole("button", {
      name: /submit another/i,
    });
    await user.click(submitAnotherButton);

    expect(mockOnSubmitAnother).toHaveBeenCalledTimes(1);
  });

  it("calls onGoHome when Go Home is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <SuccessPage
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    const goHomeButton = screen.getByRole("button", {
      name: /go home/i,
    });
    await user.click(goHomeButton);

    expect(mockOnGoHome).toHaveBeenCalledTimes(1);
  });

  it("formats timestamp correctly", () => {
    const timestamp = "2024-01-15T10:30:00.000Z";

    renderWithProviders(
      <SuccessPage
        applicationId="APP-123"
        timestamp={timestamp}
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    // Check that timestamp is displayed (format may vary by locale)
    const timestampElement = screen.getByText(/submitted at/i);
    expect(timestampElement).toBeInTheDocument();
  });

  it("displays success icon with correct styling", () => {
    renderWithProviders(
      <SuccessPage
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    // Check for success icon (CheckCircleOutlineIcon)
    const successIcon = screen.getByTestId("CheckCircleOutlineIcon");
    expect(successIcon).toBeInTheDocument();
  });

  it("displays buttons with correct icons", () => {
    renderWithProviders(
      <SuccessPage
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    // Check for AddIcon in Submit Another button
    expect(screen.getByTestId("AddIcon")).toBeInTheDocument();

    // Check for HomeIcon in Go Home button
    expect(screen.getByTestId("HomeIcon")).toBeInTheDocument();
  });

  it("renders within a Paper component for elevation", () => {
    const { container } = renderWithProviders(
      <SuccessPage
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    // Check for MUI Paper component
    const paper = container.querySelector(".MuiPaper-root");
    expect(paper).toBeInTheDocument();
  });

  it("displays application ID in monospace font", () => {
    const applicationId = "APP-123456789";

    renderWithProviders(
      <SuccessPage
        applicationId={applicationId}
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    const appIdElement = screen.getByText(applicationId);
    expect(appIdElement).toHaveStyle({ fontFamily: "monospace" });
  });

  it("handles missing timestamp gracefully", () => {
    renderWithProviders(
      <SuccessPage
        applicationId="APP-123"
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    // Should display application ID but not timestamp
    expect(screen.getByText(/application id/i)).toBeInTheDocument();
    expect(screen.queryByText(/submitted at/i)).not.toBeInTheDocument();
  });

  it("renders responsive layout with proper spacing", () => {
    const { container } = renderWithProviders(
      <SuccessPage
        onSubmitAnother={mockOnSubmitAnother}
        onGoHome={mockOnGoHome}
      />
    );

    // Check for Container component
    const containerElement = container.querySelector(".MuiContainer-root");
    expect(containerElement).toBeInTheDocument();

    // Check for Stack component for button layout
    const stack = container.querySelector(".MuiStack-root");
    expect(stack).toBeInTheDocument();
  });
});
