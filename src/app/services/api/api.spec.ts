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
      provide(ApiOptions, {useValue: new ApiOptions({baseUrl: 'https://api.com/'})}),
      ApiService,
      Http
    ]
  });

  beforeEach(inject([Http], _ => {
    http = _;
    spyOn(http, "get").and.returnValue("GET response");
    spyOn(http, "post").and.returnValue("POST response");
    spyOn(http, "put").and.returnValue("PUT response");
  }));

  describe('ApiService.get()', () => {
    it("should call http.get and return the raw response", inject([ApiService], (api:ApiService) => {
      let response = api.get('https://foo.bar', 'jwt');
      let headers = new Headers({
        'authorization': 'Bearer jwt'
      });
      expect(http.get).toHaveBeenCalledWith('https://foo.bar', { 'headers': headers});
      expect(response).toBe("GET response");
    }));
  });

  describe('ApiService.login()', () => {
    it("should call http.post and return the raw response", inject([ApiService], (api:ApiService) => {
      let credentials = {email: 'foo@bar.com', password: 'hunter2'};
      let response = api.login(credentials);
      let headers = {headers: new Headers({'Content-Type': 'application/json'})};
      expect(http.post).toHaveBeenCalledWith('https://api.com/auth/login', JSON.stringify(credentials), headers);
      expect(response).toBe('POST response');
    }))
  });

  describe('ApiService.register()', () => {
    it('should call http.post and return the raw response', inject([ApiService], (api:ApiService) => {
      let credentials = {
        email: 'foo@bar.com',
        password: 'hunter2',
        first_name: 'foo',
        last_name: 'bar'
      };
      let response = api.register(credentials);
      let headers = {headers: new Headers({'Content-Type': 'application/json'})};
      expect(http.post).toHaveBeenCalledWith('https://api.com/auth/register', JSON.stringify(credentials), headers);
      expect(response).toBe('POST response');
    }))
  });

  describe('ApiService.edit_user()', () => {
    it('should...', inject([ApiService], (api:ApiService) => {
      let userInfo = {
        id: 0,
        first_name: 'foo',
        last_name: 'bar',
        email: 'foo@bar.com',
        password: 'hunter2'
      };
      let token = 'jwt';
      let response = api.edit_user(userInfo, token);
      let headers = {headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + token
      })};
      expect(http.put).toHaveBeenCalledWith('https://api.com/user/0', JSON.stringify(userInfo), headers);
      expect(response).toBe('PUT response');
    }))
  });
  describe('ApiService.func()', () => {
    it('should...', inject([ApiService], (api:ApiService) => {

    }))
  });
  describe('ApiService.func()', () => {
    it('should...', inject([ApiService], (api:ApiService) => {

    }))
  });
  describe('ApiService.func()', () => {
    it('should...', inject([ApiService], (api:ApiService) => {

    }))
  });
  describe('ApiService.func()', () => {
    it('should...', inject([ApiService], (api:ApiService) => {

    }))
  });
  describe('ApiService.func()', () => {
    it('should...', inject([ApiService], (api:ApiService) => {

    }))
  });

  it("should equal true", () => {
    expect(true).toBe(true);
  })
});
