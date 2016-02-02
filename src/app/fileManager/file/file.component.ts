//Angular2 Imports
import {Component, Input} from 'angular2/core';
import {DatePipe} from 'angular2/common';
import {RouterLink} from 'angular2/router';

//Project Imports
import {FilesizePipe} from '../filesize.pipe';
import {FileEditor} from './fileEditor.component';
import {File} from './file.interface';
import {ApiService} from '../../shared/api.service';

@Component({
  selector: 'file',
  template: require('./file.html'),
  styles: [require('./file.css')],
  pipes: [FilesizePipe],
  directives: [FileEditor, RouterLink]
})

export class FileComponent {
  constructor(
    private _api: ApiService
  ) { }
  @Input('data') file: any;

  edit(file: File) {
    if (this.fileType(file) === 'html') {

    }
    file.editing = true;
  }

  delete(file: File) {
    var fileComp = this;
    let deleteFile = fileComp._api.delete(file.path);
    deleteFile
      .map(res => res.json())
      .subscribe(
        data => {
          console.log(data);

        },
        err => console.error(err),
        () => console.log('API Call Complete: delete')
      );

  }

  fileType(file: File) {
    var name = file.name;
    return name.split('.').pop();
  }
}
