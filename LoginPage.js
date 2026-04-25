/**
 * Page Object Model: Login Page
 * ZenPay by Zenith - SIT Environment
 */

class LoginPage {
  // Selectors
  get phoneInput()       { return cy.get('input[type="tel"], input[placeholder*="phone" i], input[name*="phone" i]').first(); }
  get passcodeInput()    { return cy.get('input[type="password"], input[placeholder*="passcode" i], input[placeholder*="pin" i]').first(); }
  get loginButton()      { return cy.get('button[type="submit"], button').contains(/login|sign in|continue/i); }
  get errorMessage()     { return cy.get('[class*="error" i], [class*="alert" i], [role="alert"]'); }
  get forgotPasscode()   { return cy.contains(/forgot|reset/i); }

  // Actions
  visit() {
    cy.visit('/');
  }

  enterPhone(phone) {
    this.phoneInput.clear().type(phone);
  }

  enterPasscode(passcode) {
    this.passcodeInput.clear().type(passcode);
  }

  clickLogin() {
    this.loginButton.click();
  }

  login(phone, passcode) {
    this.enterPhone(phone);
    this.enterPasscode(passcode);
    this.clickLogin();
  }

  loginWithValidCredentials() {
    cy.fixture('testData').then((data) => {
      this.login(data.validUser.phone, data.validUser.passcode);
    });
  }

  verifyErrorDisplayed() {
    this.errorMessage.should('be.visible');
  }

  verifyOnLoginPage() {
    cy.url().should('include', '/');
    this.loginButton.should('exist');
  }
}

export default new LoginPage();
