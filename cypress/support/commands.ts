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
      fillStep1(data: Step1Data): Chainable<void>;
      fillStep2(data: Step2Data): Chainable<void>;
      fillStep3(data: Step3Data): Chainable<void>;
    }
  }
}

// TypeScript interfaces for form data
interface Step1Data {
  name: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
}

interface Step2Data {
  maritalStatus: string;
  dependents: string;
  employmentStatus: string;
  monthlyIncome: string;
  currency: string;
  housingStatus: string;
}

interface Step3Data {
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

// Custom command to fill Step 1 (Personal Information)
Cypress.Commands.add("fillStep1", (data) => {
  cy.get('input[name="name"]').clear().type(data.name);
  cy.get('input[name="nationalId"]').clear().type(data.nationalId);
  cy.get('input[name="dateOfBirth"]').clear().type(data.dateOfBirth);

  // Handle MUI Select for gender
  cy.get("#gender").click();
  cy.get(`[data-value="${data.gender}"]`).click();

  cy.get('textarea[name="address"]').clear().type(data.address);
  cy.get('input[name="city"]').clear().type(data.city);
  cy.get('input[name="state"]').clear().type(data.state);
  cy.get('input[name="country"]').clear().type(data.country);
  cy.get('input[name="phone"]').clear().type(data.phone);
  cy.get('input[name="email"]').clear().type(data.email);
});

// Custom command to fill Step 2 (Family and Financial Information)
Cypress.Commands.add("fillStep2", (data) => {
  cy.get('select[name="maritalStatus"]').select(data.maritalStatus);
  cy.get('select[name="dependents"]').select(data.dependents);
  cy.get('select[name="employmentStatus"]').select(data.employmentStatus);
  cy.get('input[name="monthlyIncome"]').clear().type(data.monthlyIncome);
  cy.get('select[name="currency"]').select(data.currency);
  cy.get('select[name="housingStatus"]').select(data.housingStatus);
});

// Custom command to fill Step 3 (Situation Description)
Cypress.Commands.add("fillStep3", (data) => {
  cy.get('textarea[name="financialSituation"]')
    .clear()
    .type(data.financialSituation);
  cy.get('textarea[name="employmentCircumstances"]')
    .clear()
    .type(data.employmentCircumstances);
  cy.get('textarea[name="reasonForApplying"]')
    .clear()
    .type(data.reasonForApplying);
});

export {};
