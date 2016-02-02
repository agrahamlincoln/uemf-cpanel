import { Pipe, PipeTransform } from 'angular2/core';

@Pipe({name: 'filesize'})
export class FilesizePipe {
  transform(v, args) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (v === 0) return '0 Byte';
    var i = Math.floor(Math.log(v) / Math.log(1024));
    return (Math.round(v / Math.pow(1024, i) * 100)) / 100 + ' ' + sizes[i];
  }
}
