import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";
import {Cars} from "../../models/cars";


@Injectable({
  providedIn: 'root'
})
export class CarsService {
  baseUrl = "http://localhost:3000/cars";

  constructor( private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

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

  getList(): Observable<Cars[]> {
    return this.http
      .get<Cars[]>(this.baseUrl)
      .pipe(retry(2), catchError(this.handleError));
  }


}
