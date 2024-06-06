import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, of, retry, throwError} from "rxjs";
import { catchError, map } from 'rxjs/operators';
import {Cars} from "../../models/cars";
import {Excluded_users} from "../../models/excluded_users";

@Injectable({
  providedIn: 'root'
})
export class ExcludedUsersService {
  baseUrl = "http://localhost:3000/excluded_users";
  handleError(error: HttpErrorResponse) {
    if(error.error instanceof ErrorEvent) {
      console.log(
        `An error occurred ${error.status}, body was: ${error.error}`
      );
    } else {
      console.log(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError(
      'Something happened with request, please try again later.'
    );
  }

  constructor( private http: HttpClient) { }
  getList(): Observable<Excluded_users[]> {
    return this.http
      .get<Excluded_users[]>(this.baseUrl)
      .pipe(retry(2), catchError(this.handleError));
  }
}
