import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root', // Provided in the root injector
})
export class ContactUsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  submitContactForm(formData: any): Observable<any> {
    const url = `${this.apiUrl}/${"api"}/${"ContactUs"}`
    return this.http.post(url, formData, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 409) {
      // Conflict: Email already exists
      return throwError(() => new Error('This email is already registered. Please use another email.'));
    } 
    // else if (error.status === 0) {
    //   // Network error
    //   return throwError(() => new Error('Network error: Please check your internet connection.'));
    // } else {
    //   // Generic server error
    //   return throwError(() => new Error(`Server error (${error.status}): ${error.message}`));
    // }
    // } 
    else {
      // Generic server error
      return throwError(() => new Error('Something went wrong. Unable to send the request.'));
    }
  }
}