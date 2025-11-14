describe("SSA Application - Step 3: Situation Description", () => {
  let testData: Record<string, unknown>;

  before(() => {
    cy.fixture("test-data.json").then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();

    // Navigate to Step 3 by filling Steps 1 and 2 first
    const validUserData = testData.validUser as Record<
      string,
      Record<string, string>
    >;
    cy.fillStep1(validUserData.step1);
    cy.contains("button", "Next").click();
    cy.fillStep2(validUserData.step2);
    cy.contains("button", "Next").click();
  });

  describe("Filling all Step 3 fields with valid data", () => {
    it("should accept all valid Step 3 data", () => {
      const step3Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step3;

      cy.fillStep3(step3Data);

      // Verify all fields are filled correctly
      cy.get('textarea[name="financialSituation"]').should(
        "have.value",
        step3Data.financialSituation
      );
      cy.get('textarea[name="employmentCircumstances"]').should(
        "have.value",
        step3Data.employmentCircumstances
      );
      cy.get('textarea[name="reasonForApplying"]').should(
        "have.value",
        step3Data.reasonForApplying
      );

      // Verify no validation errors appear
      cy.contains("This field is required").should("not.exist");
    });

    it("should accept Arabic text in all fields", () => {
      const arabicData = (
        testData.arabicUser as Record<string, Record<string, string>>
      ).step3;

      cy.fillStep3(arabicData);

      // Verify Arabic text is preserved
      cy.get('textarea[name="financialSituation"]').should(
        "have.value",
        arabicData.financialSituation
      );
      cy.get('textarea[name="employmentCircumstances"]').should(
        "have.value",
        arabicData.employmentCircumstances
      );
      cy.get('textarea[name="reasonForApplying"]').should(
        "have.value",
        arabicData.reasonForApplying
      );
    });
  });

  describe("Required field validation", () => {
    it("should show validation errors when trying to submit with empty fields", () => {
      // Try to submit without filling anything
      cy.contains("button", "Submit").click();

      // Verify error messages appear for required fields
      cy.contains("This field is required").should("be.visible");
    });

    it("should show specific error for each empty required field", () => {
      // Click Submit to trigger validation
      cy.contains("button", "Submit").click();

      // Check that error messages are associated with fields
      cy.get('textarea[name="financialSituation"]').should(
        "have.attr",
        "aria-invalid",
        "true"
      );
      cy.get('textarea[name="employmentCircumstances"]').should(
        "have.attr",
        "aria-invalid",
        "true"
      );
      cy.get('textarea[name="reasonForApplying"]').should(
        "have.attr",
        "aria-invalid",
        "true"
      );
    });
  });

  describe("Minimum length validation", () => {
    it("should show error when financialSituation is too short", () => {
      cy.get('textarea[name="financialSituation"]').type("Too short");

      // Try to submit
      cy.contains("button", "Submit").click();

      // Verify minimum length error appears
      cy.contains(/Minimum length is 50 characters/i).should("be.visible");
    });

    it("should show error when employmentCircumstances is too short", () => {
      const step3Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step3;

      // Fill other fields with valid data
      cy.get('textarea[name="financialSituation"]').type(
        step3Data.financialSituation
      );
      cy.get('textarea[name="employmentCircumstances"]').type("Too short");
      cy.get('textarea[name="reasonForApplying"]').type(
        step3Data.reasonForApplying
      );

      // Try to submit
      cy.contains("button", "Submit").click();

      // Verify minimum length error appears
      cy.contains(/Minimum length is 50 characters/i).should("be.visible");
    });

    it("should show error when reasonForApplying is too short", () => {
      const step3Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step3;

      // Fill other fields with valid data
      cy.get('textarea[name="financialSituation"]').type(
        step3Data.financialSituation
      );
      cy.get('textarea[name="employmentCircumstances"]').type(
        step3Data.employmentCircumstances
      );
      cy.get('textarea[name="reasonForApplying"]').type("Too short");

      // Try to submit
      cy.contains("button", "Submit").click();

      // Verify minimum length error appears
      cy.contains(/Minimum length is 50 characters/i).should("be.visible");
    });
  });

  describe("Character counter display", () => {
    it("should display character count for financialSituation", () => {
      const testText = "This is a test text for character counting.";
      cy.get('textarea[name="financialSituation"]').type(testText);

      // Verify character counter is displayed
      cy.contains(`(${testText.length}/50)`).should("be.visible");
    });

    it("should update character count as user types", () => {
      cy.get('textarea[name="financialSituation"]').type("Hello");
      cy.contains("(5/50)").should("be.visible");

      cy.get('textarea[name="financialSituation"]').type(" World");
      cy.contains("(11/50)").should("be.visible");
    });

    it("should display character count for all three fields", () => {
      cy.get('textarea[name="financialSituation"]').type("Test 1");
      cy.get('textarea[name="employmentCircumstances"]').type("Test 2");
      cy.get('textarea[name="reasonForApplying"]').type("Test 3");

      // Verify all character counters are displayed
      cy.contains("(6/50)").should("be.visible");
    });
  });

  describe("Form submission with valid data", () => {
    it("should successfully submit with valid data", () => {
      const step3Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step3;

      cy.fillStep3(step3Data);

      // Submit the form
      cy.contains("button", "Submit").click();

      // Verify success page is displayed
      cy.get('[data-testid="success-page"]').should("be.visible");
    });

    it("should not submit with invalid data", () => {
      // Fill with too short text
      cy.get('textarea[name="financialSituation"]').type("Short");
      cy.get('textarea[name="employmentCircumstances"]').type("Short");
      cy.get('textarea[name="reasonForApplying"]').type("Short");

      // Try to submit
      cy.contains("button", "Submit").click();

      // Verify we're still on Step 3
      cy.get('textarea[name="financialSituation"]').should("exist");

      // Verify error is shown
      cy.contains(/Minimum length is 50 characters/i).should("be.visible");
    });
  });

  describe("Success page display", () => {
    it("should display application ID on success page", () => {
      const step3Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step3;

      cy.fillStep3(step3Data);

      // Submit the form
      cy.contains("button", "Submit").click();

      // Verify success page with application ID
      cy.get('[data-testid="success-page"]').should("be.visible");
      cy.get('[data-testid="application-id"]')
        .should("be.visible")
        .and("not.be.empty");
    });

    it("should display success message", () => {
      const step3Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step3;

      cy.fillStep3(step3Data);

      // Submit the form
      cy.contains("button", "Submit").click();

      // Verify success message is displayed
      cy.contains(/submitted successfully/i).should("be.visible");
    });
  });

  describe("Navigation back to Step 2", () => {
    it("should preserve Step 3 data when navigating back to Step 2", () => {
      const step3Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step3;

      cy.fillStep3(step3Data);

      // Go back to Step 2
      cy.contains("button", "Previous").click();

      // Verify we're on Step 2
      cy.get('input[name="monthlyIncome"]').should("exist");

      // Go forward to Step 3
      cy.contains("button", "Next").click();

      // Verify Step 3 data is preserved
      cy.get('textarea[name="financialSituation"]').should(
        "have.value",
        step3Data.financialSituation
      );
      cy.get('textarea[name="employmentCircumstances"]').should(
        "have.value",
        step3Data.employmentCircumstances
      );
      cy.get('textarea[name="reasonForApplying"]').should(
        "have.value",
        step3Data.reasonForApplying
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle minimum length values", () => {
      const minData = (
        testData.edgeCases as Record<
          string,
          Record<string, Record<string, string>>
        >
      ).minimumValues.step3;

      cy.fillStep3(minData);

      // Verify all fields accept minimum values
      cy.get('textarea[name="financialSituation"]').should(
        "have.value",
        minData.financialSituation
      );
      cy.get('textarea[name="employmentCircumstances"]').should(
        "have.value",
        minData.employmentCircumstances
      );
      cy.get('textarea[name="reasonForApplying"]').should(
        "have.value",
        minData.reasonForApplying
      );
    });

    it("should handle maximum length values", () => {
      const maxData = (
        testData.edgeCases as Record<
          string,
          Record<string, Record<string, string>>
        >
      ).maximumValues.step3;

      cy.fillStep3(maxData);

      // Verify all fields accept maximum values
      cy.get('textarea[name="financialSituation"]').should(
        "have.value",
        maxData.financialSituation
      );
      cy.get('textarea[name="employmentCircumstances"]').should(
        "have.value",
        maxData.employmentCircumstances
      );
      cy.get('textarea[name="reasonForApplying"]').should(
        "have.value",
        maxData.reasonForApplying
      );
    });
  });

  describe("Submit button visibility", () => {
    it("should show Submit button instead of Next button on Step 3", () => {
      // Verify Submit button is visible
      cy.contains("button", "Submit").should("be.visible");

      // Verify Next button is not visible
      cy.contains("button", "Next").should("not.exist");
    });
  });
});
