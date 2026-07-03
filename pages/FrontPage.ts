import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FrontPage extends BasePage {
  readonly pageLocator: Locator;

  readonly checkInDateField: Locator;
  readonly checkOutDateField: Locator;
  readonly checkAvailabilityButton: Locator;

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

    this.checkInDateField = page.locator('//div[./label[@for="checkin"]]//input');
    this.checkOutDateField = page.locator('//div[./label[@for="checkout"]]//input');
    this.checkAvailabilityButton = page.getByRole('button', { name: 'Check Availability' });

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

  async checkAvailability(fromDate: string, toDate: string) {
    await test.step('Check Availability', async () => {
      await this.checkInDateField.fill(fromDate);
      await this.checkOutDateField.fill(toDate);
      await this.checkAvailabilityButton.click();
    });
  }

  getRoomCard(roomName: string): Locator {
    return this.page.locator(`//div[./div[@class='card-body']/*[contains(text(),'${roomName}')]]`);
  }

  async clickBookNowButton(roomName: string) {
    await test.step(`Click on Book now button for Room named '${roomName}'`, async () => {
      const roomCard = this.getRoomCard(roomName);
      await roomCard.locator('//a[.="Book now"]').click();
    });
  }

  async bookRoom(roomName: string, fromDate: string, toDate: string) {
    await test.step(`Book a Room '${roomName}'`, async () => {
      await this.checkAvailability(fromDate, toDate);
      const roomCard = this.getRoomCard(roomName);
      await expect(roomCard, `Room '${roomName}' is displayed`).toBeVisible();
      await this.clickBookNowButton(roomName);
    });
  }
}
