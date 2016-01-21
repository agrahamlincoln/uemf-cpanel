import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Http} from 'angular2/http';
import {Auth} from '../auth/auth';

@Component({
  // The selector is what angular internally uses
  // for document.querySelectorAll(selector) in our index.html
  // where, in this case, selector is the string 'app'
  selector: 'home',  // <home></home>
  // We need to tell Angular's compiler which custom pipes are in our template.
  pipes: [ ],
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, Auth ],
  // Our list of styles in our component. We may add more to compose many styles together
  styles: [ require('./home.css') ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: require('./home.html')
})
export class Home {
  constructor(public http: Http) {

  }
  public username: string;
  public password: string;
  public currentUser: string;

  getCurrentUser() {
    this.http.get('http://uemf.org/user/current')
      .map(res => res.text())
      .subscribe(
        data => this.currentUser = data,
        err => this.logError(err),
        () => console.log('Get User Current Complete.')
      );
  }

  login() {
    var credentials = {
      'email': this.username,
      'password': this.password
    };
    console.log(credentials);
    this.http.post('http://localhost:3001/api/v1/auth/login', JSON.stringify(credentials))
      .map(res => res.text())
      .subscribe(
        data => console.log(data),
        err => this.logError(err),
        () => console.log('Log in complete.')
      );
  }

  logError(err) {
    console.error('There was an error: ' + err);
    console.error(err);
  }
}
