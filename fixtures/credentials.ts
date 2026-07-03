import { test as base } from '@playwright/test';

export type CredentialOptions = {
  adminUsername: string;
  adminPassword: string;
};

export const test = base.extend<CredentialOptions>({
  adminUsername: ['dummyUsername', { option: true }],
  adminPassword: ['dummyPassword', { option: true }]
});
