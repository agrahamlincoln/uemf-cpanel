//Angular2 Imports
import {Component, Input} from 'angular2/core';
import {RouterLink} from 'angular2/router';

//Project Imports
import {FilesizePipe} from '../../pipes/filesize/filesize';
import {FileEditor} from '../fileEditor/fileEditor';
import {ApiService} from '../../services/api/api';

export interface File {
  name: string;
  path: string;
  modified_date: Date;
  size: number;
  active: boolean;
  editing: boolean;
}

@Component({
  selector: 'file',
  template: require('./file.html'),
  styles: [require('./file.scss')],
  pipes: [FilesizePipe],
  directives: [FileEditor, RouterLink]
})

export class FileComponent {
  constructor(
    private _api: ApiService
  ) { }
  @Input('data') file: any;

  edit(file: File) {
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
