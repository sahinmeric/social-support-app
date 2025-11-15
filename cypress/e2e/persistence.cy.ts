describe("SSA Application - Data Persistence", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  it("should persist form data after page refresh", () => {
    const step1Data = {
      name: "Ahmed Hassan",
      nationalId: "1234567890",
      dateOfBirth: "1990-01-15",
      gender: "male",
      address: "123 Main Street",
      city: "Riyadh",
      state: "Riyadh Province",
      country: "Saudi Arabia",
      phone: "+966501234567",
      email: "ahmed@example.com",
    };

    // Fill Step 1
    cy.fillStep1(step1Data);

    // Wait for debounce delay (2000ms) + buffer to ensure data is saved
    cy.wait(2500);

    // Refresh the page while still on Step 1
    cy.reload();

    // Verify we're still on Step 1
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "1"
    );

    // Verify Step 1 data persisted
    cy.get('input[name="name"]').should("have.value", step1Data.name);
    cy.get('input[name="email"]').should("have.value", step1Data.email);
    cy.get('input[name="phone"]').should("have.value", step1Data.phone);

    // Now proceed to Step 2
    cy.contains("button", "Next").click();

    // Fill Step 2
    cy.fillStep2({
      maritalStatus: "married",
      dependents: "2",
      employmentStatus: "employed",
      monthlyIncome: "5000",
      currency: "USD",
      housingStatus: "rented",
    });

    // Wait for debounce delay (2000ms) + buffer to ensure data is saved
    cy.wait(2500);

    // Refresh on Step 2
    cy.reload();

    // Wait for the page to load and verify we're still on Step 2
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "2"
    );

    // Wait for Step 2 fields to be visible
    cy.get('input[name="monthlyIncome"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Verify Step 2 data persisted (check numeric field)
    cy.get('input[name="monthlyIncome"]').should("have.value", "5000");
  });

  it("should handle localStorage data corruption gracefully", () => {
    // Set invalid data in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem("socialSupportForm", "invalid-json-data");
    });

    // Reload the page
    cy.reload();

    // Should start fresh on Step 1 with empty form
    cy.get('[data-testid="step-indicator"]').should("contain", "1");
    cy.get('input[name="name"]').should("have.value", "");
  });
});
