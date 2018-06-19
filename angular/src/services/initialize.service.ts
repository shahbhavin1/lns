import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppConstant } from './constant';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class InitialService {

  constructor(private http: HttpClient) { }
  /* Uses http.get() to load data from a single API endpoint */
  initialize() {
    return this.http.get(AppConstant.baseUrl + '/api/InitialSetup');
  }
}
