//Angular2 Imports
import {Component, Input} from 'angular2/core';
import {DatePipe} from 'angular2/common';
import {RouterLink} from 'angular2/router';

//Project Imports
import {FilesizePipe} from './filesize.pipe';
import {FileEditor} from './fileEditor.component';
import {File} from './file.interface';

@Component({
  selector: 'file',
  template: require('./file.html'),
  styles: [require('./file.css')],
  pipes: [FilesizePipe],
  directives: [FileEditor, RouterLink]
})

export class FileComponent {
  constructor() { }
  @Input('data') file: any;

  edit(file: File) {
    if (this.fileType(file) === 'html') {

    }
    file.editing = true;
  }

  fileType(file: File) {
    var name = file.name;
    return name.split('.').pop();
  }
}
