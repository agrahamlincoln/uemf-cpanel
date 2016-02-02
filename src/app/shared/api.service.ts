import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {TokenStorage} from './tokenStorage.service';

const API_BASE = 'http://localhost:3001/api/v1/';

@Injectable()
export class ApiService {
  constructor(
    public http: Http
  ) {}

  get(url: string) {
    var api = this;
    var token = localStorage.getItem('cpanelJwt') || null;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    return api.http.get('http://localhost:3001/' + url, {headers: headers});
  }

  login(credentials: { email: string, password: string }) {
    var api = this;

    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    return api.http.post(API_BASE + 'auth/login', JSON.stringify(credentials), {
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
    return api.http.post(API_BASE + 'auth/register', JSON.stringify(credentials), {
      headers: headers
    });
  }

  jwt_renew(token: string) {
    var api = this;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    return api.http.get(API_BASE + 'auth/jwt_renew', {headers: headers});
  }

  files(type: string) {
    var api = this;
    var token = localStorage.getItem('cpanelJwt') || null;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    return api.http.get(API_BASE + 'files/' + type, {headers: headers});
  }

  update(path: string, content: string) {
    var api = this;
    var token = localStorage.getItem('cpanelJwt') || null;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    var data = {
      'path': path,
      'content': content
    };
    return api.http.put(API_BASE + 'files', JSON.stringify(data), {headers: headers});
  }

  rename(path: string, newname: string) {
    var api = this;
    var token = localStorage.getItem('cpanelJwt') || null;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    var data = {
      'path': path,
      'name': newname
    };
    return api.http.put(API_BASE + 'files/rename', JSON.stringify(data), {headers: headers});
  }

  delete(path: string) {
    var api = this;
    var token = localStorage.getItem('cpanelJwt') || null;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    var data = { 'path': path };
    return api.http.post(API_BASE + 'files/delete', JSON.stringify(data), {headers: headers});
  }

}
