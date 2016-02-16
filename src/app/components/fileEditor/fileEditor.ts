//Angular2 Imports
import { Component, Input } from 'angular2/core';

//Project Imports
import { File } from '../file/file';
import { ApiService } from '../../services/api/api';

@Component({
  selector: 'file-editor',
  template: `
  <div class="ucp-input-group">
    <label>File Name</label>
    <input type="text" [(ngModel)]="fileData.name"/>
  </div>
  <button class="ucp-btn" (click)="rename(fileData)"> Save Changes</button>
  <button class="ucp-btn ucp-critical" (click)="cancel(fileData)">Cancel</button>
  <span>{{info}}</span>
  `,
  styles: [require('../file/file.scss')]
})
export class FileEditor {
  public info: string;

  constructor(
    private _api: ApiService
  ) {}
  @Input('data') fileData: any;

  cancel(file: File) {
    file.editing = false;
  }

  rename(file: File) {
    var editor = this;
    let rename = editor._api.rename(file.path, file.name);
    rename
      .map(res => res.json())
      .subscribe(
        data => {
          console.log(data);
          editor.info = 'Successful rename!';
          editor.cancel(file);
        },
        err => {
          try {
            var data = err.json();
            editor.info = 'Failed to rename: ' + data.message;
          } catch (Exception) {
            editor.info = 'Failed to rename the file.';
          }
        },
        () => {
          console.log('API Call Complete: rename ' + file.path + ' to ' + file.name);
        }
      );

  }
}
