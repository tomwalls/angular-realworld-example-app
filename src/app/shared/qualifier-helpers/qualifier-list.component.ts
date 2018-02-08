import { Component, Input } from '@angular/core';

import { Qualifier, QualifierListConfig } from '../models';
import { QualifiersService } from '../services';

@Component({
  selector: 'app-qualifier-list',
  styleUrls: ['qualifier-list.component.css'],
  templateUrl: './qualifier-list.component.html'
})
export class QualifierListComponent {
  constructor (
    private qualifiersService: QualifiersService
  ) {}

  @Input() limit: number;
  @Input()
  set config(config: QualifierListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery();
    }
  }

  query: QualifierListConfig;
  results: Qualifier[];
  loading = false;
  currentPage = 1;
  totalPages: Array<number> = [1];
  columns: string[] = ["Date", "Time", "Course", "System", "Horse", "Status", "Result", "Return"];

  setPageTo(pageNumber) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    this.loading = true;
    this.results = [];

    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset =  (this.limit * (this.currentPage - 1));
    }

    this.qualifiersService.query(this.query)
    .subscribe(data => {
      this.loading = false;
      console.log(data)
      this.results = data.systemQualifiers;

      // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
      //this.totalPages = Array.from(new Array(Math.ceil(data.length / this.limit)), (val, index) => index + 1);
    });
  }
}
