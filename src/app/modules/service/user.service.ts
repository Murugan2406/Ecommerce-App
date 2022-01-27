import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LOGIN_API_URI, GETUSER_API_URI, SIGNUP_API_URI, USERINFO_API_URI, ORDERS_API_URI, ACCESS_TOKEN_ID} from '../../../assets/API/server-api';

import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  token:any = '';

  constructor(private readonly http: HttpClient) {

    this.token = localStorage.getItem(ACCESS_TOKEN_ID);

  }

  login(data: any):Observable<any> {

    return this.http.post(`${LOGIN_API_URI}`, data).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  signUp(user: any):Observable<any> {

    return this.http.post(`${SIGNUP_API_URI}`, user).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  getUserData():any {

    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.get(`${GETUSER_API_URI}`, { headers }).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  saveContactInfo(data:any):any {

    const token = localStorage.getItem(ACCESS_TOKEN_ID);
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    return this.http.post(`${USERINFO_API_URI}`, data, { headers }).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  getOrders():any {

    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.get(`${ORDERS_API_URI}`, { headers }).pipe(
      catchError((err) => throwError(() => err))
    );

  }

}
