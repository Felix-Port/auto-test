/**
 * Smoke Test Suite: ZenPay Critical Path
 * ZenPay by Zenith - SIT Environment
 *
 * A fast, critical-path smoke test to verify the app is functioning.
 * Run this before full regression to confirm environment health.
 *
 * Execution time target: < 2 minutes
 */

describe('🔥 Smoke Tests - Critical Path', { tags: ['@smoke'] }, () => {
  it('SMOKE-001: App loads successfully', () => {
    cy.visit('/');
    cy.title().should('not.be.empty');
    cy.get('body').should('be.visible');
  });

  it('SMOKE-002: Login page is accessible', () => {
    cy.visit('/');
    cy.get('input').should('have.length.at.least', 2);
    cy.get('button').contains(/login|sign in|continue/i).should('be.visible');
  });

  it('SMOKE-003: Can login with valid credentials', () => {
    cy.visit('/');
    cy.get('input[type="tel"], input[placeholder*="phone" i]').first().type(Cypress.env('phone'));
    cy.get('input[type="password"], input[placeholder*="passcode" i]').first().type(Cypress.env('passcode'));
    cy.get('button[type="submit"], button').contains(/login|sign in|continue/i).click();
    cy.url().should('not.eq', Cypress.config('baseUrl') + '/', { timeout: 15000 });
  });

  it('SMOKE-004: Dashboard loads after login', () => {
    cy.loginAsTestUser();
    cy.visit('/');
    cy.get('body').should('be.visible');
    cy.contains(/balance|wallet|dashboard/i).should('be.visible');
  });

  it('SMOKE-005: Send money page is accessible', () => {
    cy.loginAsTestUser();
    cy.visit('/');
    cy.contains(/send|transfer|pay/i).click();
    cy.get('input').should('have.length.at.least', 2);
  });

  it('SMOKE-006: Transaction history page is accessible', () => {
    cy.loginAsTestUser();
    cy.visit('/');
    cy.contains(/history|transactions/i).click();
    cy.url().should('match', /history|transactions/i);
  });

  it('SMOKE-007: Can logout successfully', () => {
    cy.loginAsTestUser();
    cy.visit('/');
    cy.get('[class*="profile" i], [class*="avatar" i]').first().click();
    cy.contains(/logout|sign out/i).click();
    cy.get('input[type="password"], input[placeholder*="passcode" i]').should('be.visible');
  });
});
