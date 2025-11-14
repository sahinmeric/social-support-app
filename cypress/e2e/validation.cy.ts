describe("SSA Application - Form Validation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  it("should show validation errors when trying to proceed with empty fields on Step 1", () => {
    // Try to click Next without filling anything
    cy.contains("button", "Next").click();

    // Verify error messages appear
    cy.contains("First name is required").should("be.visible");
    cy.contains("Last name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Phone number is required").should("be.visible");
    cy.contains("Date of birth is required").should("be.visible");
    cy.contains("National ID is required").should("be.visible");

    // Verify we're still on Step 1
    cy.get('[data-testid="step-indicator"]').should("contain", "1");
  });

  it("should validate email format", () => {
    cy.get('input[name="email"]').type("invalid-email");
    cy.get('input[name="email"]').blur();

    // Verify email format error
    cy.contains("Invalid email format").should("be.visible");

    // Fix the email
    cy.get('input[name="email"]').clear().type("valid@example.com");
    cy.get('input[name="email"]').blur();

    // Verify error clears
    cy.contains("Invalid email format").should("not.exist");
  });

  it("should validate phone number format", () => {
    cy.get('input[name="phone"]').type("123");
    cy.get('input[name="phone"]').blur();

    // Verify phone format error
    cy.contains("Invalid phone number").should("be.visible");

    // Fix the phone
    cy.get('input[name="phone"]').clear().type("+966501234567");
    cy.get('input[name="phone"]').blur();

    // Verify error clears
    cy.contains("Invalid phone number").should("not.exist");
  });

  it("should show validation errors on Step 2", () => {
    // Fill Step 1 to proceed
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    // Try to proceed without filling Step 2
    cy.contains("button", "Next").click();

    // Verify error messages
    cy.contains("Marital status is required").should("be.visible");
    cy.contains("Number of dependents is required").should("be.visible");
    cy.contains("Monthly income is required").should("be.visible");
  });

  it("should show validation errors on Step 3", () => {
    // Fill Step 1
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });
    cy.contains("button", "Next").click();

    // Fill Step 2
    cy.fillStep2({
      maritalStatus: "single",
      numberOfDependents: "0",
      monthlyIncome: "3000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Try to submit without filling Step 3
    cy.contains("button", "Submit").click();

    // Verify error messages
    cy.contains("Current situation is required").should("be.visible");
    cy.contains("Requested assistance is required").should("be.visible");
  });

  it("should clear errors when fields are filled correctly", () => {
    // Try to proceed without filling
    cy.contains("button", "Next").click();

    // Verify errors appear
    cy.contains("First name is required").should("be.visible");

    // Fill the form
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });

    // Verify errors clear
    cy.contains("First name is required").should("not.exist");
    cy.contains("Last name is required").should("not.exist");
    cy.contains("Email is required").should("not.exist");
  });
});
