import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {TokenStorage} from '../shared/tokenStorage.service';
import {ApiService} from '../shared/api.service';
import 'rxjs/add/operator/share';

@Injectable()
export class AuthService {
  //RXJS Observer for currently logged in status
  public isLoggedIn$: Observable<boolean>;
  private _isLoggedInObserver: any;
  private _isLoggedIn: boolean = false;

  public loginWarning$: Observable<string>;
  private _loginWarningObserver: any;

  private _jwt: string = '';

  constructor(
    private _api: ApiService,
    private _token: TokenStorage
  ) {
    var authService = this;
    //Initialize isLoggedIn observable
    authService.isLoggedIn$ = new Observable(observer =>
      //save the observer so we can use it from within this class
      authService._isLoggedInObserver = observer).share();
      //Share the observable so it can be accessed by multiple subscribers

    //Check token storage for a token & validate it
    if (!authService._token.isExpired()) {
      //Token is in storage and is valid!
      authService._isLoggedIn = true;
      authService._isLoggedInObserver.next(authService._isLoggedIn);
    }

    //subscribe to tokenStorage JWT
    authService._token.jwt$.subscribe(updatedToken => authService._jwt = updatedToken);

    //subscribe to isLoggedIn observable
    authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        //reset the observer in case it's already running
        authService._loginWarningObserver.complete();

        //Get the duration left on the current token
        let remainingTime = authService._token.timeLeft();

        //start a timer to monitor the status
        authService._loginWarningObserver = new Observable(observer => {
          //complete the observer when token expires
          let completeId = setTimeout(() => {
            observer.complete();
          }, remainingTime); //10 minutes

          //warn the observer 1 minute before end
          let warnAt = remainingTime-60000;
          //if time is negative, set it to 0 (no delay)
          if (warnAt < 0) { warnAt = 0 }
          let warningId = setTimeout(() => {
            observer.next('1 Minute Login Warning!');
          }, warnAt); //1 minute or less before end

          //clean up if cancelled early
          return () => {
            console.log('Timer ended');
            clearInterval(completeId);
            clearInterval(warningId);
          }
        }).share();
      } //end isLoggedIn
    });
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
          //Successfully logged in
          authService._isLoggedIn = true;
          //Update the subscribers
          authService._isLoggedInObserver.next(authService._isLoggedIn);

          //Save the JWT
          authService._token.save(data.message);

          //Begin Monitoring the JWT Expiration status
          // TODO ADD THIS PART HERE
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
        () => console.log('Registration Complete')
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
          //Ensure that login status is true
          authService._isLoggedIn = true;
          //Update subscribers
          authService._isLoggedInObserver.next(authService._isLoggedIn);

          //Save the JWT
          authService._token.save(data.message);

          //Begin Monitoring the JWT Expritaion status
          // TODO ADD THIS PART HERE
        }
      );
  }


}
