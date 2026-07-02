import { test, expect } from '../../fixtures/fixtures';
import { Messages } from '../../utils/messages';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ adminPage, baseURL }) => {
    await adminPage.hideBanner(baseURL);
    await adminPage.goto();
  });

  test('Administrator is able to login with correct username and password @sanity @login', async ({
    adminPage,
    header,
    adminUsername,
    adminPassword
  }) => {
    await adminPage.login(adminUsername, adminPassword);
    await expect(header.roomsLink, 'Administrator logged in!').toBeVisible();
  });

  test('User is not able to login with empty username @login', async ({ adminPage, header }) => {
    await adminPage.login('', 'password');
    await expect(header.roomsLink, 'User is not logged in').toBeHidden();
    await expect(adminPage.alertDanger, 'Invalid credentials shown').toContainText(Messages.login.invalidCredentials);
  });

  test('User is not able to login with empty password @login', async ({ adminPage, header }) => {
    await adminPage.login('admin', '');
    await expect(header.roomsLink, 'User is not logged in').toBeHidden();
    await expect(adminPage.alertDanger, 'Invalid credentials shown').toContainText(Messages.login.invalidCredentials);
  });

  test('User is not able to login with wrong password @login', async ({ adminPage, header }) => {
    await adminPage.login('admin', 'wrong_password');
    await expect(header.roomsLink, 'User is not logged in').toBeHidden();
    await expect(adminPage.alertDanger, 'Invalid credentials shown').toContainText(Messages.login.invalidCredentials);
  });
});
