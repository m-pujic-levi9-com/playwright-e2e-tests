import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type BedAndBreakfastDetails = {
  name: string;
  logoUrl: string;
  description: string;
};

export type MapDetails = {
  latitude: number;
  longitude: number;
  directions: string;
};

export type ContactDetails = {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

export type AddressDetails = {
  addressLine1: string;
  addressLine2: string;
  postTown: string;
  county: string;
  postCode: string;
};

export class BrandingPage extends BasePage {
  readonly pageHeader: Locator;
  readonly nameField: Locator;
  readonly logoUrlField: Locator;
  readonly descriptionField: Locator;
  readonly latitudeField: Locator;
  readonly longitudeField: Locator;
  readonly directionsField: Locator;
  readonly contactNameField: Locator;
  readonly contactPhoneField: Locator;
  readonly contactEmailField: Locator;
  readonly addressLine1Field: Locator;
  readonly addressLine2Field: Locator;
  readonly postTownField: Locator;
  readonly countyField: Locator;
  readonly postCodeField: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.getByRole('heading', { name: 'B&B details' });
    this.nameField = page.locator('#name');
    this.logoUrlField = page.locator('#logoUrl');
    this.descriptionField = page.locator('#description');
    this.latitudeField = page.locator('#latitude');
    this.longitudeField = page.locator('#longitude');
    this.directionsField = page.locator('#directions');
    this.contactNameField = page.locator('#contactName');
    this.contactPhoneField = page.locator('#contactPhone');
    this.contactEmailField = page.locator('#contactEmail');
    this.addressLine1Field = page.locator('#line1');
    this.addressLine2Field = page.locator('#line2');
    this.postTownField = page.locator('#postTown');
    this.countyField = page.locator('#county');
    this.postCodeField = page.locator('#postCode');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto() {
    await test.step('Go to Branding Page', async () => {
      await this.page.goto('/admin/branding');
      await expect(this.pageHeader, 'Branding page loaded').toBeVisible();
    });
  }

  async updateBedAndBreakfastDetails(details: BedAndBreakfastDetails) {
    await test.step('Update B&B details', async () => {
      await this.nameField.fill(details.name);
      await this.logoUrlField.fill(details.logoUrl);
      await this.descriptionField.fill(details.description);
      await this.submitChanges();
    });
  }

  async updateMapDetails(details: MapDetails) {
    await test.step('Update map details', async () => {
      await this.latitudeField.fill(details.latitude.toString());
      await this.longitudeField.fill(details.longitude.toString());
      await this.directionsField.fill(details.directions);
      await this.submitChanges();
    });
  }

  async updateContactDetails(details: ContactDetails) {
    await test.step('Update contact details', async () => {
      await this.contactNameField.fill(details.contactName);
      await this.contactPhoneField.fill(details.contactPhone);
      await this.contactEmailField.fill(details.contactEmail);
      await this.submitChanges();
    });
  }

  async updateAddressDetails(details: AddressDetails) {
    await test.step('Update address details', async () => {
      await this.addressLine1Field.fill(details.addressLine1);
      await this.addressLine2Field.fill(details.addressLine2);
      await this.postTownField.fill(details.postTown);
      await this.countyField.fill(details.county);
      await this.postCodeField.fill(details.postCode);
      await this.submitChanges();
    });
  }

  private async submitChanges() {
    const updateResponsePromise = this.page.waitForResponse(
      (response) => response.url().endsWith('/api/branding') && response.request().method() === 'PUT'
    );
    await this.submitButton.click();
    const updateResponse = await updateResponsePromise;
    expect(updateResponse.ok(), 'Branding details saved').toBeTruthy();
  }
}
