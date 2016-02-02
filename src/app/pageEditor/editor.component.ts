//angular2 imports
import { Component } from 'angular2/core';
import { RouteParams, RouterLink } from 'angular2/router';

//project Imports
import { Wysiwyg } from './wysiwyg.component';

@Component({
  selector: 'editor',
  template: `
  <h1>{{pageName}}</h1>
  This is going to be a wysiwyg editor
  <div *ngIf="!selected">
    Select a Document to edit.
    <button [routerLink]="['PageEditor', {name: 'home.html'}]">Home</button>
    <button [routerLink]="['PageEditor', {name: 'about.html'}]">About</button>
    <button [routerLink]="['PageEditor', {name: 'resources.html'}]">Resources</button>
    <button [routerLink]="['PageEditor', {name: 'education.html'}]">Education</button>
    <button [routerLink]="['PageEditor', {name: 'careers.html'}]">Careers</button>
    <button [routerLink]="['PageEditor', {name: 'contact.html'}]">Contact</button>
  </div>
  <wysiwyg
    [filename]="pageName"
    *ngIf="pageName !== 'Select Page'"
  ></wysiwyg>
  `,
  styles: [`
    wysiwyg {

    }
  `],
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
