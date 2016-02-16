import {
  it,
  describe,
  expect,
  inject,
  beforeEachProviders
} from 'angular2/testing';
import {ApiService} from './api';

describe('Api Service', () => {

  beforeEachProviders(() => [ApiService]);

  it('should always be true', inject([ApiService], (api:ApiService) => {
    expect(true).toBe(true);
  }));

});
