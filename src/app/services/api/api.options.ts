import {Injectable} from 'angular2/core';

@Injectable()
export class ApiOptions {
  baseUrl: string;
  jwtName: string;

  constructor(options: Object) {
    Object.assign(this, options);
  }
}
