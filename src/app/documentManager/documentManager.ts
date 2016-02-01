//angular2 imports
import {Component} from 'angular2/core';
import {CanActivate} from 'angular2/router';

//project imports
import {FileListComponent} from '../file-list/fileList.component';
import {isTokenExpired} from '../shared/tokenStorage.service';

@Component ({
  selector: 'document-management',
  directives: [FileListComponent],
  template: `
  <h1>Document Manager</h1>
  <file-list></file-list>
  `,
  styles: []
})

//Protected route, user must be logged in
@CanActivate(() => isTokenExpired())

export class DocumentManager {

}
