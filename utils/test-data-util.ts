import { faker } from '@faker-js/faker';
import { RoomAmenities, RoomType } from '../pages/RoomsPage';

export function generateRoomData() {
  return {
    roomName: faker.number.int({ min: 100, max: 999 }).toString(),
    roomType: faker.helpers.arrayElement([RoomType.SINGLE, RoomType.TWIN, RoomType.DOUBLE, RoomType.FAMILY, RoomType.SUITE]),
    roomIsAccessible: faker.datatype.boolean(),
    roomPrice: faker.number.int({ min: 100, max: 999 }),
    roomAmenities: {
      wifi: faker.datatype.boolean(),
      tv: faker.datatype.boolean(),
      radio: faker.datatype.boolean(),
      refreshments: faker.datatype.boolean(),
      safe: faker.datatype.boolean(),
      views: faker.datatype.boolean()
    } as RoomAmenities
  };
}

export function invalidEmails() {
  return [
    'plainaddress',
    'email@example',
    '#@%^%#$@#$@#.com',
    '@example.com Joe Smith',
    '<email@example.com>',
    'email.example.com',
    'email@example@example.com',
    '.email@example.com',
    'email..email@example.com',
    'email@example.com (Joe Smith)',
    'email@-example.com',
    'email@example..com',
    'Abc..123@example.com'
  ];
}

export function getImageUrl(roomType: RoomType) {
  if (roomType == RoomType.SINGLE) return 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg';
  else if (roomType == RoomType.TWIN) return 'https://images.pexels.com/photos/14021932/pexels-photo-14021932.jpeg';
  else if (roomType == RoomType.DOUBLE) return 'https://images.pexels.com/photos/11857305/pexels-photo-11857305.jpeg';
  else if (roomType == RoomType.FAMILY) return 'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg';
  else return 'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg';
}
