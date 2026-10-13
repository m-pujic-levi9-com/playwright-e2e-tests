import { test, expect } from '../../fixtures/fixtures';
import { faker } from '@faker-js/faker';
import { sanitizeName } from '../../utils/test-data-util';

test.describe('Branding Tests', () => {
  test.describe.configure({ mode: 'default' });
  test.setTimeout(180000);

  test.beforeEach(async ({ adminPage, brandingPage, header, adminUsername, adminPassword }) => {
    await adminPage.goto();
    await adminPage.login(adminUsername, adminPassword);
    await expect(header.logoutLink, 'Administrator is logged in').toBeVisible();
    await header.clickOnBranding();
    await expect(brandingPage.pageHeader, 'Branding page loaded').toBeVisible();
  });

  test('Administrator can update B&B details and changes are applied on the front page @branding @slow', async ({ brandingPage, frontPage }) => {
    const updatedBranding = {
      name: sanitizeName(faker.company.name()),
      logoUrl: faker.image.urlPicsumPhotos({ width: 1280, height: 720 }),
      description: faker.lorem.paragraph(2)
    };

    await brandingPage.updateBedAndBreakfastDetails(updatedBranding);

    await expect
      .poll(
        async () => {
          await frontPage.goto(true);
          const heroBackground = await frontPage.hero.evaluate((element) => getComputedStyle(element).backgroundImage);
          return (
            (await frontPage.navigationBrandName.textContent())?.includes(updatedBranding.name) === true &&
            (await frontPage.brandName.textContent())?.includes(updatedBranding.name) === true &&
            (await frontPage.brandDescription.textContent()) === updatedBranding.description &&
            heroBackground === `url("${updatedBranding.logoUrl}")`
          );
        },
        { message: 'Updated B&B details are displayed', intervals: [5000], timeout: 150000 } // Allow time for the app's branding cache to refresh.
      )
      .toBe(true);
  });

  test('Administrator can update map details and changes are applied on the front page @branding @slow', async ({ brandingPage, frontPage }) => {
    const updatedBranding = {
      latitude: faker.location.latitude({ min: 40, max: 55, precision: 4 }),
      longitude: faker.location.longitude({ min: -10, max: 10, precision: 4 }),
      directions: faker.lorem.sentence({ min: 8, max: 15 })
    };

    await brandingPage.updateMapDetails(updatedBranding);

    await expect
      .poll(
        async () => {
          await frontPage.goto(true);
          return (
            (await frontPage.directions.textContent()) === updatedBranding.directions &&
            (await frontPage.mapTile(updatedBranding.latitude, updatedBranding.longitude).isVisible())
          );
        },
        { message: 'Updated map details are displayed', intervals: [5000], timeout: 150000 } // Allow time for the app's branding cache to refresh.
      )
      .toBe(true);
  });

  test('Administrator can update contact details and changes are applied on the front page @branding @slow', async ({ brandingPage, frontPage }) => {
    const updatedBranding = {
      contactName: sanitizeName(faker.person.fullName()),
      contactPhone: faker.string.numeric({ length: 12 }),
      contactEmail: faker.internet.exampleEmail()
    };

    await brandingPage.updateContactDetails(updatedBranding);

    await expect
      .poll(
        async () => {
          await frontPage.goto(true);
          return (
            (await frontPage.contactPhone.textContent()) === updatedBranding.contactPhone &&
            (await frontPage.contactEmail.textContent()) === updatedBranding.contactEmail
          );
        },
        { message: 'Updated contact details are displayed', intervals: [5000], timeout: 150000 } // Allow time for the app's branding cache to refresh.
      )
      .toBe(true);
  });

  test('Administrator can update address details and changes are applied on the front page @branding @slow', async ({ brandingPage, frontPage }) => {
    const updatedBranding = {
      addressLine1: faker.location.streetAddress(),
      addressLine2: faker.location.secondaryAddress(),
      postTown: faker.location.city(),
      county: faker.location.county(),
      postCode: faker.location.zipCode()
    };
    const expectedAddress = [
      updatedBranding.addressLine1,
      updatedBranding.addressLine2,
      updatedBranding.postTown,
      updatedBranding.county,
      updatedBranding.postCode
    ].join(', ');

    await brandingPage.updateAddressDetails(updatedBranding);

    await expect
      .poll(
        async () => {
          await frontPage.goto(true);
          return (await frontPage.addressDetails.textContent()) === expectedAddress;
        },
        { message: 'Updated address is displayed', intervals: [5000], timeout: 150000 } // Allow time for the app's branding cache to refresh.
      )
      .toBe(true);
  });
});
