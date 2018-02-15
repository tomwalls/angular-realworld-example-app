import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { distinctUntilChanged, map } from 'rxjs/operators';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor (
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {

    this.apiService.post('/auth')
      .subscribe(
        data => this.setAuth(data),
        err => this.purgeAuth());



    /* // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.apiService.post('/auth')
      .subscribe(
        data => this.setAuth(data),
        err => this.purgeAuth()
      );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    } */
  }

  setAuth(user: User) {

    /* // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.bearerToken, user.refreshToken);
    */
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }


  sessionToToken(user: User)
  {
      this.apiService.get('/session-to-token')
      .subscribe(
        data => this.jwtService.saveToken(user.bearerToken, user.refreshToken),
        err => this.purgeAuth()
      );

  }

  purgeAuth() {
    console.log("purgeAuth");
    // Remove JWT from locastorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  logout() {
    this.apiService.post('/auth/logout')
    .subscribe(
      data => this.purgeAuth());
  }

  attemptAuth(type, username, password): Observable<User> {
    const route = (type === 'login') ? '/auth/credentials' : '/register';
    //console.log(JSON.stringify(credentials));
    console.log(JSON.stringify(username));
    console.log(JSON.stringify(password));

    return this.apiService.post('' + route, {UserName: username, Password: password, AutoLogin: true })
      .pipe(map(
      data => {
        console.log(data);
        this.setAuth(data);
        return data;
      }
    ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService
    .put('/user', { user })
    .pipe(map(data => {
      // Update the currentUser observable
      this.currentUserSubject.next(data.user);
      return data.user;
    }));
  }

}
