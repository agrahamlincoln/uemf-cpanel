/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {Location, RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';
import {Home} from './home/home';
import {DocumentManager} from './documentManager/documentManager';

import {Auth} from './auth/auth';
import {AuthService} from './auth/auth.service';
import {TokenStorage} from './shared/tokenStorage.service';
import {ApiService} from './shared/api.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [ ...FORM_PROVIDERS, AuthService, TokenStorage, ApiService],
  directives: [ ...ROUTER_DIRECTIVES, Auth],
  pipes: [],
  styles: [ require('./app.css') ],
  template: `
  <div id="gradient"><div>
  <div id="wrapper">
    <auth></auth>
    <header>
      <h1>UEMF Control Panel</h1>
    </header>
    <nav>
      <ul id="nav">
      <button href="/"><li>&larr;</li></button>
      <button [routerLink]=" ['Index'] "><li>Index</li></button>
      <button [disabled]="!isLoggedIn" [routerLink]=" ['DocumentManagement'] ">
        <li>Document Management</li>
      </button>
      <button [disabled]="!isLoggedIn" [routerLink]=" ['Users'] ">
        <li>Users</li>
      </button>
      </ul>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>
  </div>
  `
})
@RouteConfig([
  { path: '/',          component: Home,            name: 'Index' },
  { path: '/documents', component: DocumentManager, name: 'DocumentManagement' },
  { path: '/users',     component: Home,            name: 'Users' }
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
        if (app._lastRoute)
          app._router.navigateByUrl(app._lastRoute);
      }
    });
  }
}
