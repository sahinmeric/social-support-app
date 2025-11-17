describe("SSA Application - AI Suggestions", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  // Helper function to navigate to Step 3
  const navigateToStep3 = () => {
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

    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "2"
    );

    cy.fillStep2({
      maritalStatus: "married",
      dependents: "2",
      employmentStatus: "employed",
      monthlyIncome: "3000",
      currency: "USD",
      housingStatus: "rented",
    });
    cy.contains("button", "Next").click();

    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "3"
    );
  };

  it('should generate AI suggestion when clicking "Help Me Write"', () => {
    navigateToStep3();

    // Click "Help Me Write" button for financial situation
    cy.get('[data-testid="ai-help-financialSituation"]').click();

    // Wait for suggestion modal to appear
    cy.get('[data-testid="ai-modal"]', { timeout: 10000 }).should("be.visible");

    // Wait for loading to finish and suggestion to appear (AI mock delay is 1.5s)
    cy.get('[data-testid="ai-loading"]', { timeout: 5000 }).should("exist");
    cy.get('[data-testid="ai-loading"]', { timeout: 5000 }).should("not.exist");

    // Verify suggestion content exists
    cy.get('[data-testid="ai-suggestion-text"]', { timeout: 5000 }).should(
      "exist"
    );
  });

  it("should accept AI suggestion", () => {
    navigateToStep3();

    // Generate suggestion
    cy.get('[data-testid="ai-help-financialSituation"]').click();
    cy.get('[data-testid="ai-modal"]', { timeout: 10000 }).should("be.visible");

    // Wait for loading to finish
    cy.get('[data-testid="ai-loading"]', { timeout: 5000 }).should("exist");
    cy.get('[data-testid="ai-loading"]', { timeout: 5000 }).should("not.exist");

    // Get the suggestion text
    cy.get('[data-testid="ai-suggestion-text"]', { timeout: 5000 })
      .find("textarea")
      .invoke("val")
      .then((suggestionText) => {
        // Click Accept button
        cy.get('[data-testid="btn-accept-suggestion"]').click();

        // Verify suggestion is copied to textarea
        cy.get('textarea[name="financialSituation"]').should(
          "have.value",
          suggestionText
        );

        // Verify suggestion modal is closed
        cy.get('[data-testid="ai-modal"]').should("not.exist");
      });
  });

  it("should discard AI suggestion", () => {
    navigateToStep3();

    // Add some text first
    cy.get('textarea[name="financialSituation"]').type("My original text");

    // Generate suggestion
    cy.get('[data-testid="ai-help-financialSituation"]').click();
    cy.get('[data-testid="ai-modal"]', { timeout: 10000 }).should("be.visible");

    // Click Discard button
    cy.get('[data-testid="btn-discard-suggestion"]').click();

    // Verify suggestion modal is closed
    cy.get('[data-testid="ai-modal"]').should("not.exist");

    // Verify original text is unchanged
    cy.get('textarea[name="financialSituation"]').should(
      "have.value",
      "My original text"
    );
  });

  it("should generate suggestions for all three fields", () => {
    navigateToStep3();

    // Generate suggestion for financial situation
    cy.get('[data-testid="ai-help-financialSituation"]').click();
    cy.get('[data-testid="ai-modal"]', { timeout: 10000 }).should("be.visible");
    // Wait for loading to finish
    cy.get('[data-testid="ai-loading"]', { timeout: 5000 }).should("exist");
    cy.get('[data-testid="ai-loading"]', { timeout: 5000 }).should("not.exist");
    cy.get('[data-testid="btn-accept-suggestion"]', { timeout: 5000 }).click();

    // Verify first field has content
    cy.get('textarea[name="financialSituation"]').should("not.have.value", "");

    // Generate suggestion for employment circumstances
    cy.get('[data-testid="ai-help-employmentCircumstances"]').click();
    cy.get('[data-testid="ai-modal"]', { timeout: 10000 }).should("be.visible");
    // Wait for loading to finish
    cy.get('[data-testid="ai-loading"]', { timeout: 5000 }).should("exist");
    cy.get('[data-testid="ai-loading"]', { timeout: 5000 }).should("not.exist");
    cy.get('[data-testid="btn-accept-suggestion"]', { timeout: 5000 }).click();

    // Verify second field has content
    cy.get('textarea[name="employmentCircumstances"]').should(
      "not.have.value",
      ""
    );

    // Generate suggestion for reason for applying
    cy.get('[data-testid="ai-help-reasonForApplying"]').click();
    cy.get('[data-testid="ai-modal"]', { timeout: 10000 }).should("be.visible");
    // Wait for loading to finish
    cy.get('[data-testid="ai-loading"]', { timeout: 5000 }).should("exist");
    cy.get('[data-testid="ai-loading"]', { timeout: 5000 }).should("not.exist");
    cy.get('[data-testid="btn-accept-suggestion"]', { timeout: 5000 }).click();

    // Verify third field has content
    cy.get('textarea[name="reasonForApplying"]').should("not.have.value", "");
  });

  it("should show Help Me Write buttons for all three fields", () => {
    navigateToStep3();

    // Verify all three AI help buttons exist
    cy.get('[data-testid="ai-help-financialSituation"]').should("be.visible");
    cy.get('[data-testid="ai-help-employmentCircumstances"]').should(
      "be.visible"
    );
    cy.get('[data-testid="ai-help-reasonForApplying"]').should("be.visible");
  });
});
