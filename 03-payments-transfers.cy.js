/**
 * E2E Test Suite: Payments & Transfers
 * ZenPay by Zenith - SIT Environment
 *
 * Covers:
 * - Successful transfer flow
 * - Transfer validation (insufficient funds, invalid recipient)
 * - Transfer confirmation screen
 * - Receipt/reference generation
 * - Transfer cancellation
 */

import DashboardPage from '../pages/DashboardPage';
import TransferPage from '../pages/TransferPage';

describe('Payments & Transfers', () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    cy.visit('/');
    cy.waitForLoader();
    DashboardPage.navigateToSend();
    cy.waitForLoader();
  });

  context('Transfer Page - UI Validation', () => {
    it('TC-PAY-001: Should display the transfer/send money page', () => {
      TransferPage.recipientInput.should('be.visible');
      TransferPage.amountInput.should('be.visible');
    });

    it('TC-PAY-002: Should display continue/proceed button', () => {
      TransferPage.continueBtn.should('be.visible');
    });

    it('TC-PAY-003: Should display narration / description input field', () => {
      TransferPage.narrationInput.should('be.visible');
    });
  });

  context('Transfer - Field Validations', () => {
    it('TC-PAY-004: Should show error when recipient field is empty', () => {
      TransferPage.enterAmount('500');
      TransferPage.clickContinue();
      TransferPage.verifyTransferError();
    });

    it('TC-PAY-005: Should show error when amount field is empty', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.enterRecipient(data.transfer.validRecipient);
        TransferPage.clickContinue();
        TransferPage.verifyTransferError();
      });
    });

    it('TC-PAY-006: Should show error for zero amount', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.enterRecipient(data.transfer.validRecipient);
        TransferPage.enterAmount(data.transfer.zeroAmount);
        TransferPage.clickContinue();
        TransferPage.verifyTransferError();
      });
    });

    it('TC-PAY-007: Should show error for negative amount', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.enterRecipient(data.transfer.validRecipient);
        TransferPage.enterAmount('-500');
        TransferPage.clickContinue();
        TransferPage.verifyTransferError();
      });
    });

    it('TC-PAY-008: Should show error for invalid recipient phone number', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.enterRecipient(data.transfer.invalidRecipient);
        TransferPage.enterAmount(data.transfer.amount);
        TransferPage.clickContinue();
        TransferPage.verifyTransferError();
      });
    });

    it('TC-PAY-009: Should not accept alphabets in amount field', () => {
      TransferPage.amountInput.type('abc').should('not.have.value', 'abc');
    });
  });

  context('Transfer - Confirmation Flow', () => {
    it('TC-PAY-010: Should display confirmation screen before submitting transfer', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.initiateTransfer(
          data.transfer.validRecipient,
          data.transfer.amount,
          data.transfer.narration
        );
        // Confirmation screen should appear
        cy.contains(/confirm|review|summary/i).should('be.visible');
      });
    });

    it('TC-PAY-011: Should display correct transfer amount on confirmation screen', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.initiateTransfer(
          data.transfer.validRecipient,
          data.transfer.amount,
          data.transfer.narration
        );
        cy.contains(data.transfer.amount).should('be.visible');
      });
    });

    it('TC-PAY-012: Should display recipient details on confirmation screen', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.initiateTransfer(
          data.transfer.validRecipient,
          data.transfer.amount,
          data.transfer.narration
        );
        cy.contains(data.transfer.validRecipient).should('be.visible');
      });
    });

    it('TC-PAY-013: Should be able to cancel transfer on confirmation screen', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.initiateTransfer(
          data.transfer.validRecipient,
          data.transfer.amount,
          data.transfer.narration
        );
        TransferPage.clickCancel();
        // Should return to send page or dashboard
        cy.url().should('not.include', '/confirm');
      });
    });
  });

  context('Transfer - Insufficient Funds', () => {
    it('TC-PAY-014: Should show insufficient funds error for amount exceeding balance', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.initiateTransfer(
          data.transfer.validRecipient,
          data.transfer.largeAmount,
          data.transfer.narration
        );
        TransferPage.insufficientFundsMsg.should('be.visible');
      });
    });
  });

  context('Transfer - Successful Transaction', () => {
    it('TC-PAY-015: Should display success message after completed transfer', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.completeTransfer(
          data.transfer.validRecipient,
          data.transfer.amount,
          data.transfer.narration
        );
        TransferPage.verifyTransferSuccess();
      });
    });

    it('TC-PAY-016: Should display transaction reference/receipt after success', () => {
      cy.fixture('testData').then((data) => {
        TransferPage.completeTransfer(
          data.transfer.validRecipient,
          data.transfer.amount,
          data.transfer.narration
        );
        TransferPage.verifyReceiptDisplayed();
      });
    });

    it('TC-PAY-017: Should deduct transferred amount from wallet balance', () => {
      let balanceBefore;
      cy.visit('/');
      DashboardPage.getBalanceText().then((text) => {
        balanceBefore = parseFloat(text.replace(/[^0-9.]/g, ''));
      });

      DashboardPage.navigateToSend();

      cy.fixture('testData').then((data) => {
        TransferPage.completeTransfer(
          data.transfer.validRecipient,
          data.transfer.amount,
          data.transfer.narration
        );

        cy.visit('/');
        DashboardPage.getBalanceText().then((text) => {
          const balanceAfter = parseFloat(text.replace(/[^0-9.]/g, ''));
          expect(balanceAfter).to.be.lessThan(balanceBefore);
        });
      });
    });
  });
});
