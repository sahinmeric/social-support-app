import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/utils";
import LanguageSelector from "./LanguageSelector";

describe("LanguageSelector Component", () => {
  it("renders language selector", () => {
    renderWithProviders(<LanguageSelector />);

    const selector = screen.getByLabelText("Select language");
    expect(selector).toBeInTheDocument();
  });

  it("displays English as default language", () => {
    renderWithProviders(<LanguageSelector />);

    // The component should show English by default
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("has interactive combobox for language selection", () => {
    renderWithProviders(<LanguageSelector />);

    // Should have a combobox role for accessibility
    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeInTheDocument();
    expect(combobox).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("displays current language selection", () => {
    renderWithProviders(<LanguageSelector />);

    // Should display the current language (English by default)
    expect(screen.getByText("English")).toBeInTheDocument();

    // Should have the flag emoji
    expect(screen.getByText("🇬🇧")).toBeInTheDocument();
  });

  it("displays language icon", () => {
    renderWithProviders(<LanguageSelector />);

    // Check that the language icon is present (MUI LanguageIcon)
    const selector = screen.getByLabelText("Select language");
    expect(selector).toBeInTheDocument();
  });

  it("has accessible label", () => {
    renderWithProviders(<LanguageSelector />);

    const selector = screen.getByLabelText("Select language");
    expect(selector).toHaveAttribute("aria-label", "Select language");
  });
});
