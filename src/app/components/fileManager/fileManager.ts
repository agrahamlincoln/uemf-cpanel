//angular2 imports
import {Component} from 'angular2/core';
import {CanActivate} from 'angular2/router';

//project imports
import {FileListComponent} from '../fileList/fileList';
import {FileUploaderComponent} from '../fileUploader/fileUploader';
import {isTokenExpired} from '../../services/token/token';

@Component ({
  selector: 'file-manager',
  directives: [FileListComponent, FileUploaderComponent],
  template: `
  <h1>File Manager</h1>
  <file-list></file-list>
  <file-uploader></file-uploader>
  `,
  styles: [`
    file-list {
      display: block;
      padding-bottom: 1em;
    }
  `]
})

//Protected route, user must be logged in
@CanActivate(() => isTokenExpired('uemf-org-jwt'))

export class FileManager {

}
