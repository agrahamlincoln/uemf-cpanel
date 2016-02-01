//Angular2 Imports
import {Component, OnInit} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {RouteParams, RouterLink} from 'angular2/router';

//Project Imports
import {File} from './file.interface';
import {FileComponent} from './file.component';
import {ApiService} from '../shared/api.service';

@Component({
  selector: 'file-list',
  template: `
  <div id="filter">
    <button [routerLink]="['DocumentManagement', {type: 'documents'}]">Documents</button>
    <button [routerLink]="['DocumentManagement', {type: 'images'}]">Images</button>
    <button [routerLink]="['DocumentManagement', {type: 'pages'}]">Pages</button>
    <button [routerLink]="['DocumentManagement', {type: 'all'}]">All</button>
  </div>
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
      cursor: initial;
      margin: 0.5em 0;
      transition: all 0.25s;
      box-shadow: 0 3px 8px rgba(0,0,0,.4);
    }

    #filter {
      margin: 0.5em 1em 1em 1em;
      display: block;
      width: 100%;
    }
    #filter button {
      border: 0px;
      margin: 0 1.5em;
      min-width: 7em;
      height: 2em;
      font-size: 18px;
      cursor: pointer;
      color: #000;
      background: rgba(255,255,255,.85);
      box-shadow: 0 1px 3px rgba(0,0,0,.4);
    }
  `],
  directives: [FileComponent, NgClass, RouterLink]
})

export class FileListComponent {
  public files: Array<File>;

  constructor(
    private _api: ApiService,
    private params: RouteParams
  ) {}

  ngOnInit() {
    var fileList = this;
    var list = fileList._api.files(fileList.params.get('type'));
    list
      .map(res => res.json())
      .subscribe(
        data => {
          for (var file in data) {
            //Parse the date from UTC Seconds string to Date Object
            data[file].modified_date = Date.parse(data[file].modified_date);

            //Set the properties for front-end controls.
            data[file].active = false;  //Selects the file
            data[file].editing = false; //Opens editing view of the file
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
    if (!file.active) {
      fileList.files.forEach((file) => {
        //Reset the state of each file component
        file.editing = false;
        file.active = false;
      });
      file.active = true;
    }
  }
}
