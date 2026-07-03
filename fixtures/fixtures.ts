import { mergeTests, expect } from '@playwright/test';
import { test as apiFixtures } from './apis';
import { test as uiFixtures } from './pages';

export const test = mergeTests(apiFixtures, uiFixtures);
export { expect };
