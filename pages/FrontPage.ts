import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FrontPage extends BasePage {
  readonly pageLocator: Locator;

  readonly contactNameField: Locator;
  readonly contactEmailField: Locator;
  readonly contactPhoneField: Locator;
  readonly contactSubjectField: Locator;
  readonly contactDescriptionField: Locator;
  readonly contactSubmitButton: Locator;
  readonly contactSuccessMessage: Locator;
  readonly contactErrorMessages: Locator;

  constructor(page: Page) {
    super(page);
    this.pageLocator = page.getByText('Our Rooms', { exact: true });

    this.contactNameField = page.getByTestId('ContactName');
    this.contactEmailField = page.getByTestId('ContactEmail');
    this.contactPhoneField = page.getByTestId('ContactPhone');
    this.contactSubjectField = page.getByTestId('ContactSubject');
    this.contactDescriptionField = page.getByTestId('ContactDescription');
    this.contactSubmitButton = page.getByRole('button', { name: 'Submit' });
    this.contactSuccessMessage = page.getByRole('heading', { name: 'Thanks for getting in touch' });
    this.contactErrorMessages = page.locator('#contact div.alert.alert-danger');
  }

  async goto() {
    await test.step('Go to Front Page', async () => {
      await this.page.goto('/');
      await expect(this.pageLocator, 'Front Page loaded').toBeVisible();
    });
  }

  async sendMessage(name: string, email: string, phone: string, subject: string, description: string) {
    await test.step('Submit Message to Hotel', async () => {
      await this.contactNameField.fill(name);
      await this.contactEmailField.fill(email);
      await this.contactPhoneField.fill(phone);
      await this.contactSubjectField.fill(subject);
      await this.contactDescriptionField.fill(description);
      await this.contactSubmitButton.click();
    });
  }
}
