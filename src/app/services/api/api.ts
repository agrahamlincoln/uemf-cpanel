import {Inject, Injectable, Optional} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
//import { TokenService } from '../token/token';
import {ApiOptions} from './api.options';

@Injectable()
export class ApiService {
  private options = {
    apiUrl: location.origin || location.protocol + "//" + location.host,
    jwtName: 'cpanelJwt',
    timeout: 5000 //5 second default timeout
  };
  constructor(public http: Http,
              @Optional() @Inject(ApiOptions) options) {
    if (options) {
      Object.assign(this.options, options);
    }
    if (this.options.timeout <= 0) {
      this.options.timeout = 0;
    }
  }

  get(url: string, token?: string) {
    let jwt = token || localStorage.getItem(this.options.jwtName);
    let headers = new Headers({
      'authorization': 'Bearer ' + jwt
    });

    let res = this.http.get(url, {headers});
    if (this.options.timeout) {
      res.timeout(this.options.timeout, new Error('Request timed out'));
    }
    return res;
  }

  getPage(pageName: string) {
    let pathArray = this.options.apiUrl.split( '/' );
    let protocol = pathArray[0];
    let host = pathArray[2];
    let url = protocol + '//' + host;

    let res = this.http.get(url + '/content/pages/' + pageName);
    if (this.options.timeout) {
      res.timeout(this.options.timeout, new Error('Request timed out'));
    }
    return res;
  }

  login(credentials: { email: string, password: string }) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let res = this.http.post(this.options.apiUrl + 'auth/login', JSON.stringify(credentials), {
      headers: headers
    });
    if(this.options.timeout) {
      res.timeout(this.options.timeout, new Error('Login request timed out'));
    }
    return res;
  }

  register(
    credentials: {
      email: string,
      password: string,
      first_name: string,
      last_name: string
    }
  ) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.options.apiUrl + 'auth/register', JSON.stringify(credentials), {
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
    },
    token?: string
  ) {
    let jwt = token || localStorage.getItem(this.options.jwtName);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + jwt
    });
    return this.http.put(this.options.apiUrl + 'user/' + userInfo.id, JSON.stringify(userInfo), {
      headers: headers
    });
  }

  jwt_renew(token: string) {
    let headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    return this.http.get(this.options.apiUrl + 'auth/jwt_renew', {headers: headers});
  }

  files(type: string, token?: string) {
    console.log(this.options.jwtName);
    let jwt = token || localStorage.getItem(this.options.jwtName);
    let headers = new Headers({
      'authorization': 'Bearer ' + jwt
    });
    return this.http.get(this.options.apiUrl + 'files/' + type, {headers: headers});
  }

  update(path: string, content: string, token?: string) {
    let jwt = token || localStorage.getItem(this.options.jwtName);
    let headers = new Headers({
      'authorization': 'Bearer ' + jwt
    });
    let data = {
      'path': path,
      'content': content
    };
    return this.http.put(this.options.apiUrl + 'files', JSON.stringify(data), {headers: headers});
  }

  rename(path: string, newname: string, token?: string) {
    let jwt = token || localStorage.getItem(this.options.jwtName);
    let headers = new Headers({
      'authorization': 'Bearer ' + jwt
    });
    let data = {
      'path': path,
      'name': newname
    };
    return this.http.put(this.options.apiUrl + 'files/rename', JSON.stringify(data), {headers: headers});
  }

  delete(path: string, token?: string) {
    let jwt = token || localStorage.getItem(this.options.jwtName);
    let headers = new Headers({
      'authorization': 'Bearer ' + jwt
    });
    let data = { 'path': path };
    return this.http.post(this.options.apiUrl + 'files/delete', JSON.stringify(data), {headers: headers});
  }

}
