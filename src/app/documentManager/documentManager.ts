import {Component} from 'angular2/core';
import {TinyEditor} from '../shared/tiny-editor';
import {FileList} from '../file-list/file-list';

//For the protected route
import {isTokenExpired} from '../shared/tokenStorage.service';
import {CanActivate} from 'angular2/router';

@Component ({
  selector: 'document-management',
  directives: [TinyEditor, FileList],
  template: `
  <h1>Document Manager</h1>
  <file-list></file-list>
  <tiny-editor></tiny-editor>
  `,
  styles: []
})

//Protected route, user must be logged in
@CanActivate(() => isTokenExpired())

export class DocumentManager {

}
