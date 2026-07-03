import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getJson<T>(response: APIResponse): Promise<T> {
    return response.json() as Promise<T>;
  }
}
