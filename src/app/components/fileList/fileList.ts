//Angular2 Imports
import {Component} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {RouteParams, RouterLink, Router} from 'angular2/router';

//File Interface & Component
import {File, FileComponent} from '../file/file';
import {Spinner} from '../spinner/spinner';
import {ApiService} from '../../services/api/api';

@Component({
  selector: 'file-list',
  template: require('./fileList.html'),
  styles: [require('./fileList.scss')],
  directives: [FileComponent, NgClass, RouterLink, Spinner]
})

export class FileListComponent {
  public files: Array<File>;
  public loading: boolean;
  public filter: string;

  constructor(
    private _api: ApiService,
    private params: RouteParams,
    private _router: Router
  ) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    var fileList = this;
    fileList.loading = true;
    fileList.filter = fileList.params.get('type');
    var list = fileList._api.files(fileList.filter);
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
        () => {
          console.log('API Call Complete: Files');
          fileList.loading = false;
        }
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
