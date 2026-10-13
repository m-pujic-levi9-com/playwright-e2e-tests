import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FrontPage extends BasePage {
  readonly pageLocator: Locator;
  readonly hero: Locator;
  readonly navigationBrandName: Locator;
  readonly brandName: Locator;
  readonly brandDescription: Locator;
  readonly addressDetails: Locator;
  readonly contactPhone: Locator;
  readonly contactEmail: Locator;
  readonly directions: Locator;

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
    this.hero = page.locator('section.hero');
    this.navigationBrandName = page.locator('nav a.navbar-brand');
    this.brandName = this.hero.getByRole('heading', { level: 1 });
    this.brandDescription = this.hero.locator('p').first();
    this.addressDetails = page.getByRole('heading', { name: 'Address' }).locator('..').locator('p');
    this.contactPhone = page.getByRole('heading', { name: 'Phone' }).locator('..').locator('p');
    this.contactEmail = page.getByRole('heading', { name: 'Email' }).locator('..').locator('p');
    this.directions = page.getByRole('heading', { name: 'Getting Here' }).locator('xpath=following-sibling::p[1]');

    this.contactNameField = page.getByTestId('ContactName');
    this.contactEmailField = page.getByTestId('ContactEmail');
    this.contactPhoneField = page.getByTestId('ContactPhone');
    this.contactSubjectField = page.getByTestId('ContactSubject');
    this.contactDescriptionField = page.getByTestId('ContactDescription');
    this.contactSubmitButton = page.getByRole('button', { name: 'Submit' });
    this.contactSuccessMessage = page.getByRole('heading', { name: 'Thanks for getting in touch' });
    this.contactErrorMessages = page.locator('#contact div.alert.alert-danger');
  }

  async goto(cacheBust = false) {
    await test.step('Go to Front Page', async () => {
      await this.page.goto(cacheBust ? `/?branding=${Date.now()}` : '/');
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

  mapTile(latitude: number, longitude: number) {
    const zoom = 17;
    const scale = 2 ** zoom;
    const latitudeRadians = (latitude * Math.PI) / 180;
    const tileX = Math.floor(((longitude + 180) / 360) * scale);
    const tileY = Math.floor(((1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2) * scale);
    return this.page.locator(`img[src*="/${zoom}/${tileX}/${tileY}.png"]`);
  }
}
