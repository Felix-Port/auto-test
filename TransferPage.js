/**
 * Page Object Model: Transfer / Payments Page
 * ZenPay by Zenith - SIT Environment
 */

class TransferPage {
  // Selectors
  get recipientInput()      { return cy.get('input[placeholder*="recipient" i], input[placeholder*="phone" i], input[name*="recipient" i]').first(); }
  get amountInput()         { return cy.get('input[placeholder*="amount" i], input[type="number"], input[name*="amount" i]').first(); }
  get narrationInput()      { return cy.get('input[placeholder*="narration" i], input[placeholder*="description" i], textarea').first(); }
  get continueBtn()         { return cy.get('button').contains(/continue|proceed|next/i); }
  get confirmBtn()          { return cy.get('button').contains(/confirm|send|pay/i); }
  get cancelBtn()           { return cy.get('button').contains(/cancel|back/i); }
  get successMessage()      { return cy.get('[class*="success" i], [class*="complete" i], [role="alert"]'); }
  get errorMessage()        { return cy.get('[class*="error" i], [class*="alert" i], [role="alert"]'); }
  get transactionRef()      { return cy.get('[class*="reference" i], [class*="ref" i], [class*="receipt" i]'); }
  get insufficientFundsMsg(){ return cy.contains(/insufficient|balance|funds/i); }

  // Actions
  enterRecipient(phone) {
    this.recipientInput.clear().type(phone);
  }

  enterAmount(amount) {
    this.amountInput.clear().type(amount);
  }

  enterNarration(text) {
    this.narrationInput.clear().type(text);
  }

  clickContinue() {
    this.continueBtn.click();
  }

  clickConfirm() {
    this.confirmBtn.click();
  }

  clickCancel() {
    this.cancelBtn.click();
  }

  initiateTransfer(recipient, amount, narration = 'E2E Test Transfer') {
    this.enterRecipient(recipient);
    this.enterAmount(amount);
    this.enterNarration(narration);
    this.clickContinue();
  }

  completeTransfer(recipient, amount, narration = 'E2E Test Transfer') {
    this.initiateTransfer(recipient, amount, narration);
    this.clickConfirm();
  }

  verifyTransferSuccess() {
    this.successMessage.should('be.visible');
  }

  verifyTransferError() {
    this.errorMessage.should('be.visible');
  }

  verifyReceiptDisplayed() {
    this.transactionRef.should('be.visible');
  }
}

export default new TransferPage();
