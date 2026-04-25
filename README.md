<<<<<<< HEAD
# ZenPay E2E Test Suite (Cypress)
> Automated End-to-End tests for **ZenPay by Zenith** — SIT Environment

---

## 📁 Project Structure

```
zenpay-e2e/
├── cypress/
│   ├── e2e/
│   │   ├── 00-smoke-tests.cy.js          # Critical path smoke tests
│   │   ├── 01-authentication.cy.js       # Login, logout, session
│   │   ├── 02-wallet-management.cy.js    # Balance, profile, navigation
│   │   ├── 03-payments-transfers.cy.js   # Send money flows
│   │   └── 04-transaction-history.cy.js  # History, filter, export
│   ├── fixtures/
│   │   └── testData.json                 # Test data (users, amounts, etc.)
│   ├── pages/                            # Page Object Models
│   │   ├── LoginPage.js
│   │   ├── DashboardPage.js
│   │   ├── TransferPage.js
│   │   └── TransactionHistoryPage.js
│   └── support/
│       ├── commands.js                   # Custom Cypress commands
│       └── e2e.js                        # Global setup / hooks
├── cypress.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Open Cypress interactive test runner
npm run cy:open

# Run all tests headlessly
npm run cy:regression

# Run only smoke tests (fastest — use to check env health)
npm run cy:smoke

# Run specific module
npm run cy:auth
npm run cy:wallet
npm run cy:payments
npm run cy:history
```

---

## 🧪 Test Coverage Summary

| Module | Test File | # of Tests | Coverage |
|---|---|---|---|
| 🔥 Smoke | `00-smoke-tests.cy.js` | 7 | Critical path |
| 🔐 Authentication | `01-authentication.cy.js` | 15 | Login, logout, session |
| 👛 Wallet | `02-wallet-management.cy.js` | 14 | Balance, profile, top-up |
| 💸 Payments | `03-payments-transfers.cy.js` | 17 | Transfers, validation, receipt |
| 📋 History | `04-transaction-history.cy.js` | 18 | List, filter, search, export |
| **Total** | | **71** | |

---

## 🔑 Test Credentials
Stored in `cypress.config.js` under `env`:
- **Phone**: `8143311412`
- **Passcode**: `159753`

⚠️ _Do not commit production credentials. Use environment variables in CI._

---

## 🏗️ Architecture: Page Object Model

Tests use **Page Object Models (POMs)** to separate selectors and actions from test logic:

- `LoginPage.js` — handles login form interactions
- `DashboardPage.js` — home/wallet screen navigation
- `TransferPage.js` — send money form + confirmation
- `TransactionHistoryPage.js` — history list + filters

---

## 🔧 Custom Commands

| Command | Description |
|---|---|
| `cy.login(phone, passcode)` | Login with cy.session caching |
| `cy.loginAsTestUser()` | Login with default SIT credentials |
| `cy.waitForLoader()` | Wait for spinner/loader to disappear |
| `cy.interceptPaymentAPI()` | Set up API intercepts for payment flows |
| `cy.assertToast(message)` | Assert a toast/notification message |

---

## ⚙️ CI/CD Integration (GitHub Actions Example)

```yaml
- name: Run Cypress E2E Tests
  uses: cypress-io/github-action@v6
  with:
    command: npm run cy:regression
  env:
    CYPRESS_phone: ${{ secrets.ZENPAY_PHONE }}
    CYPRESS_passcode: ${{ secrets.ZENPAY_PASSCODE }}
```

---

## 📌 Notes for Testers

1. **Selector strategy**: Tests use resilient selectors (attributes, ARIA roles, text content) to reduce brittleness from UI changes.
2. **Session caching**: `cy.login()` uses `cy.session()` to avoid re-logging in for every test — speeds up execution.
3. **SIT environment only**: These tests target the SIT environment. Update `baseUrl` in `cypress.config.js` for other environments.
4. **Flaky tests**: Set `retries: 2` is configured for CI to handle transient network issues.
=======
# auto-test
>>>>>>> 2bf1e5b0937361c2aba7f8e7dc1d69472b7e3ab1
