//angular2 imports
import {Component, OnInit} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

//project imports
import {User} from '../../interfaces/user/user';
import {AuthService} from '../../services/auth/auth';

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
  providers: []
})

export class AuthComponent implements OnInit {
  public user: User;

  public submitting: boolean = false;

  //Controls notification visibility
  public loggedIn: boolean = false;
  public warning: boolean = true;
  public displayRegister: boolean = false;
  public secondsLeft: number;
  private _countdown: any;
  private _timeout: any;

  constructor(
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

    auth.user = DEFAULT_USER;
  }

  ngOnInit() {
    var auth = this;
    auth._service.checkTokenStorage();
  }

  login() {
    var auth = this;
    auth.submitting = true;
    let login: Observable<string> = auth._service.login(auth.user.email, auth.user.password);
    login.subscribe(
      message => console.log(message),
      err => console.error(err),
      () => {
        auth.submitting = false;
      }
    );
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

    //Reset the warning pane
    auth.warning = true;
    clearInterval(auth._countdown);
    clearTimeout(auth._timeout);
  }

  showRegister() {
    var auth = this;
    auth.displayRegister = true;
    console.log(auth.displayRegister);
  }
}
