import { APIRequestContext } from '@playwright/test';
import { test as credentialOptions } from './credentials';
import { BookingApi } from '../apis/BookingApi';
import { RoomApi } from '../apis/RoomApi';

type ApiFixtures = {
  authedRequest: APIRequestContext;
  bookingApi: BookingApi;
  roomApi: RoomApi;
};

export const test = credentialOptions.extend<ApiFixtures>({
  authedRequest: async ({ playwright, baseURL, adminUsername, adminPassword }, use) => {
    const tempContext = await playwright.request.newContext({ baseURL });
    const response = await tempContext.post('/api/auth/login', {
      data: { username: adminUsername, password: adminPassword }
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
  bookingApi: async ({ authedRequest }, use) => {
    await use(new BookingApi(authedRequest));
  },
  roomApi: async ({ authedRequest }, use) => {
    await use(new RoomApi(authedRequest));
  }
});
