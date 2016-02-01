//angular2 imports
import { Component, Input, OnInit } from 'angular2/core';

//project imports
import {ApiService} from '../shared/api.service.ts';
declare var tinymce: any;

@Component({
  selector: 'wysiwyg',
  template: `
    <div id="editor-content" class='tinymce' [innerHTML]="content"></div>
    <button (click)="save()">Save Changes</button>`,
  styles: [``]
})
export class Wysiwyg {
  public content: string;

  constructor(
    private _api: ApiService
  ) { }
  @Input('filename') filename: string;

  ngOnInit() {
    var w = this;
    let source = w._api.get('content/pages/' + w.filename);
    source
      .map(res => res.text())
      .subscribe(
        data => {
          console.log(data);
          w.content = data;
          console.log('Initialize TinyMCE');
          tinymce.init({
            selector: '.tinymce',
            plugins: 'image link code table',
            //menubar: 'insert',
            inline: true
          });
        },
        err => (console.error(err)),
        () => console.log('API Call Complete: get ' + w.filename)
      );
  }

  save() {
    var w = this;
    var newContent = document.getElementById('editor-content').innerHTML;
    if (newContent === w.content) {
      //Then the content has not changed
      console.log('You have not made any changes.');
    }

    let update = w._api.update('content/pages/' + w.filename, newContent);
    update
      .map(res => res.json())
      .subscribe(
        data => console.log(data),
        err => console.error(err),
        () => console.log('API Call Complete: update ' + w.filename)
      );
  }

}
