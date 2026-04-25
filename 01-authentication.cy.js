/**
 * E2E Test Suite: Authentication
 * ZenPay by Zenith - SIT Environment
 * 
 * Covers:
 * - Valid login
 * - Invalid credentials
 * - Empty field validation
 * - Logout
 * - Session persistence
 */

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';

describe('Authentication', () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  context('Login - Happy Path', () => {
    it('TC-AUTH-001: Should display the login page with required fields', () => {
      LoginPage.phoneInput.should('be.visible');
      LoginPage.passcodeInput.should('be.visible');
      LoginPage.loginButton.should('be.visible');
    });

    it('TC-AUTH-002: Should successfully login with valid phone and passcode', () => {
      cy.fixture('testData').then((data) => {
        LoginPage.login(data.validUser.phone, data.validUser.passcode);
        DashboardPage.waitForDashboardLoad();
        DashboardPage.verifyDashboardLoaded();
      });
    });

    it('TC-AUTH-003: Should redirect to dashboard after successful login', () => {
      cy.fixture('testData').then((data) => {
        LoginPage.login(data.validUser.phone, data.validUser.passcode);
        cy.url().should('not.eq', Cypress.config('baseUrl') + '/');
      });
    });

    it('TC-AUTH-004: Should display wallet balance after login', () => {
      cy.loginAsTestUser();
      cy.visit('/');
      DashboardPage.walletBalance.should('be.visible');
    });
  });

  context('Login - Negative Tests', () => {
    it('TC-AUTH-005: Should show error for invalid phone number and wrong passcode', () => {
      cy.fixture('testData').then((data) => {
        LoginPage.login(data.invalidUser.phone, data.invalidUser.passcode);
        LoginPage.verifyErrorDisplayed();
      });
    });

    it('TC-AUTH-006: Should show error for valid phone with wrong passcode', () => {
      cy.fixture('testData').then((data) => {
        LoginPage.login(data.wrongPasscode.phone, data.wrongPasscode.passcode);
        LoginPage.verifyErrorDisplayed();
      });
    });

    it('TC-AUTH-007: Should prevent login with empty phone number', () => {
      LoginPage.enterPasscode('159753');
      LoginPage.clickLogin();
      // Should stay on login page
      LoginPage.verifyOnLoginPage();
    });

    it('TC-AUTH-008: Should prevent login with empty passcode', () => {
      LoginPage.enterPhone('8143311412');
      LoginPage.clickLogin();
      // Should stay on login page
      LoginPage.verifyOnLoginPage();
    });

    it('TC-AUTH-009: Should prevent login with both fields empty', () => {
      LoginPage.clickLogin();
      LoginPage.verifyOnLoginPage();
    });

    it('TC-AUTH-010: Should show error for phone number with invalid format', () => {
      LoginPage.login('abc-invalid', '159753');
      LoginPage.verifyOnLoginPage();
    });
  });

  context('Logout', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
      cy.visit('/');
    });

    it('TC-AUTH-011: Should successfully logout', () => {
      DashboardPage.logout();
      LoginPage.verifyOnLoginPage();
    });

    it('TC-AUTH-012: Should redirect to login page after logout', () => {
      DashboardPage.logout();
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });

    it('TC-AUTH-013: Should not access dashboard after logout', () => {
      DashboardPage.logout();
      cy.visit('/');
      LoginPage.verifyOnLoginPage();
    });
  });

  context('Session Management', () => {
    it('TC-AUTH-014: Should persist session on page refresh', () => {
      cy.loginAsTestUser();
      cy.visit('/');
      cy.reload();
      DashboardPage.verifyDashboardLoaded();
    });

    it('TC-AUTH-015: Should have forgot passcode link visible', () => {
      LoginPage.forgotPasscode.should('be.visible');
    });
  });
});
