import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {OFFER_SALES_API_URI, NEW_ARRIVALS_API_URI, BOTTOMPRODUCTS_API_URI } from '../../../assets/API/server-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }


  getOfferSales():Observable<any> {

    return this.http.get(`${OFFER_SALES_API_URI}`);

  }

  getNewArrivals():Observable<any> {

    return this.http.get(`${NEW_ARRIVALS_API_URI}`);

  }

  getBottomProducts():Observable<any> {

    return this.http.get(`${BOTTOMPRODUCTS_API_URI}`);

  }

}
