describe("SSA Application - Happy Path", () => {
  beforeEach(() => {
    cy.visit("/");
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it("should complete the full application flow successfully", () => {
    // Verify we're on Step 1
    cy.contains("Personal Information").should("be.visible");
    cy.get('[data-testid="step-indicator"]').should("contain", "1");

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
      email: "ahmed.hassan@example.com",
    });

    // Click Next
    cy.contains("button", "Next").click();

    // Verify we're on Step 2
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "2"
    );

    // Fill Step 2
    cy.fillStep2({
      maritalStatus: "married",
      dependents: "3",
      employmentStatus: "employed",
      monthlyIncome: "5000",
      currency: "USD",
      housingStatus: "rented",
    });

    // Click Next
    cy.contains("button", "Next").click();

    // Verify we're on Step 3
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "3"
    );

    // Fill Step 3
    cy.fillStep3({
      financialSituation:
        "I am currently facing financial difficulties due to unexpected medical expenses for my family.",
      employmentCircumstances:
        "I am currently employed but my income is not sufficient to cover all necessary expenses.",
      reasonForApplying:
        "I am requesting financial assistance to help cover medical bills and basic living expenses.",
    });

    // Submit the form
    cy.contains("button", "Submit").click();

    // Verify success page
    cy.contains(/submitted successfully/i, { timeout: 15000 }).should(
      "be.visible"
    );

    // Verify application ID is displayed
    cy.get('[data-testid="success-page"]').should("be.visible");

    // Test "Submit Another Application" button
    cy.get('[data-testid="btn-submit-another"]').click();

    // Verify we're back at Step 1 with empty form
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "1"
    );
    cy.get('input[name="name"]').should("have.value", "");
  });
});
