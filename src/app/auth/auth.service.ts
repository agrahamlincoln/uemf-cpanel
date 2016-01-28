import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {TokenStorage} from '../shared/tokenStorage.service';
import {ApiService} from '../shared/api.service';

@Injectable()
export class AuthService {
  //RXJS Observer for currently logged in status
  public isLoggedIn$: Observable<boolean>;
  public loginWarning$: Observable<number>;
  private _isLoggedInObserver: any;
  private _isLoggedIn: boolean = false;
  private _loginWarningObserver: any;
  private _loginTimeout: any;
  private _loginWarning: any;

  private _jwt: string;

  constructor(
    private _token: TokenStorage,
    private _api: ApiService
  ) {
    var authService = this;
    authService.isLoggedIn$ = new Observable(observer =>
        authService._isLoggedInObserver = observer).share();
    authService.loginWarning$ = new Observable(observer =>
      authService._loginWarningObserver = observer).share();

    //subscribe to tokenStorage JWT
    authService._token.tokenStream$.subscribe(updatedToken => {
      authService._jwt = updatedToken;
      //console.log('JWT has been updated: ' + authService._jwt);
    });
    authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        //console.log('authService.isLoggedIn$ reported "true", starting timer');
        authService._startTokenExpriationTimer();
      } //end isLoggedIn
    });
  }

  public checkTokenStorage() {
    var authService = this;
    var token = authService._jwt;
    //console.log('Token: "' + token + '"');
    if (!token) {
      authService._isLoggedIn = false;
      authService._isLoggedInObserver.next(authService._isLoggedIn);
    } else {
      //console.log('Got jwt: ' + token);
      //console.log('Jwt expire time: ' + authService._token.getTokenExpirationDate(token));
      if (authService._token.tokenValid()) {
        authService._isLoggedIn = true;
        authService._isLoggedInObserver.next(authService._isLoggedIn);
      }
    }
  }

  public login(email: string, password: string) {
    var authService = this;

    //create the credentials object for the login call
    let credentials = {
      'email': email,
      'password': password
    };
    let login = authService._api.login(credentials);
    login
      .map(res => res.json())
      .subscribe(
        data => {
          //Save the JWT
          authService._token.save(data.message);

          //Successfully logged in
          authService._isLoggedIn = true;
          authService._isLoggedInObserver.next(authService._isLoggedIn);
        },
        err => {
          //Oh noes, the api call was unsuccessful!
          // TODO RESPOND API ERROR TO THE USER
          console.error(err);
        },
        () => console.log('API Call Complete: Login')
      );
  }

  public register(email: string, password: string, first_name: string = '', last_name: string = '') {
    var authService = this;
    let credentials = {
      'email': email,
      'password': password,
      'first_name': first_name,
      'last_name': last_name
    };
    let register = authService._api.register(credentials);
    register
      .map(res => res.json())
      .subscribe(
        data => {
          console.log(data);
        },
        err => console.error(err),
        () => console.log('API Call Complete: Register')
      );

  }

  public jwt_renew() {
    var authService = this;
    let renew = authService._api.jwt_renew(authService._jwt);
    renew
      .map(res => res.json())
      .subscribe(
        data => {
          console.log('Session Renewed!');

          //Save the JWT
          authService._token.save(data.message);
          //Ensure that login status is true
          if (!authService._isLoggedIn) {
            //Update subscribers
            authService._isLoggedIn = true;
            authService._isLoggedInObserver.next(authService._isLoggedIn);
          }

          //Begin Monitoring the JWT Expritaion status
          //reset login timers
          console.log('Reset login timers');
          clearTimeout(authService._loginTimeout);
          clearInterval(authService._loginWarning);
          authService._startTokenExpriationTimer();
          // TODO ADD THIS PART HERE
        }
      );
  }

  private _startTokenExpriationTimer() {
    var authService = this;
    var observer = authService._loginWarningObserver;
    //Get the duration left on the current token
    let remainingTime = authService._token.timeLeft();

    //warn the observer 1 minute before end
    let warnAt = remainingTime - 60000;
    //console.log('warnAt initialized to: ' + warnAt + 'ms');
    //if time is negative, set it to 0 (no delay)
    if (warnAt < 0) {
      console.log('warnAt is negative, issuing immediate warning for expiration in ' + remainingTime + 'ms');
      observer.next(remainingTime);
    } else {
      console.log('Warning in ' + warnAt / 1000 + 's');
      authService._loginWarning = setTimeout(() => {
        //Retrieve the timeremaining from token again
        observer.next(remainingTime - warnAt);
      }, warnAt); //1 minute or less before end
    }

    //console.log(remainingTime / 1000 + 's left before current Token expires');
    //complete the observer when token expires
    authService._loginTimeout = setTimeout(() => {
      //console.log('Observer complete, clearing timers.');
      //observer.complete();
      clearTimeout(authService._loginTimeout);
      clearInterval(authService._loginWarning);

      //Logout the user
      authService._isLoggedIn = false;
      authService._isLoggedInObserver.next(authService._isLoggedIn);
    }, remainingTime);

    //clean up if cancelled early
    return () => {
      console.log('Timer ended');
      clearTimeout(authService._loginTimeout);
      clearInterval(authService._loginWarning);
    };
  }
}
