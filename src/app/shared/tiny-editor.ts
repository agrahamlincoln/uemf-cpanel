import {Component, Input, OnInit} from 'angular2/core';
declare var tinymce: any;

@Component({
  selector: 'tiny-editor',
  template: `<textarea class='tinymce'>{{content}}</textarea>`
})

export class TinyEditor implements OnInit {
  constructor() {}
  @Input() content: string;

  ngOnInit() {
    tinymce.init({selector: '.tinymce'});
  }
}
