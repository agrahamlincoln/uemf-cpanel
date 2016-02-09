//angular2 imports
import {Component} from 'angular2/core';
import {CanActivate} from 'angular2/router';

//project imports
import {FileListComponent} from './fileList/fileList.component';
import {isTokenExpired} from '../shared/tokenStorage.service';

@Component ({
  selector: 'file-manager',
  directives: [FileListComponent],
  template: `
  <h1>File Manager</h1>
  <file-list></file-list>
  `,
  styles: []
})

//Protected route, user must be logged in
@CanActivate(() => isTokenExpired())

export class FileManager {

}
