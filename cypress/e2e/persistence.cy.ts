describe("SSA Application - Data Persistence", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  it("should persist form data after page refresh", () => {
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

    // Fill partial Step 2
    cy.get('select[name="maritalStatus"]').select("married");
    cy.get('input[name="numberOfDependents"]').type("2");

    // Refresh the page
    cy.reload();

    // Verify we're still on Step 2
    cy.get('[data-testid="step-indicator"]').should("contain", "2");

    // Verify Step 2 data persisted
    cy.get('select[name="maritalStatus"]').should("have.value", "married");
    cy.get('input[name="numberOfDependents"]').should("have.value", "2");

    // Go back to Step 1 and verify data persisted
    cy.contains("button", "Previous").click();
    cy.get('input[name="firstName"]').should("have.value", step1Data.firstName);
    cy.get('input[name="lastName"]').should("have.value", step1Data.lastName);
    cy.get('input[name="email"]').should("have.value", step1Data.email);
  });

  it("should clear localStorage after successful submission", () => {
    // Fill all steps
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
      monthlyIncome: "4000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    cy.fillStep3({
      currentSituation: "Need financial assistance",
      requestedAssistance: "Monthly support",
    });

    // Submit the form
    cy.contains("button", "Submit").click();

    // Verify success page
    cy.contains("Application Submitted Successfully").should("be.visible");

    // Check that localStorage is cleared
    cy.window().then((win) => {
      const formData = win.localStorage.getItem("ssaFormData");
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(formData).to.be.null;
    });

    // Click "Submit Another Application"
    cy.contains("button", "Submit Another Application").click();

    // Verify form is empty
    cy.get('input[name="firstName"]').should("have.value", "");
    cy.get('input[name="lastName"]').should("have.value", "");
  });

  it("should persist data across multiple page refreshes", () => {
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

    // First refresh
    cy.reload();
    cy.get('[data-testid="step-indicator"]').should("contain", "2");

    // Fill Step 2
    cy.fillStep2({
      maritalStatus: "married",
      numberOfDependents: "3",
      monthlyIncome: "5000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Second refresh
    cy.reload();
    cy.get('[data-testid="step-indicator"]').should("contain", "3");

    // Verify all data is still there by going back
    cy.contains("button", "Previous").click();
    cy.get('select[name="maritalStatus"]').should("have.value", "married");
    cy.get('input[name="numberOfDependents"]').should("have.value", "3");

    cy.contains("button", "Previous").click();
    cy.get('input[name="firstName"]').should("have.value", "Ahmed");
  });

  it("should handle localStorage data corruption gracefully", () => {
    // Set invalid data in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem("ssaFormData", "invalid-json-data");
    });

    // Reload the page
    cy.reload();

    // Should start fresh on Step 1 with empty form
    cy.get('[data-testid="step-indicator"]').should("contain", "1");
    cy.get('input[name="firstName"]').should("have.value", "");
  });
});
