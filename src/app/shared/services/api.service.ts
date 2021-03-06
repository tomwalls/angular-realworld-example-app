import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { JwtService } from './jwt.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { Options } from 'selenium-webdriver/ie';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {}


  headersConfig = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  private formatErrors(error: any) {

    console.log(error.status);
    return new ErrorObservable(error.json());
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { params , headers:this.headersConfig})
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body), {headers:this.headersConfig}
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {

    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body), {headers:this.headersConfig}
    ).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`, {headers:this.headersConfig}
    ).pipe(catchError(this.formatErrors));
  }
}
