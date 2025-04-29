import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { OlympicService } from 'src/app/core/services/olympic.service';

@Injectable({ providedIn: 'root' })
export class CountryOlympicResolver implements Resolve<boolean> {
  constructor(private OlympicService: OlympicService) {}

  resolve(): Observable<boolean> {
    return this.OlympicService.loadInitialData().pipe(map(() => true));
  }
}
