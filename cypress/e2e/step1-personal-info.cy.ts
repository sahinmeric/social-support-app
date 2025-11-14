describe("SSA Application - Step 1: Personal Information", () => {
  let testData: Record<string, unknown>;

  before(() => {
    cy.fixture("test-data.json").then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  describe("Filling all Step 1 fields with valid data", () => {
    it("should accept special characters in name field", () => {
      const specialCharData = (testData.edgeCases as Record<string, unknown>)
        .specialCharacters as Record<string, Record<string, string>>;

      cy.get('input[name="name"]').clear().type(specialCharData.step1.name);
      cy.get('input[name="name"]').should(
        "have.value",
        specialCharData.step1.name
      );
    });

    it("should accept Arabic characters in text fields", () => {
      const arabicData = (
        testData.arabicUser as Record<string, Record<string, string>>
      ).step1;

      cy.fillStep1(arabicData);

      // Verify Arabic text is preserved
      cy.get('input[name="name"]').should("have.value", arabicData.name);
      cy.get('textarea[name="address"]').should(
        "have.value",
        arabicData.address
      );
      cy.get('input[name="city"]').should("have.value", arabicData.city);
    });
  });

  describe("Required field validation", () => {
    it("should show validation errors when trying to proceed with empty fields", () => {
      // Try to click Next without filling anything
      cy.contains("button", "Next").click();

      // Verify error messages appear for all required fields
      cy.contains("This field is required").should("be.visible");

      // Verify we're still on Step 1
      cy.url().should("not.include", "/step/2");
    });

    it("should show specific error for each empty required field", () => {
      // Click Next to trigger validation
      cy.contains("button", "Next").click();

      // Check that error messages are associated with fields
      cy.get('input[name="name"]').should("have.attr", "aria-invalid", "true");
      cy.get('input[name="nationalId"]').should(
        "have.attr",
        "aria-invalid",
        "true"
      );
      cy.get('input[name="dateOfBirth"]').should(
        "have.attr",
        "aria-invalid",
        "true"
      );
      cy.get('textarea[name="address"]').should(
        "have.attr",
        "aria-invalid",
        "true"
      );
      cy.get('input[name="city"]').should("have.attr", "aria-invalid", "true");
      cy.get('input[name="state"]').should("have.attr", "aria-invalid", "true");
      cy.get('input[name="country"]').should(
        "have.attr",
        "aria-invalid",
        "true"
      );
      cy.get('input[name="phone"]').should("have.attr", "aria-invalid", "true");
      cy.get('input[name="email"]').should("have.attr", "aria-invalid", "true");
    });
  });

  describe("Email format validation", () => {
    it("should show error for invalid email format on Next click", () => {
      const invalidEmailData = (
        testData.invalidData as Record<
          string,
          Record<string, Record<string, string>>
        >
      ).invalidEmail.step1;

      cy.get('input[name="email"]').type(invalidEmailData.email);

      // Click Next to trigger validation
      cy.contains("button", "Next").click();

      // Verify email format error appears
      cy.contains("Please enter a valid email address").should("be.visible");
      cy.get('input[name="email"]').should("have.attr", "aria-invalid", "true");
    });
  });

  describe("Field sanitization on blur", () => {
    it("should sanitize address field", () => {
      cy.get('textarea[name="address"]').type("  123 Main Street  ");
      cy.get('textarea[name="address"]').blur();

      // Wait a moment for sanitization to occur
      cy.wait(200);

      // Verify extra spaces are removed
      cy.get('textarea[name="address"]').should(
        "have.value",
        "123 Main Street"
      );
    });

    it("should sanitize city field", () => {
      cy.get('input[name="city"]').type("  Riyadh  ");
      cy.get('input[name="city"]').blur();

      // Wait a moment for sanitization to occur
      cy.wait(200);

      // Verify extra spaces are removed
      cy.get('input[name="city"]').should("have.value", "Riyadh");
    });
  });

  describe("Additional field validations", () => {
    it("should validate national ID contains only numbers", () => {
      cy.get('input[name="nationalId"]').type("ABC123");

      // Try to proceed
      cy.contains("button", "Next").click();

      // Verify error appears
      cy.contains("National ID must contain only numbers").should("be.visible");
    });

    it("should validate national ID minimum length", () => {
      cy.get('input[name="nationalId"]').type("123");

      // Try to proceed
      cy.contains("button", "Next").click();

      // Verify minimum length error appears
      cy.contains(/Minimum length is 10 characters/i).should("be.visible");
    });

    it("should validate date of birth is in the past", () => {
      const futureDate = (
        testData.invalidData as Record<
          string,
          Record<string, Record<string, string>>
        >
      ).futureDateOfBirth.step1;

      cy.get('input[name="dateOfBirth"]').type(futureDate.dateOfBirth);

      // Try to proceed
      cy.contains("button", "Next").click();

      // Verify error appears
      cy.contains("Date must be in the past").should("be.visible");
    });

    it("should validate name contains only letters and spaces", () => {
      cy.get('input[name="name"]').type("Ahmed123");

      // Try to proceed
      cy.contains("button", "Next").click();

      // Verify error appears
      cy.contains("Name can only contain letters and spaces").should(
        "be.visible"
      );
    });
  });

  describe("Successful navigation to Step 2", () => {
    it("should not allow navigation to Step 2 with invalid data", () => {
      // Fill with invalid email
      const invalidData = (
        testData.invalidData as Record<
          string,
          Record<string, Record<string, string>>
        >
      ).invalidEmail.step1;

      cy.get('input[name="name"]').type(invalidData.name);
      cy.get('input[name="nationalId"]').type(invalidData.nationalId);
      cy.get('input[name="dateOfBirth"]').type(invalidData.dateOfBirth);
      cy.get("#gender").click();
      cy.get(`[data-value="${invalidData.gender}"]`).click();
      cy.get('textarea[name="address"]').type(invalidData.address);
      cy.get('input[name="city"]').type(invalidData.city);
      cy.get('input[name="state"]').type(invalidData.state);
      cy.get('input[name="country"]').type(invalidData.country);
      cy.get('input[name="phone"]').type(invalidData.phone);
      cy.get('input[name="email"]').type(invalidData.email);

      // Try to proceed
      cy.contains("button", "Next").click();

      // Verify we're still on Step 1 (Step 2 fields should not exist)
      cy.get('select[name="maritalStatus"]').should("not.exist");

      // Verify error is shown
      cy.contains("Please enter a valid email address").should("be.visible");
    });
  });

  describe("Edge cases", () => {
    it("should handle minimum length values", () => {
      const minData = (
        testData.edgeCases as Record<
          string,
          Record<string, Record<string, string>>
        >
      ).minimumValues.step1;

      cy.fillStep1(minData);

      // Verify all fields accept minimum values
      cy.get('input[name="name"]').should("have.value", minData.name);
      cy.get('input[name="city"]').should("have.value", minData.city);
    });

    it("should handle maximum length values", () => {
      const maxData = (
        testData.edgeCases as Record<
          string,
          Record<string, Record<string, string>>
        >
      ).maximumValues.step1;

      cy.fillStep1(maxData);

      // Verify all fields accept maximum values
      cy.get('input[name="name"]').should("have.value", maxData.name);
      cy.get('textarea[name="address"]').should("have.value", maxData.address);
    });
  });
});
