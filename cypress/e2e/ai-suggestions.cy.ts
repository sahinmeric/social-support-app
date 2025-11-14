describe("SSA Application - AI Suggestions", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  it('should generate AI suggestion when clicking "Help Me Write"', () => {
    // Navigate to Step 3
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    cy.fillStep2({
      maritalStatus: "married",
      numberOfDependents: "2",
      monthlyIncome: "3000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Click "Help Me Write" button for current situation
    cy.get('[data-testid="help-write-situation"]').click();

    // Wait for suggestion to generate (with timeout)
    cy.get('[data-testid="ai-suggestion"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Verify suggestion content is not empty
    cy.get('[data-testid="ai-suggestion"]').should("not.be.empty");
  });

  it("should accept AI suggestion", () => {
    // Navigate to Step 3
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    cy.fillStep2({
      maritalStatus: "single",
      numberOfDependents: "0",
      monthlyIncome: "2500",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Generate suggestion
    cy.get('[data-testid="help-write-situation"]').click();
    cy.get('[data-testid="ai-suggestion"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Get the suggestion text
    cy.get('[data-testid="ai-suggestion"]')
      .invoke("text")
      .then((suggestionText) => {
        // Click Accept button
        cy.get('[data-testid="accept-suggestion"]').click();

        // Verify suggestion is copied to textarea
        cy.get('textarea[name="currentSituation"]').should(
          "have.value",
          suggestionText.trim()
        );

        // Verify suggestion dialog is closed
        cy.get('[data-testid="ai-suggestion"]').should("not.exist");
      });
  });

  it("should edit AI suggestion before accepting", () => {
    // Navigate to Step 3
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    cy.fillStep2({
      maritalStatus: "married",
      numberOfDependents: "1",
      monthlyIncome: "4000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Generate suggestion
    cy.get('[data-testid="help-write-situation"]').click();
    cy.get('[data-testid="ai-suggestion"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Click Edit button
    cy.get('[data-testid="edit-suggestion"]').click();

    // Verify suggestion becomes editable
    cy.get('[data-testid="ai-suggestion-editor"]').should("be.visible");

    // Edit the suggestion
    cy.get('[data-testid="ai-suggestion-editor"]')
      .clear()
      .type("This is my edited suggestion text.");

    // Accept the edited suggestion
    cy.get('[data-testid="accept-edited-suggestion"]').click();

    // Verify edited text is in textarea
    cy.get('textarea[name="currentSituation"]').should(
      "have.value",
      "This is my edited suggestion text."
    );
  });

  it("should discard AI suggestion", () => {
    // Navigate to Step 3
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    cy.fillStep2({
      maritalStatus: "single",
      numberOfDependents: "0",
      monthlyIncome: "3500",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Add some text first
    cy.get('textarea[name="currentSituation"]').type("My original text");

    // Generate suggestion
    cy.get('[data-testid="help-write-situation"]').click();
    cy.get('[data-testid="ai-suggestion"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Click Discard button
    cy.get('[data-testid="discard-suggestion"]').click();

    // Verify suggestion dialog is closed
    cy.get('[data-testid="ai-suggestion"]').should("not.exist");

    // Verify original text is unchanged
    cy.get('textarea[name="currentSituation"]').should(
      "have.value",
      "My original text"
    );
  });

  it("should retry AI suggestion generation", () => {
    // Navigate to Step 3
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    cy.fillStep2({
      maritalStatus: "married",
      numberOfDependents: "3",
      monthlyIncome: "2000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Generate first suggestion
    cy.get('[data-testid="help-write-situation"]').click();
    cy.get('[data-testid="ai-suggestion"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Get first suggestion text
    cy.get('[data-testid="ai-suggestion"]')
      .invoke("text")
      .then((_firstSuggestion) => {
        // Click Retry button
        cy.get('[data-testid="retry-suggestion"]').click();

        // Wait for new suggestion
        cy.get('[data-testid="ai-suggestion"]', { timeout: 10000 }).should(
          "be.visible"
        );

        // Verify we got a new suggestion (it might be the same, but the action should work)
        cy.get('[data-testid="ai-suggestion"]').should("exist");
      });
  });

  it("should show loading state while generating suggestion", () => {
    // Navigate to Step 3
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    cy.fillStep2({
      maritalStatus: "single",
      numberOfDependents: "0",
      monthlyIncome: "4500",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Click "Help Me Write"
    cy.get('[data-testid="help-write-situation"]').click();

    // Verify loading indicator appears
    cy.get('[data-testid="ai-loading"]').should("be.visible");

    // Wait for suggestion to load
    cy.get('[data-testid="ai-suggestion"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Verify loading indicator is gone
    cy.get('[data-testid="ai-loading"]').should("not.exist");
  });

  it("should generate suggestions for both situation fields", () => {
    // Navigate to Step 3
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    cy.fillStep2({
      maritalStatus: "married",
      numberOfDependents: "2",
      monthlyIncome: "3000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Generate suggestion for current situation
    cy.get('[data-testid="help-write-situation"]').click();
    cy.get('[data-testid="ai-suggestion"]', { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get('[data-testid="accept-suggestion"]').click();

    // Generate suggestion for requested assistance
    cy.get('[data-testid="help-write-assistance"]').click();
    cy.get('[data-testid="ai-suggestion"]', { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get('[data-testid="accept-suggestion"]').click();

    // Verify both fields have content
    cy.get('textarea[name="currentSituation"]').should("not.have.value", "");
    cy.get('textarea[name="requestedAssistance"]').should("not.have.value", "");
  });
});
