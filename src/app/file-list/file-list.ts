import {Component, OnInit} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {File, FileComponent} from './file';
import {ApiService} from '../shared/api.service';

@Component({
  selector: 'file-list',
  template: `
  <div *ngFor="#file of files">
    <file (click)="selectFile(file)" [ngClass]="{active: file.active}" [data]="file"></file>
  </div>
  `,
  styles: [`
    file {
      display: block;
      cursor: pointer;
      background: rgba(255,255,255,.3);
      box-shadow: 0 1px 0.5px rgba(0,0,0,.4);
      border-bottom: 1px solid rgba(255,255,255,.4);
      transition: all 0.25s;
      padding: 0.5em 1em 0.5em 1em;
    }

    .active {
      margin: 0.5em 0;
      transition: all 0.25s;
      box-shadow: 0 3px 8px rgba(0,0,0,.4);
    }
  `],
  directives: [FileComponent, NgClass]
})

export class FileList {
  public files: Array<File>;

  constructor(
    private _api: ApiService
  ) {}

  ngOnInit() {
    var fileList = this;
    var list = fileList._api.files();
    list
      .map(res => res.json())
      .subscribe(
        data => {
          for (var file in data) {
            data[file].modified_date = Date.parse(data[file].modified_date);
            data[file].active = false;
          }
          fileList.files = data;
        },
        err => {
          console.error(err);
        },
        () => console.log('API Call Complete: Files')
      );
  }

  selectFile(file: File) {
    var fileList = this;
    fileList.files.forEach((file) => {
      file.active = false;
    });
    file.active = true;
  }
}
