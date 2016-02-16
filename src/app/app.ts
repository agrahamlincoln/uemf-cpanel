import {Component} from 'angular2/core';
import {Location, RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';

import '../style/app.scss';

//project imports
import { HomeComponent } from './components/home/home';
import { AuthComponent } from './components/auth/auth';
import { EditorComponent } from './components/editor/editor';
import { UserManager } from './components/userManager/userManager';
import { FileManager } from './components/fileManager/fileManager';

import { AuthService } from './services/auth/auth';
import { TokenService } from './services/token/token';
import { ApiService } from './services/api/api';


/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app', // <app></app>
    providers: [ ...FORM_PROVIDERS, AuthService, TokenService, ApiService],
    directives: [ ...ROUTER_DIRECTIVES, AuthComponent],
    pipes: [],
    styles: [require('./app.scss')],
    template: require('./app.html')
})
@RouteConfig([
  { path: '/',                component: HomeComponent,   name: 'Index' },
  { path: '/documents/:type', component: FileManager,     name: 'FileManager' },
  { path: '/editor/:name',    component: EditorComponent, name: 'PageEditor' },
  { path: '/editor',          component: EditorComponent, name: 'EditorSelect' },
  { path: '/users',           component: UserManager,     name: 'Users' }
])
export class App {
  public isLoggedIn = false;
  private _lastRoute: string;
  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _location: Location
  ) {
    var app = this;
    app._auth.isLoggedIn$.subscribe(loginStatus => {
      //console.log('isLoggedIn$ subscriber update: ' + loginStatus);
      app.isLoggedIn = loginStatus;
      if (!app.isLoggedIn) {
        //console.log('current location: ' + app._location.path());
        app._lastRoute = app._location.path();
        //console.log('User is NOT logged in, redirecting to home');
        app._router.navigate(['Index']);
      } else {
        console.log('User is logged in, redirecting to last route: ' + app._lastRoute);
        if (app._lastRoute) {
          app._router.navigateByUrl(app._lastRoute);
        }
      }
    });
  }
}
