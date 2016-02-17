import {Inject, Injectable, Optional} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
//import { TokenService } from '../token/token';
import {ApiOptions} from './api.options';

@Injectable()
export class ApiService {
  private options = {
    baseUrl: '/',
    jwtName: 'cpanelJwt'
  };
  constructor(public http: Http,
              @Optional() @Inject(ApiOptions) options) {
    if (options) {
      Object.assign(this.options, options);
    }
  }

  get(url: string, token?: string) {
    let jwt = token || localStorage.getItem(this.options.jwtName);
    var headers = new Headers({
      'authorization': 'Bearer ' + jwt
    });
    return this.http.get(url, {headers: headers});
  }

  login(credentials: { email: string, password: string }) {
    var api = this;

    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    return api.http.post(this.options.baseUrl + 'auth/login', JSON.stringify(credentials), {
      headers: headers
    });
  }

  register(
    credentials: {
      email: string,
      password: string,
      first_name: string,
      last_name: string
    }
  ) {
    var api = this;

    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    return api.http.post(this.options.baseUrl + 'auth/register', JSON.stringify(credentials), {
      headers: headers
    });
  }

  edit_user(
    userInfo: {
      id: number,
      first_name?: string,
      last_name?: string,
      email?: string,
      password?: string
    }
  ) {
    var api = this;
    var token = localStorage.getItem(this.options.jwtName) || null;
    var headers = new Headers({
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + token
    });
    return api.http.put(this.options.baseUrl + 'user/' + userInfo.id, JSON.stringify(userInfo), {
      headers: headers
    });
  }

  jwt_renew(token: string) {
    var api = this;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    return api.http.get(this.options.baseUrl + 'auth/jwt_renew', {headers: headers});
  }

  files(type: string) {
    var api = this;
    var token = localStorage.getItem(this.options.jwtName) || null;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    return api.http.get(this.options.baseUrl + 'files/' + type, {headers: headers});
  }

  update(path: string, content: string) {
    var api = this;
    var token = localStorage.getItem(this.options.jwtName) || null;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    var data = {
      'path': path,
      'content': content
    };
    return api.http.put(this.options.baseUrl + 'files', JSON.stringify(data), {headers: headers});
  }

  rename(path: string, newname: string) {
    var api = this;
    var token = localStorage.getItem(this.options.jwtName) || null;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    var data = {
      'path': path,
      'name': newname
    };
    return api.http.put(this.options.baseUrl + 'files/rename', JSON.stringify(data), {headers: headers});
  }

  delete(path: string) {
    var api = this;
    var token = localStorage.getItem(this.options.jwtName) || null;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    var data = { 'path': path };
    return api.http.post(this.options.baseUrl + 'files/delete', JSON.stringify(data), {headers: headers});
  }

}
