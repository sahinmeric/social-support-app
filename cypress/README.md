# E2E Testing with Cypress

This directory contains end-to-end tests for the SSA application using Cypress.

## Running Tests Locally

### Interactive Mode (Cypress UI)

```bash
npm run cypress:open
```

This opens the Cypress Test Runner where you can select and run tests interactively.

### Headless Mode

```bash
npm run cypress:run
```

Runs all tests in headless mode (no UI).

### With Dev Server

```bash
npm run e2e
```

Automatically starts the dev server, runs tests, and stops the server.

## Test Structure

- `cypress/e2e/` - Test files
  - `happy-path.cy.ts` - Complete application flow
  - `validation.cy.ts` - Form validation tests
  - `navigation.cy.ts` - Navigation and progress tests
  - `persistence.cy.ts` - Data persistence tests
  - `internationalization.cy.ts` - Language switching tests
  - `ai-suggestions.cy.ts` - AI suggestion feature tests
  - `error-scenarios.cy.ts` - Error handling tests

- `cypress/support/` - Custom commands and configuration
  - `commands.ts` - Custom Cypress commands (fillStep1, fillStep2, fillStep3)
  - `e2e.ts` - Global test configuration

## Custom Commands

### fillStep1(data)

Fills personal information fields.

### fillStep2(data)

Fills family and financial information fields.

### fillStep3(data)

Fills situation description fields.

## CI/CD Configuration

Tests are configured to run in headless mode with:

- Video recording enabled (saved on failure)
- Screenshot capture on failures
- Viewport: 1280x720

Videos and screenshots are saved to `cypress/videos/` and `cypress/screenshots/`.
