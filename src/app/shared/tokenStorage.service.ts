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
      //save the observer so we can use it from within the class
      tokenStorage._jwtObserver = observer).share();
      //share the observable so it can be accessed by multiple subscribers

    //Get the jwt from localStorage if it exists
    if (!tokenStorage.isExpired()) {
      tokenStorage._jwt = localStorage.getItem('jwt');
      //update subscribers
      tokenStorage._jwtObserver.next(tokenStorage._jwt);
    }
  }

  public save(jwt: string) {
    if (jwt) {
      localStorage.setItem('jwt', jwt);
      var d = new Date();
      var jwtExpiration = new Date();
      jwtExpiration.setMinutes(d.getMinutes() + 10); //10 minute expiration
      localStorage.setItem('jwt_expire', jwtExpiration + '');
    }
  } //End saveJwt()

  public timeLeft() {
    var expireDate = Date.parse(localStorage.getItem('jwt_expire'));
    return expireDate - Date.now();
  }

  public isExpired() {
    var expireDate = Date.parse(localStorage.getItem('jwt_expire'));
    return expireDate < Date.now();
  }
}
