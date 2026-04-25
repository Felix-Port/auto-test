/**
 * Page Object Model: Transaction History Page
 * ZenPay by Zenith - SIT Environment
 */

class TransactionHistoryPage {
  // Selectors
  get transactionList()    { return cy.get('[class*="transaction" i], [class*="history" i] li, table tbody tr'); }
  get filterBtn()          { return cy.contains(/filter/i); }
  get searchInput()        { return cy.get('input[placeholder*="search" i], input[type="search"]').first(); }
  get dateFromInput()      { return cy.get('input[placeholder*="from" i], input[type="date"]').first(); }
  get dateToInput()        { return cy.get('input[placeholder*="to" i], input[type="date"]').last(); }
  get applyFilterBtn()     { return cy.contains(/apply|search|filter/i); }
  get exportBtn()          { return cy.contains(/export|download/i); }
  get emptyState()         { return cy.contains(/no transactions|no records|empty/i); }
  get transactionItem()    { return cy.get('[class*="transaction-item" i], [class*="list-item" i], tbody tr'); }
  get paginationNext()     { return cy.get('[class*="next" i], button').contains(/next/i); }
  get loadMoreBtn()        { return cy.contains(/load more|show more/i); }

  // Actions
  verifyHistoryPageLoaded() {
    cy.url().should('match', /history|transactions/i);
    this.transactionList.should('exist');
  }

  searchTransaction(query) {
    this.searchInput.clear().type(query);
  }

  filterByDateRange(fromDate, toDate) {
    this.dateFromInput.clear().type(fromDate);
    this.dateToInput.clear().type(toDate);
    this.applyFilterBtn.click();
  }

  openTransactionDetail(index = 0) {
    this.transactionItem.eq(index).click();
  }

  clickExport() {
    this.exportBtn.click();
  }

  verifyTransactionExists() {
    this.transactionItem.should('have.length.greaterThan', 0);
  }

  verifyEmptyState() {
    this.emptyState.should('be.visible');
  }

  goToNextPage() {
    this.paginationNext.click();
  }
}

export default new TransactionHistoryPage();
