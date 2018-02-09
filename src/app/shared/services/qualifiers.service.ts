import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { Qualifier, QualifierListConfig } from '../models';
import {NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class QualifiersService {
  constructor (
    private apiService: ApiService
  ) {}

  startDateFormated: Date;
  endDateFormated: Date;

  query(config: QualifierListConfig, startDate: NgbDateStruct, endDate: NgbDateStruct): Observable<{systemQualifiers: Qualifier[]}> {
    // Convert any filters over to Angular's URLSearchParams
    const params = {};

    this.startDateFormated = new Date(startDate.year+ "-" +startDate.month +"-"+startDate.day+" 00:00");
    this.endDateFormated = new Date(endDate.year+ "-" +endDate.month +"-"+endDate.day+" 23:59");

    console.log(startDate);
    console.log(endDate);

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
      '/qualifier/search', {StartDate: this.startDateFormated, EndDate: this.endDateFormated})
  }

  getAll( startDate: NgbDateStruct, endDate: NgbDateStruct): Observable<[Qualifier]> {

    this.startDateFormated = new Date(startDate.year+ "-" +startDate.month +"-"+startDate.day+" 00:00");
    this.endDateFormated = new Date(endDate.year+ "-" +endDate.month +"-"+endDate.day+" 23:59");

        return this.apiService.post('/qualifier/search', {StartDate: this.startDateFormated, EndDate: this.endDateFormated})
        .pipe(map(data => data));
  }



}
