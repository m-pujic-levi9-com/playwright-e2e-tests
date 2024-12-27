import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FrontPage extends BasePage {
  readonly pageLocator: Locator;

  readonly bookingFirstNameField: Locator;
  readonly bookingLastNameField: Locator;
  readonly bookingEmailField: Locator;
  readonly bookingPhoneNumberField: Locator;
  readonly bookingBookButton: Locator;
  readonly bookingCalendarNextButton: Locator;
  readonly bookingConfirmationModal: Locator;
  readonly bookingErrorMessages: Locator;

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
    this.pageLocator = page.locator('.hotel-description');

    this.bookingFirstNameField = page.locator('input.room-firstname').last();
    this.bookingLastNameField = page.locator('input.room-lastname').last();
    this.bookingEmailField = page.locator('input.room-email').last();
    this.bookingPhoneNumberField = page.locator('input.room-phone').last();
    this.bookingBookButton = page.getByRole('button', { name: 'Book', exact: true }).last();
    this.bookingCalendarNextButton = page.getByRole('button', { name: 'Next' }).last();
    this.bookingConfirmationModal = page.locator('.confirmation-modal');
    this.bookingErrorMessages = page.locator('div.hotel-room-info .alert.alert-danger').last();

    this.contactNameField = page.getByTestId('ContactName');
    this.contactEmailField = page.getByTestId('ContactEmail');
    this.contactPhoneField = page.getByTestId('ContactPhone');
    this.contactSubjectField = page.getByTestId('ContactSubject');
    this.contactDescriptionField = page.getByTestId('ContactDescription');
    this.contactSubmitButton = page.getByRole('button', { name: 'Submit' });
    this.contactSuccessMessage = page.locator('div.contact h2');
    this.contactErrorMessages = page.locator('div.contact .alert.alert-danger');
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

  async clickBookThsRoomButton(roomName: string) {
    await test.step(`Click on Book this room button for Room named '${roomName}'`, async () => {
      await this.page.locator(`//div[./div/img[contains(@alt,'${roomName}')]]//button`).last().click();
    });
  }

  async fillBookingFields(firstName: string, lastName: string, email: string, phoneNumber: string) {
    await test.step('Fill in booking information', async () => {
      await this.bookingFirstNameField.fill(firstName);
      await this.bookingLastNameField.fill(lastName);
      await this.bookingEmailField.fill(email);
      await this.bookingPhoneNumberField.fill(phoneNumber);
    });
  }

  async selectBookingDates() {
    await test.step('Select Booking dates', async () => {
      await this.bookingCalendarNextButton.click();
      const bookingCalendarStart = this.page.locator('.rbc-day-bg:not(.rbc-off-range-bg)').first();
      const bookingCalendarEnd = this.page.locator('.rbc-day-bg:not(.rbc-off-range-bg)').last();
      await bookingCalendarStart.hover();
      await this.page.mouse.down();
      await bookingCalendarEnd.hover();
      await this.page.mouse.up();
    });
  }

  async clickOnBookButton() {
    await test.step('Click on Book button', async () => {
      await this.bookingBookButton.click();
    });
  }

  async bookRoom(roomName: string, firstName: string, lastName: string, email: string, phoneNumber: string) {
    await test.step(`Book a Room '${roomName}'`, async () => {
      await this.clickBookThsRoomButton(roomName);
      await this.fillBookingFields(firstName, lastName, email, phoneNumber);
      await this.selectBookingDates();
      await this.clickOnBookButton();
    });
  }

  async bookRoomWithoutDates(roomName: string, firstName: string, lastName: string, email: string, phoneNumber: string) {
    await test.step(`Book a Room '${roomName}' without selecting booking dates`, async () => {
      await this.clickBookThsRoomButton(roomName);
      await this.fillBookingFields(firstName, lastName, email, phoneNumber);
      await this.clickOnBookButton();
    });
  }
}
