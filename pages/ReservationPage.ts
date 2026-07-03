import { test, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReservationPage extends BasePage {
  readonly pageLocator: Locator;

  readonly reserveNowButton: Locator;
  readonly cancelButton: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly phoneField: Locator;
  readonly bookingConfirmation: Locator;
  readonly bookingErrorMessages: Locator;

  constructor(page: Page) {
    super(page);
    this.pageLocator = page.getByRole('heading', { name: 'Book This Room' });

    this.reserveNowButton = page.getByRole('button', { name: 'Reserve Now' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.firstNameField = page.locator('input.room-firstname');
    this.lastNameField = page.locator('input.room-lastname');
    this.emailField = page.locator('input.room-email');
    this.phoneField = page.locator('input.room-phone');
    this.bookingConfirmation = page.locator('.card-body').filter({ has: page.getByRole('heading', { name: 'Booking Confirmed' }) });
    this.bookingErrorMessages = page.locator('.alert.alert-danger');
  }

  async clickReserveNow() {
    await test.step('Click Reserve Now button', async () => {
      await this.reserveNowButton.click();
    });
  }

  async fillBookingForm(firstName: string, lastName: string, email: string, phoneNumber: string) {
    await test.step('Fill in booking information', async () => {
      await this.firstNameField.fill(firstName);
      await this.lastNameField.fill(lastName);
      await this.emailField.fill(email);
      await this.phoneField.fill(phoneNumber);
    });
  }

  async bookRoom(firstName: string, lastName: string, email: string, phoneNumber: string) {
    await test.step('Book room with personal details', async () => {
      await this.clickReserveNow();
      await this.fillBookingForm(firstName, lastName, email, phoneNumber);
      await this.reserveNowButton.click();
    });
  }
}
