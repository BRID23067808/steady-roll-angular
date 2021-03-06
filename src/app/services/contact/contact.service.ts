import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { throwError, Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Contact } from './contact';

import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = environment.production ? '/api/contacts/' : 'http://localhost:3000/api/contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

    constructor(private httpClient: HttpClient) { }

    getAll(): Observable<Contact[]> {
      const url = apiUrl;
      return this.httpClient.get<Contact[]>(url)
      .pipe(
        catchError(this.handleError('getAll', []))
      );
    }

    addContact(contact: Contact): Observable<Contact> {
      return this.httpClient.post<Contact>(apiUrl, contact, httpOptions).pipe(
        tap((a: Contact) => console.log(`added contact w/ id=${a._id}`)),
        catchError(this.handleError<Contact>('addContact'))
      );
    }

    updateContact(id: string, contact: Contact): Observable<any> {
      const url = `${apiUrl}/${id}`;
      return this.httpClient.put(url, contact, httpOptions).pipe(
        tap(_ => console.log(`updated contact id=${id}`)),
        catchError(this.handleError<any>('updateContact'))
      );
    }

    getContactById(id: string): Observable<Contact> {
      const url = `${apiUrl}/${id}`;
      return this.httpClient.get<Contact>(url);
    }

    markAsReadContact(id: string): Observable<any> {
      const url = `${apiUrl}/${id}/mark-as-read`;
      return this.httpClient.put(url, httpOptions).pipe(
        tap(_ => console.log(`updated contact as read id=${id}`)),
        catchError(this.handleError<any>('markAsReadContact'))
      );
    }

    deleteContact(id: string): Observable<Contact> {
      const url = `${apiUrl}/${id}`;
      return this.httpClient.delete<Contact>(url, httpOptions).pipe(
        tap(_ => console.log(`deleted contact id=${id}`)),
        catchError(this.handleError<Contact>('deleteContact'))
      );
    }

    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
      };
    }

}
