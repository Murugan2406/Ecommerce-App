import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CATEGORY_API_URI, SEARCH_API_URI} from '../../../assets/API/server-api';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private http: HttpClient) { }


  getCategory():Observable<any> {

    return this.http.get(`${CATEGORY_API_URI}`);

  }


  getSearchResult(value: any):Observable<any> {

    return this.http.get(`${SEARCH_API_URI}${value}`);

  }

}
