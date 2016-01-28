import {Component, OnInit} from 'angular2/core';
declare var tinymce: any;

@Component({
  selector: 'tiny-editor',
  template: `<textarea class='tinymce'></textarea>`
})

export class TinyEditor implements OnInit {
  constructor() {}

  ngOnInit() {
    tinymce.init({selector: '.tinymce'});
  }
}
