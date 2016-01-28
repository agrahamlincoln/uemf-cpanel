import {Component, Input, Pipe, PipeTransform} from 'angular2/core';
import {DatePipe} from 'angular2/common';

@Pipe({name: 'filesize'})
class Filesize {
  transform(v, args) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (v === 0) return '0 Byte';
    var i = Math.floor(Math.log(v) / Math.log(1024));
    return (Math.round(v / Math.pow(1024, i)*100))/100 + ' ' + sizes[i];
  }
}

@Component({
  selector: 'file',
  template: `
  <div class="title">{{file.name}}</div>
  <div class="details" [hidden]="!file.active">
    <a href="{{file.path}}">{{file.path}}</a>
    <br>
    <span class="filesize">Size: {{file.size | filesize}}</span>
    <span class="modified">Last Modified: {{file.modified_date | date:'medium'}}</span>
    <div class="actions">
      <button>Rename</button>
      <button class="critical">Delete</button>
    </div>
  </div>
  `,
  styles: [require('./file.css')],
  pipes: [Filesize]
})

export class FileComponent {
  constructor() { }
  @Input('data') file: File;
}

export interface File {
  name: string;
  path: string;
  modified_date: Date;
  size: number;
  active: boolean;
}
