describe("SSA Application - Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  it("should navigate between steps using Next and Previous buttons", () => {
    // Fill and proceed from Step 1
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    // Verify we're on Step 2
    cy.get('[data-testid="step-indicator"]').should("contain", "2");
    cy.contains("Family and Financial Information").should("be.visible");

    // Fill and proceed from Step 2
    cy.fillStep2({
      maritalStatus: "single",
      numberOfDependents: "0",
      monthlyIncome: "4000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Verify we're on Step 3
    cy.get('[data-testid="step-indicator"]').should("contain", "3");
    cy.contains("Situation Description").should("be.visible");

    // Go back to Step 2
    cy.contains("button", "Previous").click();
    cy.get('[data-testid="step-indicator"]').should("contain", "2");
    cy.contains("Family and Financial Information").should("be.visible");

    // Go back to Step 1
    cy.contains("button", "Previous").click();
    cy.get('[data-testid="step-indicator"]').should("contain", "1");
    cy.contains("Personal Information").should("be.visible");
  });

  it("should update progress bar as user navigates", () => {
    // Check initial progress (Step 1)
    cy.get('[data-testid="progress-bar"]').should(
      "have.attr",
      "aria-valuenow",
      "33"
    );

    // Fill Step 1 and proceed
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    // Check progress on Step 2
    cy.get('[data-testid="progress-bar"]').should(
      "have.attr",
      "aria-valuenow",
      "66"
    );

    // Fill Step 2 and proceed
    cy.fillStep2({
      maritalStatus: "single",
      numberOfDependents: "0",
      monthlyIncome: "4000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Check progress on Step 3
    cy.get('[data-testid="progress-bar"]').should(
      "have.attr",
      "aria-valuenow",
      "100"
    );
  });

  it("should highlight current step in step indicator", () => {
    // Step 1 should be active
    cy.get('[data-testid="step-1"]').should("have.class", "active");
    cy.get('[data-testid="step-2"]').should("not.have.class", "active");
    cy.get('[data-testid="step-3"]').should("not.have.class", "active");

    // Navigate to Step 2
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    // Step 2 should be active
    cy.get('[data-testid="step-1"]').should("have.class", "completed");
    cy.get('[data-testid="step-2"]').should("have.class", "active");
    cy.get('[data-testid="step-3"]').should("not.have.class", "active");
  });

  it("should persist form data when navigating back and forth", () => {
    const step1Data = {
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    };

    // Fill Step 1
    cy.fillStep1(step1Data);
    cy.contains("button", "Next").click();

    // Fill Step 2
    cy.fillStep2({
      maritalStatus: "married",
      numberOfDependents: "2",
      monthlyIncome: "5000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Go back to Step 2
    cy.contains("button", "Previous").click();
    cy.get('select[name="maritalStatus"]').should("have.value", "married");
    cy.get('input[name="numberOfDependents"]').should("have.value", "2");

    // Go back to Step 1
    cy.contains("button", "Previous").click();
    cy.get('input[name="firstName"]').should("have.value", step1Data.firstName);
    cy.get('input[name="lastName"]').should("have.value", step1Data.lastName);
    cy.get('input[name="email"]').should("have.value", step1Data.email);
  });

  it("should handle browser back and forward buttons", () => {
    // Fill Step 1 and proceed
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    // Verify we're on Step 2
    cy.get('[data-testid="step-indicator"]').should("contain", "2");

    // Use browser back button
    cy.go("back");

    // Verify we're back on Step 1
    cy.get('[data-testid="step-indicator"]').should("contain", "1");

    // Use browser forward button
    cy.go("forward");

    // Verify we're on Step 2 again
    cy.get('[data-testid="step-indicator"]').should("contain", "2");
  });
});
