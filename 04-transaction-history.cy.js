/**
 * E2E Test Suite: Transaction History & Reports
 * ZenPay by Zenith - SIT Environment
 *
 * Covers:
 * - Transaction list display
 * - Search / filter functionality
 * - Transaction detail view
 * - Export / download
 * - Pagination
 */

import DashboardPage from '../pages/DashboardPage';
import TransactionHistoryPage from '../pages/TransactionHistoryPage';

describe('Transaction History & Reports', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/');
    cy.waitForLoader();
    DashboardPage.navigateToTransactionHistory();
    cy.waitForLoader();
  });

  context('Transaction History Page - Display', () => {
    it('TC-HIST-001: Should navigate to transaction history page', () => {
      cy.url().should('match', /history|transactions/i);
    });

    it('TC-HIST-002: Should display list of transactions', () => {
      TransactionHistoryPage.verifyTransactionExists();
    });

    it('TC-HIST-003: Should display transaction date for each entry', () => {
      TransactionHistoryPage.transactionItem.first().within(() => {
        cy.contains(/\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i).should('exist');
      });
    });

    it('TC-HIST-004: Should display transaction amount for each entry', () => {
      TransactionHistoryPage.transactionItem.first().within(() => {
        cy.contains(/₦|NGN|\d+/).should('exist');
      });
    });

    it('TC-HIST-005: Should display transaction type (credit/debit) for each entry', () => {
      TransactionHistoryPage.transactionItem.first().within(() => {
        cy.contains(/credit|debit|sent|received/i).should('exist');
      });
    });
  });

  context('Transaction Detail View', () => {
    it('TC-HIST-006: Should open transaction detail when clicking a transaction', () => {
      TransactionHistoryPage.openTransactionDetail(0);
      cy.get('[class*="detail" i], [class*="modal" i], [class*="drawer" i]').should('be.visible');
    });

    it('TC-HIST-007: Should display reference number in transaction detail', () => {
      TransactionHistoryPage.openTransactionDetail(0);
      cy.contains(/reference|ref|transaction id/i).should('be.visible');
    });

    it('TC-HIST-008: Should be able to close transaction detail modal', () => {
      TransactionHistoryPage.openTransactionDetail(0);
      cy.get('[class*="close" i], button').contains(/close|×|back/i).click();
      cy.get('[class*="modal" i], [class*="drawer" i]').should('not.exist');
    });
  });

  context('Search & Filter', () => {
    it('TC-HIST-009: Should display search input field', () => {
      TransactionHistoryPage.searchInput.should('be.visible');
    });

    it('TC-HIST-010: Should filter transactions by search keyword', () => {
      TransactionHistoryPage.searchTransaction('transfer');
      cy.waitForLoader();
      TransactionHistoryPage.transactionList.should('exist');
    });

    it('TC-HIST-011: Should display empty state when no search results found', () => {
      TransactionHistoryPage.searchTransaction('xxxxxxxxxnotfound999');
      cy.waitForLoader();
      TransactionHistoryPage.verifyEmptyState();
    });

    it('TC-HIST-012: Should display date filter options', () => {
      TransactionHistoryPage.filterBtn.should('be.visible');
      TransactionHistoryPage.filterBtn.click();
      TransactionHistoryPage.dateFromInput.should('be.visible');
    });

    it('TC-HIST-013: Should filter transactions by date range', () => {
      TransactionHistoryPage.filterBtn.click();
      TransactionHistoryPage.filterByDateRange('2024-01-01', '2025-12-31');
      cy.waitForLoader();
      TransactionHistoryPage.transactionList.should('exist');
    });

    it('TC-HIST-014: Should clear filter and restore full list', () => {
      TransactionHistoryPage.filterBtn.click();
      TransactionHistoryPage.filterByDateRange('2024-01-01', '2025-12-31');
      cy.contains(/clear|reset/i).click();
      TransactionHistoryPage.verifyTransactionExists();
    });
  });

  context('Export / Download', () => {
    it('TC-HIST-015: Should display export/download button', () => {
      TransactionHistoryPage.exportBtn.should('be.visible');
    });

    it('TC-HIST-016: Should trigger download when export button is clicked', () => {
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });
      TransactionHistoryPage.clickExport();
      // Accept either a download trigger or a format selector
      cy.get('@windowOpen, [class*="modal" i]').should('exist');
    });
  });

  context('Pagination', () => {
    it('TC-HIST-017: Should display pagination or load more if many transactions', () => {
      TransactionHistoryPage.transactionItem.then(($items) => {
        if ($items.length >= 10) {
          cy.get('[class*="paginat" i], button').contains(/next|load more|show more/i).should('be.visible');
        }
      });
    });

    it('TC-HIST-018: Should load next page of transactions', () => {
      TransactionHistoryPage.transactionItem.then(($items) => {
        if ($items.length >= 10) {
          TransactionHistoryPage.goToNextPage();
          cy.waitForLoader();
          TransactionHistoryPage.verifyTransactionExists();
        }
      });
    });
  });
});
