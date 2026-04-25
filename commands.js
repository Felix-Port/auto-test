// ***********************************************
// Custom Cypress Commands for ZenPay E2E Tests
// ***********************************************

/**
 * Login command - reusable across all test suites
 */
Cypress.Commands.add('login', (phone, passcode) => {
  cy.session(
    [phone, passcode],
    () => {
      cy.visit('/');
      cy.get('input[type="tel"], input[placeholder*="phone" i]').first().type(phone);
      cy.get('input[type="password"], input[placeholder*="passcode" i], input[placeholder*="pin" i]').first().type(passcode);
      cy.get('button[type="submit"], button').contains(/login|sign in|continue/i).click();
      cy.url().should('not.include', '/login', { timeout: 15000 });
    },
    {
      validate() {
        cy.url().should('not.include', '/login');
      },
    }
  );
});

/**
 * Login with default test credentials
 */
Cypress.Commands.add('loginAsTestUser', () => {
  cy.login(Cypress.env('phone'), Cypress.env('passcode'));
});

/**
 * Intercept and stub API calls for payment flows
 */
Cypress.Commands.add('interceptPaymentAPI', () => {
  cy.intercept('POST', '**/transfer**').as('transferRequest');
  cy.intercept('GET', '**/balance**').as('balanceRequest');
  cy.intercept('GET', '**/transactions**').as('transactionsRequest');
});

/**
 * Wait for page loader to disappear
 */
Cypress.Commands.add('waitForLoader', () => {
  cy.get('[class*="loader" i], [class*="spinner" i]', { timeout: 2000 })
    .should('not.exist')
    .catch(() => {
      // Loader may not exist, that's fine
    });
});

/**
 * Assert toast/notification message
 */
Cypress.Commands.add('assertToast', (message) => {
  cy.get('[class*="toast" i], [class*="snack" i], [role="alert"]')
    .should('be.visible')
    .and('contain.text', message);
});
