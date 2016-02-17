import {provide} from 'angular2/core';
import {
  it,
  describe,
  expect,
  inject,
  beforeEach,
  beforeEachProviders
} from 'angular2/testing';
import {MockBackend} from 'angular2/http/testing';
import {ConnectionBackend, Http, Headers, HTTP_PROVIDERS, Response, ResponseOptions, XHRBackend} from 'angular2/http';

import {Observable} from 'rxjs/Rx';

import {ApiService} from './api';
import {ApiOptions} from './api.options';

describe('Simple GET Request', () => {
  let http:Http;
  beforeEachProviders(() => {
    return [
      HTTP_PROVIDERS, ConnectionBackend,
      provide(XHRBackend, {useClass: MockBackend}),
      ApiService,
      Http
    ]
  });

  beforeEach(inject([Http], _ => {
    http = _;
    spyOn(http, "get").and.returnValue("baz");
  }));

  it("should call http and return the raw response", inject([ApiService], (api:ApiService) => {
    let response = api.get('https://foo.bar', 'jwt');
    let headers = new Headers({
      'authorization': 'Bearer jwt'
    });
    expect(http.get).toHaveBeenCalledWith('https://foo.bar', { 'headers': headers});
    expect(response).toBe("baz");
  }));
});
