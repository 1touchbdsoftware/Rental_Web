import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { RoutesService } from './routes-services/routes.service';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  constructor(private routesService: RoutesService) {}

  private controllerName = "ContactUs";
  submitContactForm(formData: any): Observable<any> {
    const url = `/${this.controllerName}/${"SubmitContactUsForm"}`;
    return this.routesService.observable_post<any>(url, formData, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 409) {    
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
      return throwError(() => new Error('Something went wrong. Unable to send the request.'));
    }
  }
}