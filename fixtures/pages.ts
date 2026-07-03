import { test as base } from '@playwright/test';
import { AdminPage } from '../pages/AdminPage';
import { FrontPage } from '../pages/FrontPage';
import { ReservationPage } from '../pages/ReservationPage';
import { RoomsPage } from '../pages/RoomsPage';
import { Header } from '../pages/components/Header';

type PageFixtures = {
  adminPage: AdminPage;
  frontPage: FrontPage;
  reservationPage: ReservationPage;
  roomsPage: RoomsPage;
  header: Header;
};

export const test = base.extend<PageFixtures>({
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },
  frontPage: async ({ page }, use) => {
    await use(new FrontPage(page));
  },
  reservationPage: async ({ page }, use) => {
    await use(new ReservationPage(page));
  },
  roomsPage: async ({ page }, use) => {
    await use(new RoomsPage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  }
});
