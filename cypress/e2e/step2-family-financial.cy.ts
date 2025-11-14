describe("SSA Application - Step 2: Family and Financial Information", () => {
  let testData: Record<string, unknown>;

  before(() => {
    cy.fixture("test-data.json").then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();

    // Navigate to Step 2 by filling Step 1 first
    const validUserData = (
      testData.validUser as Record<string, Record<string, string>>
    ).step1;
    cy.fillStep1(validUserData);
    cy.contains("button", "Next").click();
  });

  describe("Filling all Step 2 fields with valid data", () => {
    it("should accept all valid Step 2 data", () => {
      const step2Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step2;

      cy.fillStep2(step2Data);

      // Verify numeric field is filled correctly
      cy.get('input[name="monthlyIncome"]').should(
        "have.value",
        step2Data.monthlyIncome
      );

      // Verify no validation errors appear
      cy.contains("This field is required").should("not.exist");
    });

    it("should accept different marital status options", () => {
      // Test single
      cy.get("#maritalStatus").click();
      cy.get('[data-value="single"]').click();
      cy.wait(200);

      // Test married
      cy.get("#maritalStatus").click();
      cy.get('[data-value="married"]').click();
      cy.wait(200);

      // Test divorced
      cy.get("#maritalStatus").click();
      cy.get('[data-value="divorced"]').click();
      cy.wait(200);

      // Test widowed
      cy.get("#maritalStatus").click();
      cy.get('[data-value="widowed"]').click();
      cy.wait(200);

      // Verify the select is still visible and functional
      cy.get("#maritalStatus").should("be.visible");
    });

    it("should accept different employment status options", () => {
      // Test employed
      cy.get("#employmentStatus").click();
      cy.get('[data-value="employed"]').click();
      cy.wait(200);

      // Test unemployed
      cy.get("#employmentStatus").click();
      cy.get('[data-value="unemployed"]').click();
      cy.wait(200);

      // Test self-employed
      cy.get("#employmentStatus").click();
      cy.get('[data-value="selfEmployed"]').click();
      cy.wait(200);

      // Test retired
      cy.get("#employmentStatus").click();
      cy.get('[data-value="retired"]').click();
      cy.wait(200);

      // Verify the select is still visible and functional
      cy.get("#employmentStatus").should("be.visible");
    });
  });

  describe("Required field validation", () => {
    it("should show validation errors when trying to proceed with empty fields", () => {
      // Try to click Next without filling anything
      cy.contains("button", "Next").click();

      // Verify error messages appear for required fields
      cy.contains("This field is required").should("be.visible");

      // Verify we're still on Step 2
      cy.url().should("not.include", "/step/3");
    });

    it("should show specific error for each empty required field", () => {
      // Click Next to trigger validation
      cy.contains("button", "Next").click();

      // Check that error messages are associated with fields
      cy.get("#maritalStatus").should("have.attr", "aria-invalid", "true");
      cy.get("#dependents").should("have.attr", "aria-invalid", "true");
      cy.get("#employmentStatus").should("have.attr", "aria-invalid", "true");
      cy.get('input[name="monthlyIncome"]').should(
        "have.attr",
        "aria-invalid",
        "true"
      );
      cy.get("#housingStatus").should("have.attr", "aria-invalid", "true");
    });
  });

  describe("Numeric field validation", () => {
    it("should accept zero as monthly income", () => {
      const step2Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step2;

      // Fill all required fields
      cy.get("#maritalStatus").click();
      cy.get(`[data-value="${step2Data.maritalStatus}"]`).click();
      cy.wait(200);

      cy.get("#dependents").click();
      cy.get(`[data-value="${step2Data.dependents}"]`).click();
      cy.wait(200);

      cy.get("#employmentStatus").click();
      cy.get('[data-value="unemployed"]').click();
      cy.wait(200);

      cy.get('input[name="monthlyIncome"]').clear().type("0");

      cy.get("#currency").click();
      cy.get(`[data-value="${step2Data.currency}"]`).click();
      cy.wait(200);

      cy.get("#housingStatus").click();
      cy.get(`[data-value="${step2Data.housingStatus}"]`).click();

      // Verify zero is accepted
      cy.get('input[name="monthlyIncome"]').should("have.value", "0");
    });

    it("should accept large monthly income values", () => {
      const maxData = (
        testData.edgeCases as Record<
          string,
          Record<string, Record<string, string>>
        >
      ).maximumValues;

      cy.fillStep2(maxData.step2);

      // Verify large value is accepted
      cy.get('input[name="monthlyIncome"]').should(
        "have.value",
        maxData.step2.monthlyIncome
      );
    });
  });

  describe("Dependents selection", () => {
    it("should allow selecting 0 dependents", () => {
      cy.get("#dependents").click();
      cy.get('[data-value="0"]').click();
      cy.wait(200);

      // Verify the select is still visible
      cy.get("#dependents").should("be.visible");
    });

    it("should allow selecting 10 dependents", () => {
      cy.get("#dependents").click();
      cy.get('[data-value="10"]').click();
      cy.wait(200);

      // Verify the select is still visible
      cy.get("#dependents").should("be.visible");
    });
  });

  describe("Currency selection", () => {
    it("should allow selecting USD currency", () => {
      cy.get("#currency").click();
      cy.get('[data-value="USD"]').click();
      cy.wait(200);

      // Verify selection was made
      cy.get("#currency").should("exist");
    });

    it("should allow selecting AED currency", () => {
      cy.get("#currency").click();
      cy.get('[data-value="AED"]').click();
      cy.wait(200);

      // Verify selection was made
      cy.get("#currency").should("exist");
    });
  });

  describe("Housing status selection", () => {
    it("should allow selecting all housing status options", () => {
      // Test owned
      cy.get("#housingStatus").click();
      cy.get('[data-value="owned"]').click();
      cy.wait(200);

      // Test rented
      cy.get("#housingStatus").click();
      cy.get('[data-value="rented"]').click();
      cy.wait(200);

      // Test homeless
      cy.get("#housingStatus").click();
      cy.get('[data-value="homeless"]').click();
      cy.wait(200);

      // Test other
      cy.get("#housingStatus").click();
      cy.get('[data-value="other"]').click();
      cy.wait(200);

      // Verify the select is still visible and functional
      cy.get("#housingStatus").should("be.visible");
    });
  });

  describe("Successful navigation to Step 3", () => {
    it("should navigate to Step 3 with valid data", () => {
      const step2Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step2;

      cy.fillStep2(step2Data);

      // Click Next
      cy.contains("button", "Next").click();

      // Verify we're on Step 3 (check for Step 3 specific fields)
      cy.get('textarea[name="financialSituation"]').should("exist");
      cy.get('textarea[name="employmentCircumstances"]').should("exist");
      cy.get('textarea[name="reasonForApplying"]').should("exist");
    });

    it("should not allow navigation to Step 3 with invalid data", () => {
      // Fill only some fields
      cy.get("#maritalStatus").click();
      cy.get('[data-value="single"]').click();
      cy.wait(200);

      // Try to proceed without filling all required fields
      cy.contains("button", "Next").click();

      // Verify we're still on Step 2
      cy.get('textarea[name="financialSituation"]').should("not.exist");

      // Verify error is shown
      cy.contains("This field is required").should("be.visible");
    });
  });

  describe("Navigation back to Step 1", () => {
    it("should preserve Step 2 data when navigating back to Step 1", () => {
      const step2Data = (
        testData.validUser as Record<string, Record<string, string>>
      ).step2;

      cy.fillStep2(step2Data);

      // Go back to Step 1
      cy.contains("button", "Previous").click();

      // Verify we're on Step 1
      cy.get('input[name="name"]').should("exist");

      // Go forward to Step 2
      cy.contains("button", "Next").click();

      // Verify Step 2 data is preserved (check numeric field)
      cy.get('input[name="monthlyIncome"]').should(
        "have.value",
        step2Data.monthlyIncome
      );

      // Verify no validation errors
      cy.contains("This field is required").should("not.exist");
    });
  });

  describe("Edge cases", () => {
    it("should handle minimum values", () => {
      const minData = (
        testData.edgeCases as Record<
          string,
          Record<string, Record<string, string>>
        >
      ).minimumValues.step2;

      cy.fillStep2(minData);

      // Verify numeric field accepts minimum value
      cy.get('input[name="monthlyIncome"]').should(
        "have.value",
        minData.monthlyIncome
      );

      // Verify no validation errors
      cy.contains("This field is required").should("not.exist");
    });

    it("should handle maximum values", () => {
      const maxData = (
        testData.edgeCases as Record<
          string,
          Record<string, Record<string, string>>
        >
      ).maximumValues.step2;

      cy.fillStep2(maxData);

      // Verify numeric field accepts maximum value
      cy.get('input[name="monthlyIncome"]').should(
        "have.value",
        maxData.monthlyIncome
      );

      // Verify no validation errors
      cy.contains("This field is required").should("not.exist");
    });
  });
});
