import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {WISHLIST_API_URI, CART_API_URI, CHECKOUT_API_URI, ACCESS_TOKEN_ID, SINGLE_CHECKOUT_API_URI} from '../../../assets/API/server-api';
import {reditectToStripe as _reditectToStripe } from '../utils/classmethod.util';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  token:any = '';

  constructor(private http: HttpClient) {

    this.token = localStorage.getItem(ACCESS_TOKEN_ID);

  }


  addWishList(data:any): Observable<any> {

    const data$ = JSON.stringify(data);
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.post(`${WISHLIST_API_URI}`, data$, { headers }).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  getWishlist(accessToken:string | null):any {

    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    });
    return this.http.get(`${WISHLIST_API_URI}`, { headers });

  }

  deleteWishlist(id:number):any {

    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http['delete'](`${WISHLIST_API_URI + id}/`, { headers }).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  // ==========================cart crud operations ==========================================


  addtoCart(data:any): Observable<any> {

    const data$ = JSON.stringify(data);

    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.post(`${CART_API_URI}`, data$, { headers }).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  getCart():any {

    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.get(`${CART_API_URI}`, { headers});

  }

  deleteCart(id:number):Observable<any> {

    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http['delete'](`${CART_API_URI + id}/`, { headers }).pipe(
      catchError((err) => throwError(() => err))
    );

  }

  updateCart(data:any, id:number): Observable<any> {

    const data$ = JSON.stringify(data);
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.patch(`${CART_API_URI + id}/`, data$, { headers }).pipe(
      catchError((err) => throwError(() => err))
    );

  }


  // CHECKOUT PRODUCT


  checkOut(data:any): Observable<any> {

    const data$ = JSON.stringify(data);
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });


    return this.http.post(`${CHECKOUT_API_URI}`, data$, { headers }).pipe(
      catchError((err) => {

        console.error(err);
        return throwError(err);

      })
    );

  }

  singleCheckOut(data:any): Observable<any> {


    const data$ = JSON.stringify(data);
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.post(`${SINGLE_CHECKOUT_API_URI}`, data$, { headers }).pipe(
      catchError((err) => {

        console.error(err);
        return throwError(err);

      })
    );

  }


  redirecttoCheckout = _reditectToStripe;

}
