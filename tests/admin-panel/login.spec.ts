import { test, expect } from '@playwright/test';
import { AdminPage } from '../../pages/AdminPage';
import { Header } from '../../pages/components/Header';
import { Messages } from '../../utils/messages';

test.describe('Login Tests', () => {
  let adminPage: AdminPage;
  let header: Header;

  test.beforeEach(async ({ page, baseURL }) => {
    adminPage = new AdminPage(page);
    header = new Header(page);
    await adminPage.hideBanner(baseURL);
    await adminPage.goto();
  });

  test('Administrator is able to login with correct username and password @sanity @login', async () => {
    await adminPage.login('admin', 'password');
    await expect(header.roomsLink, 'Administrator logged in!').toBeVisible();
  });

  test('User is not able to login with empty username @login', async () => {
    await adminPage.login('', 'password');
    await expect(header.roomsLink, 'User is not logged in').toBeHidden();
    await expect(adminPage.alertDanger, 'Invalid credentials shown').toContainText(Messages.login.invalidCredentials);
  });

  test('User is not able to login with empty password @login', async () => {
    await adminPage.login('admin', '');
    await expect(header.roomsLink, 'User is not logged in').toBeHidden();
    await expect(adminPage.alertDanger, 'Invalid credentials shown').toContainText(Messages.login.invalidCredentials);
  });

  test('User is not able to login with wrong password @login', async () => {
    await adminPage.login('admin', 'wrong_password');
    await expect(header.roomsLink, 'User is not logged in').toBeHidden();
    await expect(adminPage.alertDanger, 'Invalid credentials shown').toContainText(Messages.login.invalidCredentials);
  });
});
