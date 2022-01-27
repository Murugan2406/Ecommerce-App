import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUCT_API_URI } from '../../../assets/API/server-api';

@Injectable({
  providedIn: 'root'
})
export class PreviewProductService {

  constructor(private http: HttpClient) { }


  getDataofSubSubCategory(id: number):Observable<any> {

    return this.http.get<any>(`${PRODUCT_API_URI + id}/`);

  }

}
