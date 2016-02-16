//angular2 imports
import { Component, Input } from 'angular2/core';

//project imports
import { ApiService } from '../../services/api/api';
import { Spinner } from '../spinner/spinner';
declare var tinymce: any;

@Component({
  selector: 'wysiwyg',
  template: `
    <spinner *ngIf="loading"></spinner>
    <div id="editor-content" class='tinymce' [innerHTML]="content"></div>
    <button class="ucp-btn" (click)="save()">
      <span *ngIf="!saving">Save Changes</span>
      <spinner *ngIf="saving"></spinner>
    </button>
    <button class="ucp-btn ucp-critical" (click)="revert()">
      <span *ngIf="!reverting">Revert Changes</span>
      <spinner *ngIf="reverting"></spinner>
    </button>
  `,
  styles: [`
    button {
      width: 10em;
    }
    #editor-content {
      animation: fadein 0.5s ease-in;
    }

    @keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `],
  directives: [Spinner]
})
export class Wysiwyg {
  public content: string;
  public loading: boolean = false;
  public saving: boolean = false;
  public reverting: boolean = false;

  constructor(
    private _api: ApiService
  ) { }
  @Input('filename') filename: string;

  ngOnInit() {
    var w = this;
    w.loading = true;
    let source = w._api.get('content/pages/' + w.filename);
    source
      .map(res => res.text())
      .subscribe(
        data => {
          console.log(data);
          w.content = data;
          console.log('Initialize TinyMCE');
          tinymce.init({
            selector: '.tinymce',
            plugins: 'image link code table',
            //menubar: 'insert',
            inline: true
          });
        },
        err => (console.error(err)),
        () => {
          console.log('API Call Complete: get ' + w.filename);
          w.loading = false;
        }
      );
  }

  save() {
    var w = this;
    w.saving = true;
    var newContent = document.getElementById('editor-content').innerHTML;
    if (newContent === w.content) {
      //Then the content has not changed
      console.log('You have not made any changes.');
    }

    let update = w._api.update('content/pages/' + w.filename, newContent);
    update
      .map(res => res.json())
      .subscribe(
        data => console.log(data),
        err => console.error(err),
        () => {
          console.log('API Call Complete: update ' + w.filename);
          w.saving = false;
        }
      );
  }

  revert() {
    var w = this;
    w.reverting = true;
    document.getElementById('editor-content').innerHTML = w.content;
    w.reverting = false;
  }

}
