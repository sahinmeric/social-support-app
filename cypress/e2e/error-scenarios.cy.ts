describe("SSA Application - Error Scenarios", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  it("should handle network error during form submission", () => {
    // Intercept the submission API call and force a network error
    cy.intercept("POST", "/api/applications", {
      forceNetworkError: true,
    }).as("submitApplication");

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
      currentSituation: "Need assistance",
      requestedAssistance: "Financial support",
    });

    // Submit the form
    cy.contains("button", "Submit").click();

    // Wait for the API call
    cy.wait("@submitApplication");

    // Verify error message is displayed
    cy.contains("Network error").should("be.visible");
    cy.contains("Please check your connection").should("be.visible");

    // Verify we're still on Step 3
    cy.get('[data-testid="step-indicator"]').should("contain", "3");
  });

  it("should handle server error during form submission", () => {
    // Intercept the submission API call and return 500 error
    cy.intercept("POST", "/api/applications", {
      statusCode: 500,
      body: { error: "Internal server error" },
    }).as("submitApplication");

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
      maritalStatus: "married",
      numberOfDependents: "2",
      monthlyIncome: "3500",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    cy.fillStep3({
      currentSituation: "Need assistance",
      requestedAssistance: "Financial support",
    });

    // Submit the form
    cy.contains("button", "Submit").click();

    // Wait for the API call
    cy.wait("@submitApplication");

    // Verify error message is displayed
    cy.contains("submission failed").should("be.visible");
  });

  it("should handle AI service error", () => {
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
      monthlyIncome: "4000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    // Intercept AI suggestion API and return error
    cy.intercept("POST", "/api/ai/suggest", {
      statusCode: 503,
      body: { error: "AI service unavailable" },
    }).as("aiSuggest");

    // Click "Help Me Write"
    cy.get('[data-testid="help-write-situation"]').click();

    // Wait for the API call
    cy.wait("@aiSuggest");

    // Verify error message is displayed
    cy.contains("AI service is currently unavailable").should("be.visible");
  });

  it("should recover from error and allow retry", () => {
    // First attempt: return error
    cy.intercept("POST", "/api/applications", {
      statusCode: 500,
      body: { error: "Server error" },
    }).as("submitFail");

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
      currentSituation: "Need assistance",
      requestedAssistance: "Financial support",
    });

    // Submit the form
    cy.contains("button", "Submit").click();
    cy.wait("@submitFail");

    // Verify error message
    cy.contains("submission failed").should("be.visible");

    // Second attempt: return success
    cy.intercept("POST", "/api/applications", {
      statusCode: 200,
      body: { applicationId: "APP-12345" },
    }).as("submitSuccess");

    // Retry submission
    cy.contains("button", "Submit").click();
    cy.wait("@submitSuccess");

    // Verify success
    cy.contains("Application Submitted Successfully").should("be.visible");
  });

  it("should display validation errors from server", () => {
    // Intercept submission and return validation errors
    cy.intercept("POST", "/api/applications", {
      statusCode: 400,
      body: {
        errors: {
          email: "Email is already registered",
          nationalId: "Invalid national ID format",
        },
      },
    }).as("submitApplication");

    // Fill all steps
    cy.fillStep1({
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "duplicate@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "invalid",
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
      currentSituation: "Need assistance",
      requestedAssistance: "Financial support",
    });

    // Submit the form
    cy.contains("button", "Submit").click();
    cy.wait("@submitApplication");

    // Verify server validation errors are displayed
    cy.contains("Email is already registered").should("be.visible");
    cy.contains("Invalid national ID format").should("be.visible");
  });

  it("should handle timeout errors gracefully", () => {
    // Intercept and delay response significantly
    cy.intercept("POST", "/api/applications", (req) => {
      req.reply({
        delay: 30000, // 30 second delay
        statusCode: 408,
        body: { error: "Request timeout" },
      });
    }).as("submitApplication");

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
      currentSituation: "Need assistance",
      requestedAssistance: "Financial support",
    });

    // Submit the form
    cy.contains("button", "Submit").click();

    // Verify timeout error message
    cy.contains("request timed out", { timeout: 35000 }).should("be.visible");
  });

  it("should preserve form data after error", () => {
    // Intercept and return error
    cy.intercept("POST", "/api/applications", {
      statusCode: 500,
      body: { error: "Server error" },
    }).as("submitApplication");

    const formData = {
      firstName: "Ahmed",
      lastName: "Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    };

    // Fill all steps
    cy.fillStep1(formData);
    cy.contains("button", "Next").click();

    cy.fillStep2({
      maritalStatus: "married",
      numberOfDependents: "2",
      monthlyIncome: "5000",
      hasOtherIncome: false,
    });
    cy.contains("button", "Next").click();

    cy.fillStep3({
      currentSituation: "Need assistance",
      requestedAssistance: "Financial support",
    });

    // Submit and get error
    cy.contains("button", "Submit").click();
    cy.wait("@submitApplication");

    // Go back to Step 1
    cy.contains("button", "Previous").click();
    cy.contains("button", "Previous").click();

    // Verify data is still there
    cy.get('input[name="firstName"]').should("have.value", formData.firstName);
    cy.get('input[name="lastName"]').should("have.value", formData.lastName);
    cy.get('input[name="email"]').should("have.value", formData.email);
  });
});
