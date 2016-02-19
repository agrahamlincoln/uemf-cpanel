import {provide, Injector} from 'angular2/core';
import {
  it,
  describe,
  expect,
  inject,
  beforeEach,
  beforeEachProviders
} from 'angular2/testing';
import {MockBackend} from 'angular2/http/testing';
import {BaseRequestOptions, ConnectionBackend, Http, Headers, HTTP_PROVIDERS, Response, ResponseOptions, XHRBackend} from 'angular2/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import {ApiService} from './api';
import {ApiOptions} from './api.options';

describe('ApiService', () => {
  let http: Http;
  let response = new Response(new ResponseOptions({body: 'bar'}));
  let storage = {
    'testJwt': 'foobar'
  };

  beforeEachProviders(() => [
    MockBackend,
    BaseRequestOptions,
    provide(Http, {useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions), deps: [MockBackend, BaseRequestOptions]
    }),
    provide(ApiOptions, {useValue: new ApiOptions({
      baseUrl: 'https://foo.bar/',
      jwtName: 'testJwt'
    })}),
    ApiService
  ]);

  beforeEach(inject([Http, MockBackend], (_http: Http, mockBackend: MockBackend) => {
    http = _http;
    spyOn(http, "get").and.callThrough();
    spyOn(http, "post").and.callThrough();
    spyOn(http, "put").and.callThrough();

    //set the mockbackend response
    mockBackend.connections.subscribe(connection => connection.mockRespond(response));

    //mock localStorage for token retrievals
    spyOn(localStorage, 'getItem').and.callFake(function(key) {
      return storage[key];
    })
  }));

  describe('with custom token', () => {
    let authHeader = new Headers({
      'authorization': 'Bearer jwt'
    });
    let jsonHeader = new Headers({
      'Content-Type': 'application/json'
    });

    it('should call http.get and return some data', inject([ApiService], (api: ApiService) => {
      api.get('https://foo.bar', 'jwt')
        .map((data: Response) => data.text())
        .subscribe(data => {
          expect(data).toBe('bar');
        });

      expect(http.get).toHaveBeenCalledWith('https://foo.bar', {headers: authHeader});
    }));

  }); //end 'with custom token'

  describe('without custom token', () => {
    let authHeader = new Headers({
      'authorization': 'Bearer foobar'
    });
    let jsonHeader = new Headers({
      'Content-Type': 'application/json'
    });

    it('should get some data', inject([ApiService], (api: ApiService) => {
      api.get('https://foo.bar')
        .map((data: Response) => data.text())
        .subscribe(data => {
          expect(data).toBe('bar');
        });

      expect(http.get).toHaveBeenCalledWith('https://foo.bar', {headers: authHeader});
    }));

    it("should login and return some data", inject([ApiService], (api:ApiService) => {
      let credentials = {email: 'foo@bar.com', password: 'hunter2'};
      api.login(credentials)
        .map((data: Response) => data.text())
        .subscribe(data => {
          expect(data).toBe('bar');
        });

      expect(http.post).toHaveBeenCalledWith('https://foo.bar/auth/login', JSON.stringify(credentials), {headers: jsonHeader});
    }));

  }); //end 'without custom token'

}); //end describe('ApiService')

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
    it('should call http.put and return the raw response', inject([ApiService], (api:ApiService) => {
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

  describe('ApiService.jwt_renew()', () => {
    it('should call http.get and return the raw response', inject([ApiService], (api:ApiService) => {
      let token = 'jwt';
      let response = api.jwt_renew(token);
      let headers = {headers: new Headers({'authorization': 'Bearer jwt'})};
      expect(http.get).toHaveBeenCalledWith('https://api.com/auth/jwt_renew', headers);
      expect(response).toBe('GET response');
    }))
  });

  describe('ApiService.files()', () => {
    it('should call http.get and return the raw response', inject([ApiService], (api:ApiService) => {
      let type = 'foo';
      let token = 'jwt';
      let response = api.files(type, token);
      let headers = {headers: new Headers({'authorization': 'Bearer jwt'})};
      expect(http.get).toHaveBeenCalledWith('https://api.com/files/foo', headers);
      expect(response).toBe('GET response');
    }))
  });

  describe('ApiService.update()', () => {
    it('should call http.put and return the raw response', inject([ApiService], (api:ApiService) => {
      let path = 'foo/bar.html';
      let content = 'baz';
      let token = 'jwt';
      let response = api.update(path, content, token);
      let headers = {headers: new Headers({'authorization': 'Bearer jwt'})};
      expect(http.put).toHaveBeenCalledWith('https://api.com/files', JSON.stringify({path: path, content: content}), headers);
      expect(response).toBe('PUT response');
    }))
  });

  describe('ApiService.rename()', () => {
    it('should call http.put and return the raw response', inject([ApiService], (api:ApiService) => {
      let path = 'foo/bar.jpg';
      let newname = 'baz.jpg';
      let token = 'jwt';
      let response = api.rename(path, newname, token);
      let headers = {headers: new Headers({'authorization': 'Bearer jwt'})};
      expect(http.put).toHaveBeenCalledWith('https://api.com/files/rename', JSON.stringify({path: path, name: newname}), headers);
      expect(response).toBe('PUT response');
    }))
  });

  describe('ApiService.delete()', () => {
    it('should call http.post and return the raw response', inject([ApiService], (api:ApiService) => {
      let path = 'foo/bar.jpg';
      let token = 'jwt';
      let response = api.delete(path, token);
      let headers = {headers: new Headers({'authorization': 'Bearer jwt'})};
      expect(http.post).toHaveBeenCalledWith('https://api.com/files/delete', JSON.stringify({path: path}), headers);
      expect(response).toBe('POST response');
    }))
  });
});
