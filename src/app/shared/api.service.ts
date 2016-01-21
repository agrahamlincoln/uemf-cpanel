import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Injectable()
export class ApiService {
  constructor(
    public http: Http
  ) {}

  login(credentials: { email: string, password: string }) {
    var api = this;

    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    return api.http.post('http://localhost:3001/api/v1/auth/login', JSON.stringify(credentials), {
      headers: headers
    });
  }

  register(credentials: { email: string, password: string, first_name: string, last_name: string }) {
    var api = this;

    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    return api.http.post('http://localhost:3001/api/v1/auth/register', JSON.stringify(credentials), {
      headers: headers
    });
  }

  jwt_renew(token: string) {
    var api = this;
    var headers = new Headers({
      'authorization': 'Bearer ' + token
    });
    return api.http.get('http://localhost:3001/api/v1/auth/jwt_renew', {headers: headers});
  }
}
