import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { OlympicService } from '../services/olympic.service';

@Injectable({
  providedIn: 'root',
})
export class CountryOlympicGuard implements CanActivate {
  constructor(private olympicService: OlympicService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.paramMap.get('id');

    // Le take(1) permet de ne prendre qu'une seule émission (le premier résultat) de l'observable,
    // puis de compléter automatiquement l'abonnement. Cela évite les fuites de mémoire
    // et garantit que le guard ne reste pas actif inutilement.

    return this.olympicService.getOlympics().pipe(
      filter((countries) => countries.length > 0),
      take(1),
      map((countries) => {
        const exists = countries.some(
          (country) => country.id.toString() === id
        );
        if (!exists) {
          this.router.navigate(['/not-found']);
          return false;
        }
        return true;
      })
    );
  }
}
