import { Component, Input, OnInit } from '@angular/core';

import { Qualifier,QualifierR, QualifierListConfig } from '../models';
import { QualifiersService, UserService } from '../services';
import {NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';
import { Summary } from '../index';


const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;


@Component({
  selector: 'app-qualifier-list',
  styleUrls: ['qualifier-list.component.css'],
  templateUrl: './qualifier-list.component.html'
})
export class QualifierListComponent {
  constructor (
    private qualifiersService: QualifiersService,
    private userService: UserService,
    private modalService: NgbModal,
    calendar: NgbCalendar
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 1);
  }

  @Input() limit: number;
  @Input()
  set config(config: QualifierListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery();
    }
  }
  closeResult: string;

  model;
  model2;

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  close(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  edited = false;
  query: QualifierListConfig;
  results: Qualifier[];
  summary: Summary;
  loading = false;
  currentPage = 1;
  totalPages: Array<number> = [1];
  columns: string[] = ["Date", "Time", "Course", "System", "Horse", "Status", "Result", "Return", "", ""];

  setPageTo(pageNumber) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    this.loading = true;
    this.results = [];
    this.summary = null;

    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset =  (this.limit * (this.currentPage - 1));
    }

    this.qualifiersService.query(this.query, this.fromDate, this.toDate)
    .subscribe(data => {
      this.loading = false;
      console.log(data)
      console.log(data.systemQualifiers)
      this.results = data.systemQualifiers;
      this.summary = data.qualifierSummary;;

      // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
      //this.totalPages = Array.from(new Array(Math.ceil(data.length / this.limit)), (val, index) => index + 1);
    },
    err => this.userService.purgeAuth());
    ;
  }

  ToggleRangePicker()
  {
    this.edited = !this.edited;
  }

  onDateChange(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.model = this.fromDate.day + "-" + this.fromDate.month + "-" + this.fromDate.year;
      console.log(this.model);
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.model2 = this.toDate.day + "-" + this.toDate.month + "-" + this.toDate.year;
      console.log(this.model2);
      this.ToggleRangePicker()
      this.runQuery()

    } else {
      this.toDate = null;
      this.fromDate = date;
      this.model = this.fromDate.day + "-" + this.fromDate.month + "-" + this.fromDate.year;
      console.log(this.model2);
    }
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

}
