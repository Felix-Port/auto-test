/**
 * Page Object Model: Dashboard / Wallet Page
 * ZenPay by Zenith - SIT Environment
 */

class DashboardPage {
  // Selectors
  get walletBalance()       { return cy.get('[class*="balance" i], [class*="wallet" i], [data-testid*="balance"]').first(); }
  get sendMoneyBtn()        { return cy.contains(/send|transfer|pay/i); }
  get transactionHistory()  { return cy.contains(/history|transactions|recent/i); }
  get profileMenu()         { return cy.get('[class*="profile" i], [class*="avatar" i], [data-testid*="profile"]').first(); }
  get logoutBtn()           { return cy.contains(/logout|sign out/i); }
  get notificationBell()    { return cy.get('[class*="notif" i], [class*="bell" i]').first(); }
  get navMenu()             { return cy.get('nav, [class*="nav" i], [class*="sidebar" i]').first(); }
  get pageLoader()          { return cy.get('[class*="loader" i], [class*="spinner" i], [class*="loading" i]'); }

  // Actions
  verifyDashboardLoaded() {
    cy.url().should('not.include', '/login');
    this.walletBalance.should('be.visible');
  }

  getBalanceText() {
    return this.walletBalance.invoke('text');
  }

  navigateToSend() {
    this.sendMoneyBtn.click();
  }

  navigateToTransactionHistory() {
    this.transactionHistory.click();
  }

  openProfileMenu() {
    this.profileMenu.click();
  }

  logout() {
    this.openProfileMenu();
    this.logoutBtn.click();
  }

  waitForDashboardLoad() {
    cy.url().should('not.include', '/login', { timeout: 15000 });
  }
}

export default new DashboardPage();
