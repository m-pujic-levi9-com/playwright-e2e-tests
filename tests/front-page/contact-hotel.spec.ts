import { test, expect } from '../../fixtures/fixtures';
import { faker } from '@faker-js/faker';
import { invalidEmails } from '../../utils/test-data-util';
import { Messages } from '../../utils/messages';

test.describe('Contact Hotel Tests', () => {
  test.beforeEach(async ({ frontPage }) => {
    await frontPage.goto();
  });

  test('Visitor must be able to contact the property by filling up all mandatory fields @sanity @contact', async ({ frontPage }) => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, email, phoneNumber, subject, message);

    const successMessage = Messages.contact.success(name);
    await expect(frontPage.contactSuccessMessage, 'Messages Sent Successful').toBeVisible();
    await expect(frontPage.contactSuccessMessage, `Success Message '${successMessage}' is displayed`).toContainText(successMessage);
  });

  test('Visitor must NOT be able to contact the property without filling up name field @contact', async ({ frontPage }) => {
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage('', email, phoneNumber, subject, message);

    await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.contactErrorMessages, `Mandatory Message '${Messages.contact.nameBlank}' is displayed`).toContainText(
      Messages.contact.nameBlank
    );
  });

  test('Visitor must NOT be able to contact the property without filling up email field @contact', async ({ frontPage }) => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, '', phoneNumber, subject, message);

    await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.contactErrorMessages, `Mandatory Message '${Messages.contact.emailBlank}' is displayed`).toContainText(
      Messages.contact.emailBlank
    );
  });

  test('Visitor must NOT be able to contact the property without filling up phone field @contact', async ({ frontPage }) => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const subject = faker.lorem.sentence(3);
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, email, '', subject, message);

    await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.contactErrorMessages, `Mandatory Message '${Messages.contact.phoneBlank}' is displayed`).toContainText(
      Messages.contact.phoneBlank
    );
    await expect(frontPage.contactErrorMessages, `Validation Message '${Messages.contact.phoneSize}' is displayed`).toContainText(
      Messages.contact.phoneSize
    );
  });

  test('Visitor must NOT be able to contact the property without filling up subject field @contact', async ({ frontPage }) => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const message = faker.lorem.lines(5);
    await frontPage.sendMessage(name, email, phoneNumber, '', message);

    await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.contactErrorMessages, `Mandatory Message '${Messages.contact.subjectBlank}' is displayed`).toContainText(
      Messages.contact.subjectBlank
    );
    await expect(frontPage.contactErrorMessages, `Validation Message '${Messages.contact.subjectSize}' is displayed`).toContainText(
      Messages.contact.subjectSize
    );
  });

  test('Visitor must NOT be able to contact the property without filling up message field @contact', async ({ frontPage }) => {
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    const subject = faker.lorem.sentence(3);
    await frontPage.sendMessage(name, email, phoneNumber, subject, '');

    await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(frontPage.contactErrorMessages, `Mandatory Message '${Messages.contact.messageBlank}' is displayed`).toContainText(
      Messages.contact.messageBlank
    );
    await expect(frontPage.contactErrorMessages, `Validation Message '${Messages.contact.messageSize}' is displayed`).toContainText(
      Messages.contact.messageSize
    );
  });

  for (const invalidEmail of invalidEmails()) {
    test(`Visitor must NOT be able to contact the property by filling up email with invalid value: ${invalidEmail} @contact`, async ({
      frontPage
    }) => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(invalidEmail == 'email@example', 'Know issue');
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const phoneNumber = faker.phone.number();
      const subject = faker.lorem.sentence(3);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, invalidEmail, phoneNumber, subject, message);

      await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.contactErrorMessages, `Validation Message '${Messages.contact.invalidEmail}' is displayed`).toContainText(
        Messages.contact.invalidEmail
      );
    });
  }

  for (const invalidPhone of ['1234567890', '1234567890123456789012']) {
    test(`Visitor must NOT be able to contact the property by filling up the phone with invalid length, less than 11 and more than 21 characters: ${invalidPhone} @contact`, async ({
      frontPage
    }) => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const subject = faker.lorem.sentence(3);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, invalidPhone, subject, message);

      await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.contactErrorMessages, `Validation Message '${Messages.contact.phoneSize}' is displayed`).toContainText(
        Messages.contact.phoneSize
      );
    });
  }

  for (const validPhone of ['12345678901', '123456789012345678901']) {
    test(`Visitor must be able to contact the property by filling up phone with valid length, between 11 and 21 characters: ${validPhone} @contact`, async ({
      frontPage
    }) => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const subject = faker.lorem.sentence(3);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, validPhone, subject, message);

      const successMessage = Messages.contact.success(name);
      await expect(frontPage.contactSuccessMessage, 'Messages Sent Successful').toBeVisible();
      await expect(frontPage.contactSuccessMessage, `Success Message '${successMessage}' is displayed`).toContainText(successMessage);
    });
  }

  for (const invalidSubjectLength of [4, 101]) {
    test(`Visitor must NOT be able to contact the property by filling up the subject with invalid length value of ${invalidSubjectLength}, less than 5 and more than 100 characters @contact`, async ({
      frontPage
    }) => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.string.alphanumeric(invalidSubjectLength);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);

      await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.contactErrorMessages, `Validation Message '${Messages.contact.subjectSize}' is displayed`).toContainText(
        Messages.contact.subjectSize
      );
    });
  }

  for (const validSubjectLength of [5, 100]) {
    test(`Visitor must be able to contact the property by filling up the subject with valid length value of ${validSubjectLength}, between 5 and 100 characters @contact`, async ({
      frontPage
    }) => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.string.alphanumeric(validSubjectLength);
      const message = faker.lorem.lines(5);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);

      const successMessage = Messages.contact.success(name);
      await expect(frontPage.contactSuccessMessage, 'Messages Sent Successful').toBeVisible();
      await expect(frontPage.contactSuccessMessage, `Success Message '${successMessage}' is displayed`).toContainText(successMessage);
    });
  }

  for (const invalidMessageLength of [19, 2001]) {
    test(`Visitor must NOT be able to contact the property by filling up the message with invalid length value of ${invalidMessageLength}, less than 20 and more than 2000 characters @contact`, async ({
      frontPage
    }) => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.lorem.sentence(3);
      const message = faker.string.alphanumeric(invalidMessageLength);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);

      await expect(frontPage.contactErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(frontPage.contactErrorMessages, `Validation Message '${Messages.contact.messageSize}' is displayed`).toContainText(
        Messages.contact.messageSize
      );
    });
  }

  for (const validMessageLength of [20, 2000]) {
    test(`Visitor must be able to contact the property by filling up the message with valid length value of ${validMessageLength}, between 20 and 2000 characters @contact`, async ({
      frontPage
    }) => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      const subject = faker.lorem.sentence(3);
      const message = faker.string.alphanumeric(validMessageLength);
      await frontPage.sendMessage(name, email, phoneNumber, subject, message);

      const successMessage = Messages.contact.success(name);
      await expect(frontPage.contactSuccessMessage, 'Messages Sent Successful').toBeVisible();
      await expect(frontPage.contactSuccessMessage, `Success Message '${successMessage}' is displayed`).toContainText(successMessage);
    });
  }
});
