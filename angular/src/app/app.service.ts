import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AppService {

  constructor(private http: HttpClient) { }
  /* Uses http.get() to load data from a single API endpoint */
  getAuthors() {
    return this.http.get('http://52.91.61.190:3000/api/InitialSetup');
  }
}
