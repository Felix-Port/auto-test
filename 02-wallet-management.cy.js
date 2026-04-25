/**
 * E2E Test Suite: Wallet & Account Management
 * ZenPay by Zenith - SIT Environment
 *
 * Covers:
 * - Balance display
 * - Wallet top-up
 * - Account details
 * - Profile management
 */

import DashboardPage from '../pages/DashboardPage';

describe('Wallet & Account Management', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/');
    cy.waitForLoader();
  });

  context('Wallet Balance', () => {
    it('TC-WALLET-001: Should display wallet balance on dashboard', () => {
      DashboardPage.walletBalance.should('be.visible');
    });

    it('TC-WALLET-002: Should display a numeric balance value', () => {
      DashboardPage.getBalanceText().then((text) => {
        // Should contain numbers
        expect(text).to.match(/[\d,.]+/);
      });
    });

    it('TC-WALLET-003: Should refresh balance after page reload', () => {
      let balanceBefore;
      DashboardPage.getBalanceText().then((text) => {
        balanceBefore = text;
        cy.reload();
        cy.waitForLoader();
        DashboardPage.getBalanceText().should('eq', balanceBefore);
      });
    });

    it('TC-WALLET-004: Should display currency symbol alongside balance', () => {
      DashboardPage.getBalanceText().then((text) => {
        // Should contain ₦ or NGN for Nigerian currency
        expect(text).to.match(/₦|NGN|N/i);
      });
    });
  });

  context('Account / Profile Details', () => {
    it('TC-WALLET-005: Should display user profile information', () => {
      DashboardPage.openProfileMenu();
      cy.contains(/profile|account|settings/i).should('be.visible');
    });

    it('TC-WALLET-006: Should display account number or phone number in profile', () => {
      DashboardPage.openProfileMenu();
      cy.contains(/8143311412|account/i).should('be.visible');
    });

    it('TC-WALLET-007: Should navigate to profile settings page', () => {
      DashboardPage.openProfileMenu();
      cy.contains(/settings|profile/i).click();
      cy.url().should('match', /profile|settings|account/i);
    });
  });

  context('Navigation & UI Elements', () => {
    it('TC-WALLET-008: Should display all core navigation menu items', () => {
      DashboardPage.navMenu.within(() => {
        cy.contains(/home|dashboard/i).should('be.visible');
      });
    });

    it('TC-WALLET-009: Should navigate to Send Money from dashboard', () => {
      DashboardPage.navigateToSend();
      cy.url().should('match', /send|transfer|pay/i);
    });

    it('TC-WALLET-010: Should navigate to Transaction History from dashboard', () => {
      DashboardPage.navigateToTransactionHistory();
      cy.url().should('match', /history|transactions/i);
    });

    it('TC-WALLET-011: Should display notification icon', () => {
      DashboardPage.notificationBell.should('exist');
    });
  });

  context('Wallet Top-Up', () => {
    it('TC-WALLET-012: Should have a fund wallet / top-up option', () => {
      cy.contains(/fund|top.?up|add money|deposit/i).should('be.visible');
    });

    it('TC-WALLET-013: Should open top-up form when clicking fund wallet', () => {
      cy.contains(/fund|top.?up|add money|deposit/i).click();
      cy.get('input[placeholder*="amount" i], input[type="number"]').should('be.visible');
    });

    it('TC-WALLET-014: Should validate minimum top-up amount', () => {
      cy.contains(/fund|top.?up|add money|deposit/i).click();
      cy.get('input[placeholder*="amount" i]').first().type('0');
      cy.get('button').contains(/continue|proceed|next/i).click();
      cy.get('[class*="error" i], [role="alert"]').should('be.visible');
    });
  });
});
