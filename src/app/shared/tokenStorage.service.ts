import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

@Injectable()
export class TokenStorage {
  public jwt$: Observable<string>;
  private _jwtObserver: any;
  private _jwt = '';

  constructor () {
    var tokenStorage = this;

    //Initialize observable
    tokenStorage.jwt$ = new Observable(observer =>
      tokenStorage._jwtObserver = observer).share();
  }

  public save(jwt: string) {
    var tokenStorage = this;
    //save it in local object as well
    tokenStorage._jwt = jwt;
    tokenStorage._jwtObserver.next(tokenStorage._jwt);
    tokenStorage._store();
  } //End saveJwt()

  public timeLeft() {
    var expireDate = Date.parse(localStorage.getItem('jwt_expire'));
    return expireDate - Date.now();
  }

  public isExpired() {
    var expireDate = Date.parse(localStorage.getItem('jwt_expire'));
    return expireDate < Date.now();
  }

  private _store() {
    var tokenStorage = this;

    var d = new Date();
    var jwtExpiration = new Date();
    jwtExpiration.setMinutes(d.getMinutes() + 1); //10 minute expiration
    localStorage.setItem('jwt', tokenStorage._jwt);
    localStorage.setItem('jwt_expire', jwtExpiration + '');
  }
}
