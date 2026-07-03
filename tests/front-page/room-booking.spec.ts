import { test, expect } from '../../fixtures/fixtures';
import { faker } from '@faker-js/faker';
import { generateRoomData, invalidEmails } from '../../utils/test-data-util';
import { Messages } from '../../utils/messages';

test.describe('Room Booking Tests', () => {
  const { roomName, roomType, roomIsAccessible, roomPrice, roomAmenities } = generateRoomData();
  let fromDate: Date;
  let toDate: Date;
  let roomId: number;

  test.beforeEach(async ({ roomApi, reservationPage }) => {
    await roomApi.createRoom(roomName, roomType, roomIsAccessible, roomPrice, roomAmenities);
    roomId = await roomApi.getRoomIdByName(roomName);
    fromDate = faker.date.future();
    toDate = faker.date.soon({ days: 30, refDate: fromDate });
    await reservationPage.goto(roomId.toString(), fromDate, toDate);
  });

  test.afterEach(async ({ roomApi }) => {
    await roomApi.deleteRoom(roomId);
  });

  test('Visitor must be able to book a room for available dates by filling up all mandatory fields @sanity @booking', async ({ reservationPage }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    await reservationPage.bookRoom(firstName, lastName, email, phoneNumber);

    await expect(reservationPage.bookingConfirmation, 'Booking Confirmation is displayed').toBeVisible();
    await expect(reservationPage.bookingConfirmation, `Booking Success Message '${Messages.booking.success}' is displayed`).toContainText(
      Messages.booking.success
    );
    await expect(reservationPage.bookingConfirmation, `Booking Confirmed Message '${Messages.booking.confirmed}' is displayed`).toContainText(
      Messages.booking.confirmed
    );
  });

  test('Visitor must NOT be able to book a room without filling up first name field @booking', async ({ reservationPage }) => {
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    await reservationPage.bookRoom('', lastName, email, phoneNumber);

    await expect(reservationPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(reservationPage.bookingErrorMessages, `Mandatory Message '${Messages.booking.firstNameBlank}' is displayed`).toContainText(
      Messages.booking.firstNameBlank
    );
    await expect(reservationPage.bookingErrorMessages, `Validation Message '${Messages.booking.firstNameSize}' is displayed`).toContainText(
      Messages.booking.firstNameSize
    );
  });

  for (const firstNameLength of [2, 19]) {
    test(`Visitor must NOT be able to book a room by filling up the first name with invalid length value of ${firstNameLength}, less than 3 and more than 18 characters @booking`, async ({
      reservationPage
    }) => {
      const firstName = faker.string.alphanumeric(firstNameLength);
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await reservationPage.bookRoom(firstName, lastName, email, phoneNumber);

      await expect(reservationPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(reservationPage.bookingErrorMessages, `Validation Message '${Messages.booking.firstNameSize}' is displayed`).toContainText(
        Messages.booking.firstNameSize
      );
    });
  }

  for (const firstNameLength of [3, 18]) {
    test(`Visitor must be able to book a room by filling up the first name with valid length value of ${firstNameLength}, more than 3 and less than 18 characters @booking`, async ({
      reservationPage
    }) => {
      const firstName = faker.string.alphanumeric(firstNameLength);
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await reservationPage.bookRoom(firstName, lastName, email, phoneNumber);

      await expect(reservationPage.bookingConfirmation, 'Booking Confirmation is displayed').toBeVisible();
      await expect(reservationPage.bookingConfirmation, `Booking Success Message '${Messages.booking.success}' is displayed`).toContainText(
        Messages.booking.success
      );
      await expect(reservationPage.bookingConfirmation, `Booking Confirmed Message '${Messages.booking.confirmed}' is displayed`).toContainText(
        Messages.booking.confirmed
      );
    });
  }

  test('Visitor must NOT be able to book a room without filling up last name field @booking', async ({ reservationPage }) => {
    const firstName = faker.person.firstName();
    const email = faker.internet.email();
    const phoneNumber = faker.phone.number();
    await reservationPage.bookRoom(firstName, '', email, phoneNumber);

    await expect(reservationPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(reservationPage.bookingErrorMessages, `Mandatory Message '${Messages.booking.lastNameBlank}' is displayed`).toContainText(
      Messages.booking.lastNameBlank
    );
    await expect(reservationPage.bookingErrorMessages, `Validation Message '${Messages.booking.lastNameSize}' is displayed`).toContainText(
      Messages.booking.lastNameSize
    );
  });

  for (const lastNameLength of [2, 31]) {
    test(`Visitor must NOT be able to book a room by filling up the last name with invalid length value of ${lastNameLength}, less than 3 and more than 30 characters @booking`, async ({
      reservationPage
    }) => {
      const firstName = faker.person.firstName();
      const lastName = faker.string.alphanumeric(lastNameLength);
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await reservationPage.bookRoom(firstName, lastName, email, phoneNumber);

      await expect(reservationPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(reservationPage.bookingErrorMessages, `Validation Message '${Messages.booking.lastNameSize}' is displayed`).toContainText(
        Messages.booking.lastNameSize
      );
    });
  }

  for (const lastNameLength of [3, 30]) {
    test(`Visitor must be able to book a room by filling up the last name with valid length value of ${lastNameLength}, more than 3 and less than 30 characters @booking`, async ({
      reservationPage
    }) => {
      const firstName = faker.person.firstName();
      const lastName = faker.string.alphanumeric(lastNameLength);
      const email = faker.internet.email();
      const phoneNumber = faker.phone.number();
      await reservationPage.bookRoom(firstName, lastName, email, phoneNumber);

      await expect(reservationPage.bookingConfirmation, 'Booking Confirmation is displayed').toBeVisible();
      await expect(reservationPage.bookingConfirmation, `Booking Success Message '${Messages.booking.success}' is displayed`).toContainText(
        Messages.booking.success
      );
      await expect(reservationPage.bookingConfirmation, `Booking Confirmed Message '${Messages.booking.confirmed}' is displayed`).toContainText(
        Messages.booking.confirmed
      );
    });
  }

  test('Visitor must NOT be able to book a room without filling up email field @booking', async ({ reservationPage }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const phoneNumber = faker.phone.number();
    await reservationPage.bookRoom(firstName, lastName, '', phoneNumber);

    await expect(reservationPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(reservationPage.bookingErrorMessages, `Mandatory Message '${Messages.booking.fieldEmpty}' is displayed`).toContainText(
      Messages.booking.fieldEmpty
    );
  });

  for (const invalidEmail of invalidEmails()) {
    test(`Visitor must NOT be able to book a room by filling up email with invalid value: ${invalidEmail} @booking`, async ({ reservationPage }) => {
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(invalidEmail == 'email@example', 'Know issue');
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const phoneNumber = faker.phone.number();
      const email = invalidEmail;
      await reservationPage.bookRoom(firstName, lastName, email, phoneNumber);

      await expect(reservationPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(reservationPage.bookingErrorMessages, `Validation Message '${Messages.booking.invalidEmail}' is displayed`).toContainText(
        Messages.booking.invalidEmail
      );
    });
  }

  test('Visitor must NOT be able to book a room without filling up phone field @booking', async ({ reservationPage }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    await reservationPage.bookRoom(firstName, lastName, email, '');

    await expect(reservationPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
    await expect(reservationPage.bookingErrorMessages, `Mandatory Message '${Messages.booking.fieldEmpty}' is displayed`).toContainText(
      Messages.booking.fieldEmpty
    );
    await expect(reservationPage.bookingErrorMessages, `Validation Message '${Messages.booking.phoneSize}' is displayed`).toContainText(
      Messages.booking.phoneSize
    );
  });

  for (const phoneLength of [10, 22]) {
    test(`Visitor must NOT be able to book a room by filling up the phone with invalid length value of ${phoneLength}, less than 11 and more than 21 characters @booking`, async ({
      reservationPage
    }) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.string.numeric(phoneLength);
      await reservationPage.bookRoom(firstName, lastName, email, phoneNumber);

      await expect(reservationPage.bookingErrorMessages, 'Error Messages are displayed').toBeVisible();
      await expect(reservationPage.bookingErrorMessages, `Validation Message '${Messages.booking.phoneSize}' is displayed`).toContainText(
        Messages.booking.phoneSize
      );
    });
  }

  for (const phoneLength of [11, 21]) {
    test(`Visitor must be able to book a room by filling up the phone with valid length value of ${phoneLength}, more than 11 and less than 21 characters @booking`, async ({
      reservationPage
    }) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const phoneNumber = faker.string.numeric(phoneLength);
      await reservationPage.bookRoom(firstName, lastName, email, phoneNumber);

      await expect(reservationPage.bookingConfirmation, 'Booking Confirmation is displayed').toBeVisible();
      await expect(reservationPage.bookingConfirmation, `Booking Success Message '${Messages.booking.success}' is displayed`).toContainText(
        Messages.booking.success
      );
      await expect(reservationPage.bookingConfirmation, `Booking Confirmed Message '${Messages.booking.confirmed}' is displayed`).toContainText(
        Messages.booking.confirmed
      );
    });
  }
});
