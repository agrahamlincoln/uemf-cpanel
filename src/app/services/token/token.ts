import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

// Avoid TS error "cannot find name escape"
declare var escape: any;

@Injectable()
export class TokenService {
  public tokenStream$: Observable<string>;
  private _jwtObserver: any;
  private _jwt = '';

  constructor () {
    var tokenStorage = this;

    //Initialize observable
    tokenStorage.tokenStream$ = new Observable(observer => {
      if (tokenStorage.tokenValid()) {
        //console.log('token is valid, using what was found in localStorage');
        tokenStorage._jwt = tokenStorage.getSaved();
      }
      tokenStorage._jwtObserver = observer;
      tokenStorage._jwtObserver.next(tokenStorage._jwt);
    }).share();
  }

  public tokenValid(jwt?: string) {
    var tokenStorage = this;
    var token: string;

    if (jwt) {
      token = jwt;
    } else {
      token = tokenStorage.getSaved();
    }

    var parts = token.split('.');

    if (parts.length !== 3) {
      return false;
    }

    if (!token || tokenStorage.isTokenExpired(token)) {
      return false;
    } else {
      return true;
    }
  }

  public getSaved() {
    return localStorage.getItem('cpanelJwt');
  }

  public save(jwt: string) {
    var tokenStorage = this;
    //save it in local object
    tokenStorage._jwt = jwt;
    tokenStorage._jwtObserver.next(tokenStorage._jwt);
    tokenStorage._store();
  } //End saveJwt()

  public timeLeft() {
    var tokenStorage = this;
    //console.log('calculating time left on token: ' + tokenStorage._jwt);
    var expireDate = this.getTokenExpirationDate(tokenStorage._jwt);
    if (expireDate === null) { return 0; }

    return expireDate.valueOf() - Date.now().valueOf();
  }

  public getScope() {
    var tokenStorage = this;
    var decoded: any;
    decoded = tokenStorage._decodeToken(tokenStorage._jwt);

    if (typeof decoded.scope === 'undefined') {
      return null;
    }

    return decoded.scope;
  }

  public getTokenExpirationDate(token: string) {
    var decoded: any;
    decoded = this._decodeToken(token);

    if (typeof decoded.exp === 'undefined') {
      return null;
    }

    var date = new Date(0); // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  public isTokenExpired(token: string, offsetSeconds?: number) {
    var date = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (date === null) {
      return false;
    }

    // Token expired?
    return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
  }

  private _store() {
    localStorage.setItem('cpanelJwt', this._jwt);
  }

  private _urlBase64Decode(str: string) {
    var output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw 'Illegal base64url string!';
      }
    }

    return decodeURIComponent(escape(window.atob(output)));
    //polifyll https://github.com/davidchambers/Base64.js
  }

  private _decodeToken(token: string) {
    var parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }

    var decoded = this._urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }

    return JSON.parse(decoded);
  }
}

/**
 * Verifies token from storage or optionally passed.
 * This method is separated for use with @CanActivate router decorator and NgIf directive
 */
export function isTokenExpired(storageTokenName?: string, jwt?: string) {
  var tokenName: string = storageTokenName || 'cpanelJwt';
  var token: string;

  if (jwt) {
    token = jwt;
  } else {
    token = localStorage.getItem(tokenName);
  }

  var tokenStorage = new TokenService();
  if (!token || tokenStorage.isTokenExpired(token)) {
    return false;
  } else {
    return true;
  }
}
