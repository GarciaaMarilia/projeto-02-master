import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { OlympicCountry } from '../models/Olympic';
@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        console.error('Error to get data', error);
        this.olympics$.next([]);
        return of(null);
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
