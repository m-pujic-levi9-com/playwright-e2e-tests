export const Messages = {
  login: {
    invalidCredentials: 'Invalid credentials'
  },
  rooms: {
    nameRequired: 'Room name must be set',
    priceTooLow: 'must be greater than or equal to 1'
  },
  booking: {
    success: 'Booking Successful!',
    confirmed: 'Congratulations! Your booking has been confirmed',
    firstNameBlank: 'Firstname should not be blank',
    firstNameSize: 'size must be between 3 and 18',
    lastNameBlank: 'Lastname should not be blank',
    lastNameSize: 'size must be between 3 and 30',
    fieldEmpty: 'must not be empty',
    invalidEmail: 'must be a well-formed email address',
    phoneSize: 'size must be between 11 and 21'
  },
  contact: {
    success: (name: string) => `Thanks for getting in touch ${name}`,
    nameBlank: 'Name may not be blank',
    emailBlank: 'Email may not be blank',
    phoneBlank: 'Phone may not be blank',
    phoneSize: 'Phone must be between 11 and 21 characters',
    subjectBlank: 'Subject may not be blank',
    subjectSize: 'Subject must be between 5 and 100 characters',
    messageBlank: 'Message may not be blank',
    messageSize: 'Message must be between 20 and 2000 characters',
    invalidEmail: 'must be a well-formed email address'
  }
};
