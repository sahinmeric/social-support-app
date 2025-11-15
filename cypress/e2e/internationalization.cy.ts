// Cypress provides describe, it, and beforeEach globally - no imports needed
describe("SSA Application - Internationalization", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  it("should switch to Arabic language and verify translations", () => {
    // Click language selector to Arabic
    cy.get('[data-testid="language-selector"]').click();
    cy.get('[role="option"]').contains("Arabic").click();

    // Verify Arabic text appears
    cy.contains("المعلومات الشخصية").should("be.visible");
    cy.contains("التالي").should("be.visible");

    // Verify form labels are in Arabic
    cy.contains("الاسم الكامل").should("be.visible");
    cy.contains("رقم الهوية الوطنية").should("be.visible");
    cy.contains("البريد الإلكتروني").should("be.visible");
  });

  it("should apply RTL layout when Arabic is selected", () => {
    // Switch to Arabic
    cy.get('[data-testid="language-selector"]').click();
    cy.get('[role="option"]').contains("Arabic").click();

    // Verify RTL direction is applied
    cy.get("html").should("have.attr", "dir", "rtl");
    cy.get("body").should("have.css", "direction", "rtl");

    // Switch back to English
    cy.get('[data-testid="language-selector"]').click();
    cy.contains("الإنجليزية").click();

    // Verify LTR direction is restored
    cy.get("html").should("have.attr", "dir", "ltr");
    cy.get("body").should("have.css", "direction", "ltr");
  });

  it("should complete and submit form in Arabic", () => {
    // Switch to Arabic
    cy.get('[data-testid="language-selector"]').click();
    cy.get('[role="option"]').contains("Arabic").click();

    // Verify Arabic is active
    cy.contains("المعلومات الشخصية").should("be.visible");

    // Fill Step 1 in Arabic
    cy.fillStep1({
      name: "أحمد حسن",
      nationalId: "1234567890",
      dateOfBirth: "1990-01-15",
      gender: "male",
      address: "123 شارع الرئيسي",
      city: "الرياض",
      state: "منطقة الرياض",
      country: "المملكة العربية السعودية",
      phone: "+966501234567",
      email: "ahmed@example.com",
    });

    // Click Next (in Arabic)
    cy.contains("button", "التالي").click();

    // Wait for Step 2 to load
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "2"
    );

    // Verify Step 2 title is in Arabic
    cy.contains("معلومات العائلة والمالية").should("be.visible");

    // Fill Step 2
    cy.fillStep2({
      maritalStatus: "married",
      dependents: "2",
      employmentStatus: "employed",
      monthlyIncome: "5000",
      currency: "USD",
      housingStatus: "rented",
    });
    cy.contains("button", "التالي").click();

    // Wait for Step 3 to load
    cy.get('[data-testid="step-indicator"]', { timeout: 10000 }).should(
      "contain",
      "3"
    );

    // Verify Step 3 title is in Arabic
    cy.contains("وصف الحالة").should("be.visible");

    // Verify Submit button is in Arabic
    cy.contains("button", "إرسال").should("be.visible");
  });

  it("should persist language preference across page refresh", () => {
    // Switch to Arabic
    cy.get('[data-testid="language-selector"]').click();
    cy.get('[role="option"]').contains("Arabic").click();

    // Verify Arabic is active
    cy.contains("المعلومات الشخصية").should("be.visible");

    // Refresh page
    cy.reload();

    // Verify Arabic is still active
    cy.contains("المعلومات الشخصية").should("be.visible");
    cy.get("html").should("have.attr", "dir", "rtl");
  });

  it("should switch between languages multiple times", () => {
    // Start in English
    cy.contains("Personal Information").should("be.visible");

    // Switch to Arabic
    cy.get('[data-testid="language-selector"]').click();
    cy.get('[role="option"]').contains("Arabic").click();
    cy.contains("المعلومات الشخصية").should("be.visible");

    // Switch back to English (now menu is in Arabic)
    cy.get('[data-testid="language-selector"]').click();
    cy.get('[role="option"]').contains("الإنجليزية").click();
    cy.contains("Personal Information").should("be.visible");

    // Switch to Arabic again
    cy.get('[data-testid="language-selector"]').click();
    cy.get('[role="option"]').contains("Arabic").click();
    cy.contains("المعلومات الشخصية").should("be.visible");
  });

  it("should maintain form data when switching languages", () => {
    // Fill some data in English
    cy.get('input[name="name"]').type("Ahmed Hassan");
    cy.get('input[name="email"]').type("ahmed@example.com");

    // Switch to Arabic
    cy.get('[data-testid="language-selector"]').click();
    cy.get('[role="option"]').contains("Arabic").click();

    // Verify data is still there
    cy.get('input[name="name"]').should("have.value", "Ahmed Hassan");
    cy.get('input[name="email"]').should("have.value", "ahmed@example.com");

    // Switch back to English (now menu is in Arabic)
    cy.get('[data-testid="language-selector"]').click();
    cy.get('[role="option"]').contains("الإنجليزية").click();

    // Verify data is still there
    cy.get('input[name="name"]').should("have.value", "Ahmed Hassan");
    cy.get('input[name="email"]').should("have.value", "ahmed@example.com");
  });
});
