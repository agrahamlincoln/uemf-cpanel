//Angular2 Imports
import { Component, Input } from 'angular2/core';

//Project Imports
import { File } from './file.interface';

@Component({
  selector: 'file-editor',
  template: `
  <div class="input-group">
    <label>File Name</label>
    <input type="text" value="{{fileData.name}}"/>
  </div>
  <button>Save Changes</button>
  <button (click)="cancel(fileData)" class="critical">Cancel</button>
  `,
  styles: [require('./file.css')]
})
export class FileEditor {
  constructor() {}
  @Input('data') fileData: any;

  cancel(file: File) {
    file.editing = false;
  }
}
