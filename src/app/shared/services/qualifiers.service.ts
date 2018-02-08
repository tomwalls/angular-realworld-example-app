import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { Qualifier, QualifierListConfig } from '../models';

@Injectable()
export class QualifiersService {
  constructor (
    private apiService: ApiService
  ) {}


  startDateDay = new Date().getDate();
  startDateMonth = new Date().getMonth()+1;
  startDateYear = new Date().getFullYear();
  endDateDay = new Date().getDate()+1;
  endDateMonth = new Date().getMonth()+1;
  endDateYear = new Date().getFullYear();
  startDate = new Date(this.startDateYear+ "-" +this.startDateMonth +"-"+this.startDateDay+" 00:00");
  endDate = new Date(this.endDateYear+ "-" +this.endDateMonth +"-"+this.endDateDay+" 00:00");

  query(config: QualifierListConfig): Observable<{systemQualifiers: Qualifier[]}> {
    // Convert any filters over to Angular's URLSearchParams
    const params = {};

    Object.keys(config.filters)
    .forEach((key) => {
      params[key] = config.filters[key];
    });

    /* return this.apiService
    .get(
      '/qualifiers' + ((config.type === 'feed') ? '/feed' : ''),
      new HttpParams(params)
    ); */

    return this.apiService
    .post(
      '/qualifier/search', {StartDate: this.startDate, EndDate: this.endDate})
  }

  getAll(): Observable<[Qualifier]> {
        return this.apiService.post('/qualifier/search', {StartDate: '2018-01-01', EndDate: '2018-02-03'})
        .pipe(map(data => data));
  }



}
