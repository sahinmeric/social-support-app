/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      fillStep1(data: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dateOfBirth: string;
        nationalId: string;
      }): Chainable<void>;
      fillStep2(data: {
        maritalStatus: string;
        numberOfDependents: string;
        monthlyIncome: string;
        hasOtherIncome: boolean;
        otherIncomeSource?: string;
        otherIncomeAmount?: string;
      }): Chainable<void>;
      fillStep3(data: {
        currentSituation: string;
        requestedAssistance: string;
        additionalInfo?: string;
      }): Chainable<void>;
    }
  }
}

// Custom command to fill Step 1 (Personal Information)
Cypress.Commands.add("fillStep1", (data) => {
  cy.get('input[name="firstName"]').clear().type(data.firstName);
  cy.get('input[name="lastName"]').clear().type(data.lastName);
  cy.get('input[name="email"]').clear().type(data.email);
  cy.get('input[name="phone"]').clear().type(data.phone);
  cy.get('input[name="dateOfBirth"]').clear().type(data.dateOfBirth);
  cy.get('input[name="nationalId"]').clear().type(data.nationalId);
});

// Custom command to fill Step 2 (Family and Financial Information)
Cypress.Commands.add("fillStep2", (data) => {
  cy.get('select[name="maritalStatus"]').select(data.maritalStatus);
  cy.get('input[name="numberOfDependents"]')
    .clear()
    .type(data.numberOfDependents);
  cy.get('input[name="monthlyIncome"]').clear().type(data.monthlyIncome);

  if (data.hasOtherIncome) {
    cy.get('input[name="hasOtherIncome"]').check();
    if (data.otherIncomeSource) {
      cy.get('input[name="otherIncomeSource"]')
        .clear()
        .type(data.otherIncomeSource);
    }
    if (data.otherIncomeAmount) {
      cy.get('input[name="otherIncomeAmount"]')
        .clear()
        .type(data.otherIncomeAmount);
    }
  }
});

// Custom command to fill Step 3 (Situation Description)
Cypress.Commands.add("fillStep3", (data) => {
  cy.get('textarea[name="currentSituation"]')
    .clear()
    .type(data.currentSituation);
  cy.get('textarea[name="requestedAssistance"]')
    .clear()
    .type(data.requestedAssistance);

  if (data.additionalInfo) {
    cy.get('textarea[name="additionalInfo"]').clear().type(data.additionalInfo);
  }
});

export {};
