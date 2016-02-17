//angular2 imports
import {Component, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import { NgClass } from 'angular2/common';

import {Spinner} from '../spinner/spinner';

//project imports
import {User} from '../../interfaces/user/user';
import {AuthService} from '../../services/auth/auth';
import {TokenService} from '../../services/token/token';

const DEFAULT_USER = {
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

@Component({
  selector: 'auth', // <auth></auth>
  styles: [ require('./auth.scss') ],
  template: require('./auth.html'),
  directives: [NgClass, Spinner],
  providers: []
})

export class AuthComponent implements OnInit {
  public user: User;
  public loginMessage: string = '';

  //Async Status Booleans
  public submitting: boolean = false;
  public renewing: boolean = false;
  public formActive: boolean = true;

  //Controls notification visibility
  public loggedIn: boolean = false;
  public warning: boolean = false;
  public displayRegister: boolean = false;
  public secondsLeft: number;
  private _countdown: any;
  private _timeout: any;

  constructor(
    private _token: TokenService,
    private _service: AuthService
  ) {
    var auth = this;
    auth._service.isLoggedIn$.subscribe(
      updatedLoginStatus => {
        auth.loggedIn = updatedLoginStatus;

        //copy token data into component data
        if (auth.loggedIn) {
          let tokenData = auth._token.getScope();
          console.log(tokenData);
          auth.user.id = tokenData.id;
          auth.user.first_name = tokenData.first_name;
          auth.user.last_name = tokenData.last_name;
          auth.user.register_date = tokenData.register_date;
          auth.user.last_login = tokenData.last_login;
          auth.user.email = tokenData.email;
        }
      }
    );
    auth._service.loginWarning$.subscribe(remainingTime => {
      console.log('Login Warning triggered!');
      //Reset the countdown so we don't have multiple running at any point
      clearInterval(auth._countdown);
      clearInterval(auth._timeout);
      //Warning Retrieved, token will expire soon!
      auth.warning = true;
      auth.secondsLeft = Math.round(remainingTime / 1000);
      auth._countdown = setInterval(() => auth.secondsLeft-- , 1000);
      auth._timeout = setTimeout(() => {
        //Reset the auth componentS
        auth.loggedIn = false;
        auth.warning = false;
        clearInterval(auth._countdown);
      }, remainingTime);
    });

    auth.user = DEFAULT_USER;
  }

  ngOnInit() {
    var auth = this;
    auth._service.checkTokenStorage();
  }

  login() {
    var auth = this;
    auth.loginMessage = '';
    auth.submitting = true;
    let login: Observable<string> = auth._service.login(auth.user.email, auth.user.password);
    login
      .subscribe(
        message => {
          //reset the form
          auth.formActive = false;
          //We use this cheap hack because angular2 doesnt have a way to reset ngControl states
          setTimeout(() => auth.formActive = true, 0);
          auth.loginMessage = message;
        },
        err => {
          auth.loginMessage = err;
          auth.submitting = false;
        },
        () => {
          auth.loginMessage = '';
          auth.submitting = false;
        }
      );
  }
  logout() {
    var auth = this;
    auth._service.logout();
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
    let auth = this;
    auth.renewing = true;
    let renew: Observable<string> = auth._service.jwt_renew();
    renew.subscribe(
      message => {
        auth.loginMessage = message;
      },
      () => {
        auth.loginMessage = '';
        auth.renewing = false;
      }
    );

    //Reset the warning pane
    auth.warning = false;
    clearInterval(auth._countdown);
    clearTimeout(auth._timeout);
  }

  showRegister() {
    var auth = this;
    auth.displayRegister = true;
    console.log(auth.displayRegister);
  }
}
