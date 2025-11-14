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
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed.hassan@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });

    // Click Next
    cy.contains("button", "Next").click();

    // Verify we're on Step 2
    cy.contains("Family and Financial Information").should("be.visible");
    cy.get('[data-testid="step-indicator"]').should("contain", "2");

    // Fill Step 2
    cy.fillStep2({
      maritalStatus: "married",
      numberOfDependents: "3",
      monthlyIncome: "5000",
      hasOtherIncome: true,
      otherIncomeSource: "Freelance work",
      otherIncomeAmount: "1500",
    });

    // Click Next
    cy.contains("button", "Next").click();

    // Verify we're on Step 3
    cy.contains("Situation Description").should("be.visible");
    cy.get('[data-testid="step-indicator"]').should("contain", "3");

    // Fill Step 3
    cy.fillStep3({
      currentSituation:
        "I am currently facing financial difficulties due to unexpected medical expenses for my family.",
      requestedAssistance:
        "I am requesting financial assistance to help cover medical bills and basic living expenses.",
      additionalInfo:
        "I have attached relevant medical documents for your review.",
    });

    // Submit the form
    cy.contains("button", "Submit").click();

    // Verify success page
    cy.contains("Application Submitted Successfully").should("be.visible");

    // Verify application ID is displayed
    cy.get('[data-testid="application-id"]')
      .should("be.visible")
      .and("not.be.empty");

    // Test "Submit Another Application" button
    cy.contains("button", "Submit Another Application").click();

    // Verify we're back at Step 1 with empty form
    cy.contains("Personal Information").should("be.visible");
    cy.get('input[name="firstName"]').should("have.value", "");
  });
});
