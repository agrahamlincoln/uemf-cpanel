/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';
import {Auth} from './auth/auth';
import {Home} from './home/home';
import {DocumentManager} from './documentManager/documentManager';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [ ...FORM_PROVIDERS ],
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
      <a href="/"><li>&larr;</li></a>
      <a [routerLink]=" ['Index'] "><li>Index</li></a>
      <a [routerLink]=" ['DocumentManagement'] "><li>Document Management</li></a>
      <a [routerLink]=" ['Users'] "><li>Users</li></a>
      </ul>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>
  </div>
  `
})
@RouteConfig([
  { path: '/', component: Home, name: 'Index' },
  { path: '/documents', component: DocumentManager, name: 'DocumentManagement' },
  { path: '/users', component: Home, name: 'Users' }
])
export class App {
  constructor() {}
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 * or via chat on Gitter at https://gitter.im/AngularClass/angular2-webpack-starter
 */
