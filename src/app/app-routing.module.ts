import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { DetailsComponent } from './pages/details/details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryOlympicGuard } from './core/guards/country-olympic.guard';
import { CountryOlympicResolver } from './core/resolvers/country-olympic.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'country/:id',
    component: DetailsComponent,
    // Le 'resolve' permet de charger les données AVANT l'activation de la route.
    // Ici, on utilise OlympicResolver pour s'assurer que les données des pays
    // sont disponibles avant d'afficher le composant DetailsComponent.
    resolve: { data: CountryOlympicResolver },
    // Le 'canActivate' est un garde (guard) qui contrôle l'accès à la route.
    // Il permet ou bloque la navigation selon une logique définie (ex. : vérification de l'ID, authentification).
    canActivate: [CountryOlympicGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
