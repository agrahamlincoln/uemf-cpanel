import {Component, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
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

export class Auth implements OnInit {
  public user: User;

  //Controls notification visibility
  public loggedIn: boolean = false;
  public warning: boolean = true;
  public displayRegister: boolean = false;
  public secondsLeft: number;
  private _countdown: any;
  private _timeout: any;

  constructor(
    public tokenStorage: TokenStorage,
    private _service: AuthService
  ) {
    var auth = this;
    auth._service.isLoggedIn$.subscribe(updatedLoginStatus => auth.loggedIn = updatedLoginStatus);
    auth._service.loginWarning$.subscribe(remainingTime => {
      console.log('Login Warning triggered!');
      //Reset the countdown so we don't have multiple running at any point
      clearInterval(auth._countdown);
      clearInterval(auth._timeout);
      //Warning Retrieved, token will expire soon!
      auth.warning = false;
      auth.secondsLeft = Math.round(remainingTime / 1000);
      auth._countdown = setInterval(() => auth.secondsLeft-- , 1000);
      auth._timeout = setTimeout(() => {
        //Reset the auth componentS
        auth.loggedIn = false;
        auth.warning = true;
        clearInterval(auth._countdown);
      }, remainingTime);
    });

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

  ngOnInit() {
    var auth = this;
    auth._service.checkTokenStorage();
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

  showRegister() {
    var auth = this;
    auth.displayRegister = true;
    console.log(auth.displayRegister);
  }
}
