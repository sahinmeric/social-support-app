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

  it("should clear localStorage after successful submission", () => {
    // Fill all steps
    cy.fillStep1({
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
    });
    cy.contains("button", "Next").click();

    cy.fillStep2({
      maritalStatus: "single",
      dependents: "0",
      employmentStatus: "employed",
      monthlyIncome: "4000",
      currency: "USD",
      housingStatus: "rented",
    });
    cy.contains("button", "Next").click();

    cy.fillStep3({
      financialSituation:
        "I need financial assistance to cover basic living expenses and medical bills for my family.",
      employmentCircumstances:
        "I am currently employed but my income is not sufficient to cover all necessary expenses.",
      reasonForApplying:
        "I am requesting assistance to help bridge the gap between my income and expenses during this difficult time.",
    });

    // Submit the form
    cy.contains("button", "Submit").click();

    // Verify success page
    cy.contains(/submitted successfully/i).should("be.visible");

    // Click "Submit Another Application"
    cy.get('[data-testid="btn-submit-another"]').click();

    // Wait for form to reset
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "1"
    );

    // Verify form is empty after reset
    cy.get('input[name="name"]').should("have.value", "");
    cy.get('input[name="email"]').should("have.value", "");

    // Wait for debounce delay to ensure the empty form state is saved
    cy.wait(3000);

    // Check that localStorage now contains empty form data
    cy.window().then((win) => {
      const formDataStr = win.localStorage.getItem("socialSupportForm");
      if (formDataStr) {
        const formData = JSON.parse(formDataStr);
        // Verify that the form data is empty
        expect(formData.name).to.equal("");
        expect(formData.email).to.equal("");
      }
    });
  });

  it("should persist data across multiple page refreshes", () => {
    // Fill Step 1
    cy.fillStep1({
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
    });

    // Wait for debounce delay before moving to next step
    cy.wait(2500);

    cy.contains("button", "Next").click();

    // Wait for navigation to Step 2 to complete
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "2"
    );

    // Wait for Step 2 to be fully rendered
    cy.wait(1000);

    // Wait for the step change to be saved to localStorage (debounce delay)
    cy.wait(2500);

    // First refresh
    cy.reload();

    // Wait for page to load and verify we're on Step 2
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "2"
    );

    // Wait for lazy-loaded Step 2 component to render
    // The form uses React.lazy() so we need to wait for the component to load
    cy.wait(5000);

    // Verify Step 2 form is rendered by checking for the form container
    cy.get('[data-testid="form-wizard"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Now check for Step 2 fields
    cy.get('input[name="monthlyIncome"]', { timeout: 15000 }).should(
      "be.visible"
    );

    // Fill Step 2
    cy.fillStep2({
      maritalStatus: "married",
      dependents: "3",
      employmentStatus: "employed",
      monthlyIncome: "5000",
      currency: "USD",
      housingStatus: "owned",
    });

    // Wait for debounce delay before moving to next step
    cy.wait(2500);

    cy.contains("button", "Next").click();

    // Wait for navigation to Step 3 to complete
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "3"
    );

    // Wait for Step 3 to be fully rendered
    cy.wait(1000);

    // Wait for the step change to be saved to localStorage (debounce delay)
    cy.wait(2500);

    // Second refresh
    cy.reload();

    // Wait for page to load and verify we're on Step 3
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "3"
    );

    // Wait for lazy-loaded Step 3 component to render
    cy.wait(5000);

    // Wait for Step 3 to be ready
    cy.get('textarea[name="financialSituation"]', { timeout: 15000 }).should(
      "be.visible"
    );

    // Verify all data is still there by going back
    cy.contains("button", "Previous").click();
    cy.get('input[name="monthlyIncome"]').should("have.value", "5000");

    cy.contains("button", "Previous").click();
    cy.get('input[name="name"]').should("have.value", "Ahmed Hassan");
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
