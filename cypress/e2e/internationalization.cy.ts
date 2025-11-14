describe("SSA Application - Internationalization", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
  });

  it("should switch to Arabic language and verify translations", () => {
    // Click language switcher to Arabic
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains("العربية").click();

    // Verify Arabic text appears
    cy.contains("المعلومات الشخصية").should("be.visible");
    cy.contains("التالي").should("be.visible");

    // Verify form labels are in Arabic
    cy.contains("الاسم الأول").should("be.visible");
    cy.contains("اسم العائلة").should("be.visible");
    cy.contains("البريد الإلكتروني").should("be.visible");
  });

  it("should apply RTL layout when Arabic is selected", () => {
    // Switch to Arabic
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains("العربية").click();

    // Verify RTL direction is applied
    cy.get("html").should("have.attr", "dir", "rtl");
    cy.get("body").should("have.css", "direction", "rtl");

    // Switch back to English
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains("English").click();

    // Verify LTR direction is restored
    cy.get("html").should("have.attr", "dir", "ltr");
    cy.get("body").should("have.css", "direction", "ltr");
  });

  it("should complete and submit form in Arabic", () => {
    // Switch to Arabic
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains("العربية").click();

    // Fill Step 1 in Arabic
    cy.fillStep1({
      firstName: "أحمد",
      lastName: "حسن",
      email: "ahmed@example.com",
      phone: "+966501234567",
      dateOfBirth: "1990-01-15",
      nationalId: "1234567890",
    });

    // Click Next (in Arabic)
    cy.contains("button", "التالي").click();

    // Fill Step 2
    cy.fillStep2({
      maritalStatus: "married",
      numberOfDependents: "2",
      monthlyIncome: "5000",
      hasOtherIncome: false,
    });
    cy.contains("button", "التالي").click();

    // Fill Step 3
    cy.fillStep3({
      currentSituation: "أحتاج إلى مساعدة مالية",
      requestedAssistance: "دعم شهري",
    });

    // Submit (in Arabic)
    cy.contains("button", "إرسال").click();

    // Verify success message in Arabic
    cy.contains("تم إرسال الطلب بنجاح").should("be.visible");
  });

  it("should persist language preference across page refresh", () => {
    // Switch to Arabic
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains("العربية").click();

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
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains("العربية").click();
    cy.contains("المعلومات الشخصية").should("be.visible");

    // Switch back to English
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains("English").click();
    cy.contains("Personal Information").should("be.visible");

    // Switch to Arabic again
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains("العربية").click();
    cy.contains("المعلومات الشخصية").should("be.visible");
  });

  it("should maintain form data when switching languages", () => {
    // Fill some data in English
    cy.get('input[name="firstName"]').type("Ahmed");
    cy.get('input[name="lastName"]').type("Hassan");

    // Switch to Arabic
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains("العربية").click();

    // Verify data is still there
    cy.get('input[name="firstName"]').should("have.value", "Ahmed");
    cy.get('input[name="lastName"]').should("have.value", "Hassan");

    // Switch back to English
    cy.get('[data-testid="language-switcher"]').click();
    cy.contains("English").click();

    // Verify data is still there
    cy.get('input[name="firstName"]').should("have.value", "Ahmed");
    cy.get('input[name="lastName"]').should("have.value", "Hassan");
  });
});
