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
import {BaseRequestOptions, Http, Headers, HTTP_PROVIDERS, Response, ResponseOptions, XHRBackend} from 'angular2/http';

import {Observable} from 'rxjs/Rx';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout'

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

    it('edit_user should call http.put and return the raw response', inject([ApiService], (api:ApiService) => {
      let userInfo = {
        id: 0,
        first_name: 'foo',
        last_name: 'bar',
        email: 'foo@bar.com',
        password: 'hunter2'
      };
      api.edit_user(userInfo, 'jwt')
        .map((data: Response) => data.text())
        .subscribe(data => expect(data).toBe('bar'));
      let headers = {headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': 'Bearer jwt'
      })};
      expect(http.put).toHaveBeenCalledWith('https://foo.bar/user/0', JSON.stringify(userInfo), headers);
    }));

    it('jwt_renew should call http.get and return the raw response', inject([ApiService], (api:ApiService) => {
      api.jwt_renew('jwt')
        .map((data: Response) => data.text())
        .subscribe(data => expect(data).toBe('bar'));
      let headers = {headers: authHeader};
      expect(http.get).toHaveBeenCalledWith('https://foo.bar/auth/jwt_renew', headers);
    }));

    it('files should call http.get and return the raw response', inject([ApiService], (api:ApiService) => {
      api.files('foo', 'jwt')
        .map((data: Response) => data.text());
      let headers = {headers: authHeader};
      expect(http.get).toHaveBeenCalledWith('https://foo.bar/files/foo', headers);
    }));

    it('update should call http.put and return the raw response', inject([ApiService], (api:ApiService) => {
      let path = 'foo/bar.html';
      let content = 'baz';
      let token = 'jwt';
      api.update(path, content, token)
        .map((data: Response) => data.text())
        .subscribe(data => expect(data).toBe('bar'));
      let headers = {headers: authHeader};
      expect(http.put).toHaveBeenCalledWith('https://foo.bar/files', JSON.stringify({path: path, content: content}), headers);
    }));

    it('rename should call http.put and return the raw response', inject([ApiService], (api:ApiService) => {
      let path = 'foo/bar.jpg';
      let newname = 'baz.jpg';
      let token = 'jwt';
      let response = api.rename(path, newname, token);
      let headers = {headers: authHeader};
      expect(http.put).toHaveBeenCalledWith('https://foo.bar/files/rename', JSON.stringify({path: path, name: newname}), headers);
    }));

    it('should call http.post and return the raw response', inject([ApiService], (api:ApiService) => {
      let path = 'foo/bar.jpg';
      let token = 'jwt';
      api.delete(path, token)
        .map((data: Response) => data.text())
        .subscribe(data => expect(data).toBe('bar'));
      let headers = {headers: authHeader};
      expect(http.post).toHaveBeenCalledWith('https://foo.bar/files/delete', JSON.stringify({path: path}), headers);
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
        .subscribe(data => expect(data).toBe('bar'));

      expect(http.post).toHaveBeenCalledWith('https://foo.bar/auth/login', JSON.stringify(credentials), {headers: jsonHeader});
    }));

    it('should call http.post and return the raw response', inject([ApiService], (api:ApiService) => {
      let credentials = {
        email: 'foo@bar.com',
        password: 'hunter2',
        first_name: 'foo',
        last_name: 'bar'
      };
      api.register(credentials)
        .map((data: Response) => data.text())
        .subscribe(data => expect(data).toBe('bar'));

      let headers = {headers: jsonHeader};
      expect(http.post).toHaveBeenCalledWith('https://foo.bar/auth/register', JSON.stringify(credentials), headers);
    }));

    it('files should call http.get and return the raw response', inject([ApiService], (api:ApiService) => {
      api.files('foo')
        .map((data: Response) => data.text())
        .subscribe(data => expect(data).toBe('bar'));
      let headers = {headers: authHeader};
      expect(http.get).toHaveBeenCalledWith('https://foo.bar/files/foo', headers);
    }));

    it('update should call http.put and return the raw response', inject([ApiService], (api:ApiService) => {
      let path = 'foo/bar.html';
      let content = 'baz';
      api.update(path, content)
        .map((data: Response) => data.text())
        .subscribe(data => expect(data).toBe('bar'));
      let headers = {headers: authHeader};
      expect(http.put).toHaveBeenCalledWith('https://foo.bar/files', JSON.stringify({path: path, content: content}), headers);
    }));

    it('rename should call http.put and return the raw response', inject([ApiService], (api:ApiService) => {
      let path = 'foo/bar.jpg';
      let newname = 'baz.jpg';
      api.rename(path, newname)
        .map((data: Response) => data.text())
        .subscribe(data => expect(data).toBe('bar'));
      let headers = {headers: authHeader};
      expect(http.put).toHaveBeenCalledWith('https://foo.bar/files/rename', JSON.stringify({path: path, name: newname}), headers);
    }));

    it('delete should call http.post and return the raw response', inject([ApiService], (api:ApiService) => {
      let path = 'foo/bar.jpg';
      api.delete(path)
        .map((data: Response) => data.text())
        .subscribe(data => expect(data).toBe('bar'));
      let headers = {headers: authHeader};
      expect(http.post).toHaveBeenCalledWith('https://foo.bar/files/delete', JSON.stringify({path: path}), headers);
    }))
  }); //end 'without custom token'
});

describe('ApiService with timeout', () => {
  let http: Http;
  let api: ApiService;
  let response = new Response(new ResponseOptions({body: 'bar'}));

  beforeEachProviders(() => [
    Http,
    HTTP_PROVIDERS,
    provide(ApiOptions, {useValue: new ApiOptions({
      baseUrl: 'https://foo.bar/',
      jwtName: 'testJwt',
      timeout: '10' //10ms
    })}),
    ApiService
  ]);

  let fakeHttp = () => {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(response);
        observer.complete();
      }, 100); //100ms
    });
  }

  beforeEach(inject([Http, ApiService], (_http: Http, _api: ApiService) => {
    http = _http;
    api = _api;
    spyOn(http, "get").and.callFake(fakeHttp);
    spyOn(http, "post").and.callFake(fakeHttp);
    spyOn(http, "put").and.callFake(fakeHttp);
  }));

  it('get should timeout gracefully', (done) => {
    let error = new Error('foo');
    let apiError: any;
    api.get('https://foo.bar', 'jwt')
      .timeout(10, error)
      .subscribe(
        data => null,
        err => {
          apiError = err;
          expect(apiError).toBe(error);
          console.log(apiError);
          console.log(err);
          done();
        },
        () => done()
      );
  });
});
