import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/utils";
import FormField from "./FormField";

describe("FormField Component", () => {
  it("renders with default state (no value, no error)", () => {
    renderWithProviders(
      <FormField
        name="testField"
        label="Test Field"
        value=""
        onChange={vi.fn()}
      />
    );

    const input = screen.getByLabelText("Test Field");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");

    // Should not show success or error icons in default state
    expect(screen.queryByLabelText("Valid input")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Invalid input")).not.toBeInTheDocument();
  });

  it("displays success indicator when field has valid value", () => {
    renderWithProviders(
      <FormField
        name="testField"
        label="Test Field"
        value="Valid input"
        onChange={vi.fn()}
      />
    );

    const input = screen.getByLabelText("Test Field");
    expect(input).toHaveValue("Valid input");

    // Should show success icon
    const successIcon = screen.getByLabelText("Valid input");
    expect(successIcon).toBeInTheDocument();
  });

  it("displays error indicator when field has error", () => {
    renderWithProviders(
      <FormField
        name="testField"
        label="Test Field"
        value="Invalid"
        error="This field is required"
        onChange={vi.fn()}
      />
    );

    const input = screen.getByLabelText("Test Field");
    expect(input).toHaveValue("Invalid");

    // Should show error icon
    const errorIcon = screen.getByLabelText("Invalid input");
    expect(errorIcon).toBeInTheDocument();

    // Should display error message
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("handles numeric values correctly", () => {
    renderWithProviders(
      <FormField
        name="testField"
        label="Test Field"
        value={42}
        onChange={vi.fn()}
      />
    );

    const input = screen.getByLabelText("Test Field");
    expect(input).toHaveValue("42");

    // Should show success icon for numeric values
    const successIcon = screen.getByLabelText("Valid input");
    expect(successIcon).toBeInTheDocument();
  });

  it("handles zero as valid numeric value", () => {
    renderWithProviders(
      <FormField
        name="testField"
        label="Test Field"
        value={0}
        onChange={vi.fn()}
      />
    );

    const input = screen.getByLabelText("Test Field");
    expect(input).toHaveValue("0");

    // Should show success icon for zero
    const successIcon = screen.getByLabelText("Valid input");
    expect(successIcon).toBeInTheDocument();
  });

  it("calls onChange handler when user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithProviders(
      <FormField
        name="testField"
        label="Test Field"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText("Test Field");
    await user.type(input, "Hello");

    expect(handleChange).toHaveBeenCalled();
  });

  it("hides success indicator when showSuccessIndicator is false", () => {
    renderWithProviders(
      <FormField
        name="testField"
        label="Test Field"
        value="Valid input"
        onChange={vi.fn()}
        showSuccessIndicator={false}
      />
    );

    // Should not show success icon
    expect(screen.queryByLabelText("Valid input")).not.toBeInTheDocument();
  });

  it("displays helper text when provided", () => {
    renderWithProviders(
      <FormField
        name="testField"
        label="Test Field"
        value=""
        onChange={vi.fn()}
        helperText="This is helper text"
      />
    );

    expect(screen.getByText("This is helper text")).toBeInTheDocument();
  });

  it("prioritizes error message over helper text", () => {
    renderWithProviders(
      <FormField
        name="testField"
        label="Test Field"
        value="Invalid"
        error="Error message"
        helperText="Helper text"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
  });
});
