//angular2 Imports
import { Component } from 'angular2/core';

@Component({
  selector: 'spinner',
  template: `<div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>`,
  styles: [require('./spinner.scss')]
})
export class Spinner {}
