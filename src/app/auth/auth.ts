import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {User} from './user.interface';
import {TokenStorage} from '../shared/tokenStorage.service';
import {AuthService} from './auth.service';
import {ApiService} from '../shared/api.service';

@Component({
  selector: 'auth', // <auth></auth>
  styles: [ require('./auth.css') ],
  template: require('./auth.html'),
  providers: [TokenStorage, AuthService, ApiService]
})

export class Auth {
  public user: User;

  //Controls notification visibility
  public loggedIn: boolean = false;
  public warning: boolean = true;
  public displayRegister: boolean = false;
  public secondsLeft: number;

  constructor(
    //public service: AuthService,
    public tokenStorage: TokenStorage,
    private _service: AuthService
  ) {
    //subscribe to authService.isLoggedIn
    var auth = this;
    auth._service.isLoggedIn$.subscribe(updatedLoginStatus => auth.loggedIn = updatedLoginStatus);
    auth._service.loginWarning$.subscribe(updatedLoginWarning => {
      console.log('Subscriber received change in loginWarning$!');
    });

    //evaluate if already logged in
    if (!auth.tokenStorage.isExpired()) {
      console.log('Token is not expired!');
      console.log(auth.tokenStorage.timeLeft());
      //user is logged in with a valid token
      auth.loggedIn = true;
    }

    auth.user = {
      'id': 0,
      'email': '',
      'first_name': '',
      'last_name': '',
      'register_date': new Date(),
      'password': '',
      'token': '',
      'token_issue_date': new Date(),
      'last_login': new Date(),
      'enabled': false
    };
  }

  login() {
    var auth = this;
    auth._service.login(auth.user.email, auth.user.password);
  }
  register() {
    var auth = this;
    auth._service.register(
      auth.user.email,
      auth.user.password,
      auth.user.first_name,
      auth.user.last_name
    );
  }
  sessionRenew() {
    var auth = this;
    auth._service.jwt_renew();
  }

  monitorLoginStatus(timeRemaining: number = 60000) {
    var auth = this;
    let tokenExpireTime = timeRemaining; //seconds
    let tokenWarningTime = 60; //seconds
    //Start timer to monitor authomatic JWT Expiration
    let timer = auth.beginTimer$(tokenExpireTime, tokenWarningTime);
    timer.subscribe(
      (val) => {
        //Warning Retrieved, token will expire soon!
        auth.warning = !auth.warning;
        auth.secondsLeft = tokenWarningTime;
        let countdown = setInterval(() => auth.secondsLeft-- , 1000);
        setTimeout(() => clearInterval(countdown), tokenWarningTime * 1000);
      },
      (err) => {},
      () => {
        //Reset notifications to their default value
        auth.loggedIn = false;
        auth.warning = true;
      }
    );
  }

  beginTimer$(expiresInSeconds: number, warnBefore: number) {
    return new Observable(observer => {
      //set a timeout for completion
      let completeId = setTimeout(() => {
        observer.complete();
      }, expiresInSeconds * 1000);

      //set a warning timeout
      let warnAt = expiresInSeconds - warnBefore;
      let warningId = setTimeout(() => {
        observer.next(expiresInSeconds + ' seconds remaining.');
      }, warnAt * 1000);

      //clean up if cancelled early
      return () => {
        console.log('Timer cancelled');
        clearInterval(completeId);
        clearInterval(warningId);
      };
    });
  }

  showRegister() {
    var auth = this;
    auth.displayRegister = true;
    console.log(auth.displayRegister);
  }
}
