import { Component } from 'angular2/core';
import { FORM_DIRECTIVES } from 'angular2/common';

import { ApiService } from '../shared/api.service';
import { TokenStorage } from '../shared/tokenStorage.service';
import { SpinnerComponent } from '../shared/spinner.component';

@Component({
  selector: 'user-manager',
  template: require('./userManager.html'),
  directives: [SpinnerComponent]
})
export class UserManager {

  public password: string;
  public newPassword: string;
  public passwordConfirm: string;
  public user: any;
  public message: string;
  public submitting: boolean;

  constructor(
    private _api: ApiService,
    private _token: TokenStorage
  ) {
    //Extract user information from the token
    this.user = this._token.getScope();
  }

  save() {
    var userManager = this;
    //compare form to saved data
    var oldState = userManager._token.getScope();

    var newInfo: any = {};
    if (this.user.first_name !== oldState.first_name)  {
      console.log(oldState.first_name + ' vs ' + this.user.first_name);
      newInfo.first_name = this.user.first_name;
    }
    if (this.user.last_name !== oldState.last_name) {
      newInfo.last_name = this.user.last_name;
    }
    if (this.user.email !== oldState.email) {
      newInfo.email = this.user.email;
    }
    if (this.newPassword === this.passwordConfirm && this.newPassword) {
      newInfo.password = this.user.password;
    }

    if (!Object.keys(newInfo).length) {
      console.log('Nothing has changed');
    } else {
      userManager.submitting = true;
      console.log('Properties to change: ');
      newInfo.id = oldState.id;
      console.log(newInfo);
      let edit_user = userManager._api.edit_user(newInfo);
      edit_user.map(data => data.json())
        .subscribe(
          data => {
            console.log(data);
            userManager.message = 'Success! ' + data.message;
            //let jwt_renew = userManager._api.jwt_renew()
          },
          err => console.error(err),
          () => {
            console.log('Api Call Complete: Edit User');
            userManager.submitting = false;
          }
        );
    }
  }


}