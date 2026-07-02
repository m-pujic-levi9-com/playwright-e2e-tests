import { test as base, APIRequestContext } from '@playwright/test';
import { AuthApi } from '../apis/AuthApi';
import { BookingApi } from '../apis/BookingApi';
import { RoomApi } from '../apis/RoomApi';

type ApiFixtures = {
  authedRequest: APIRequestContext;
  authApi: AuthApi;
  bookingApi: BookingApi;
  roomApi: RoomApi;
  authedAuthApi: AuthApi;
  authedBookingApi: BookingApi;
  authedRoomApi: RoomApi;
};

export const test = base.extend<ApiFixtures>({
  authedRequest: async ({ playwright, baseURL }, use) => {
    const tempContext = await playwright.request.newContext({ baseURL });
    const response = await tempContext.post('/api/auth/login', {
      data: { username: 'admin', password: 'password' }
    });
    const { token } = await response.json();
    await tempContext.dispose();

    const url = new URL(baseURL!);
    const authedContext = await playwright.request.newContext({
      baseURL,
      storageState: {
        cookies: [
          {
            name: 'token',
            value: token,
            domain: url.hostname,
            path: '/',
            httpOnly: false,
            secure: url.protocol === 'https:',
            sameSite: 'Lax',
            expires: -1
          }
        ],
        origins: []
      }
    });

    await use(authedContext);
    await authedContext.dispose();
  },
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },
  bookingApi: async ({ request }, use) => {
    await use(new BookingApi(request));
  },
  roomApi: async ({ request }, use) => {
    await use(new RoomApi(request));
  },
  authedBookingApi: async ({ authedRequest }, use) => {
    await use(new BookingApi(authedRequest));
  },
  authedRoomApi: async ({ authedRequest }, use) => {
    await use(new RoomApi(authedRequest));
  }
});
