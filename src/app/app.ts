//angular2 imports
import {Component, ViewEncapsulation} from 'angular2/core';
import {Location, RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';

//project imports
import { HomeComponent } from './home/home.component';
import { FileManager } from './fileManager/fileManager.component';

import { AuthComponent } from './auth/auth.component';
import { AuthService } from './auth/auth.service';
import { TokenStorage } from './shared/tokenStorage.service';
import { ApiService } from './shared/api.service';

import { EditorComponent } from './pageEditor/editor.component';

import { UserManager } from './userManager/userManager.component';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [ ...FORM_PROVIDERS, AuthService, TokenStorage, ApiService],
  directives: [ ...ROUTER_DIRECTIVES, AuthComponent],
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
      <button [disabled]="!isLoggedIn" [routerLink]=" ['FileManager', {type: 'pages'}] ">
        <li>File Management</li>
      </button>
      <button [disabled]="!isLoggedIn" [routerLink]=" ['EditorSelect'] ">
        <li>Page Editor</li>
      </button>
      <button [disabled]="!isLoggedIn" [routerLink]=" ['Users'] ">
        <li>User Management</li>
      </button>
      </ul>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>
  </div>
  `,
  encapsulation: ViewEncapsulation.None //Makes all styles in this global
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
        if (app._lastRoute)
          app._router.navigateByUrl(app._lastRoute);
      }
    });
  }
}
