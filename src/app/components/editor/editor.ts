//angular2 imports
import { Component } from 'angular2/core';
import { RouteParams, RouterLink } from 'angular2/router';

//project Imports
import { Wysiwyg } from '../wysiwyg/wysiwyg';

@Component({
  selector: 'editor',
  template: require('./editor.html'),
  styles: [],
  directives: [RouterLink, Wysiwyg]
})
export class EditorComponent {
  public pageName: string;
  public selected: boolean = false;
  constructor(
    private params: RouteParams
  ) {
    var editor = this;
    console.log(editor.params.get('name'));
    if (editor.params.get('name') !== null) {
      editor.pageName = editor.params.get('name');
      editor.selected = true;
    } else {
      editor.pageName = 'Select Page';
    }
  }
}
