import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CATEGORY_API_URI, SUB_CATEGORY_API_URI, SUBSUB_CATEGORY_API_URI } from '../../../assets/API/server-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListProductService {

  constructor(private http: HttpClient) { }


  getDataofSubCategory(id: number):Observable<any> {


    return this.http.get<any>(`${SUB_CATEGORY_API_URI + id}/`);

  }

  getDataofSubSubCategory(id: number):Observable<any> {

    return this.http.get<any>(`${SUBSUB_CATEGORY_API_URI + id}/`);

  }

  getDataofMainCategory(id: number):Observable<any> {

    return this.http.get<any>(`${CATEGORY_API_URI + id}/`);

  }

}
