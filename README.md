# OlympicGamesStarter

Cette application permet d'afficher des informations sur les pays participants aux Jeux Olympiques, ainsi que des graphiques relatifs à leurs performances. Elle est composée de deux pages principales : la page d'accueil et la page de détails d'un pays.

## Fonctionnalités

1. Page d'Accueil : Affiche un graphique circulaire avec le nombre de médailles gagnées par pays. En cliquant sur un secteur du graphique, l'utilisateur est redirigé vers la page de détails du pays correspondant.

2. Page de Détails : Affiche des informations détaillées sur un pays, y compris le nombre de médailles, d'athlètes, et de participations aux différents Jeux Olympiques. Un graphique linéaire montre le nombre de médailles remportées par le pays au fil des années.

## Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :

1. Node.js (version 16 ou supérieure)

2. NPM (Node Package Manager)

## Installation

1. Clonez ce repository

```
git clone https://github.com/GarciaaMarilia/projeto-02-master.git
```

2. Naviguez dans le répertoire du projet :

```
cd projeto-02-master
```

3. Installez les dépendances :

```
npm install
```

## Lancé l'application

Pour lancer l'application en mode développement, exécutez :

```
ng serve
```
Cela ouvrira l'application dans votre navigateur à l'adresse http://localhost:4200.

## Structure du projet

# Page d'Accueil (home.component.ts)

La page d'accueil affiche un graphique circulaire des médailles des pays. Lorsqu'un utilisateur clique sur un secteur du graphique, il est redirigé vers la page de détails de ce pays. Le graphique est généré à l'aide de ng2-charts et chart.js.

# Composants utilisés :

- CardComponent : Affiche des cartes d'information.

- TitleComponent : Affiche le titre de la page.

- BaseChartDirective : Utilisé pour le graphique.

# Page de Détails (details.component.ts)

La page de détails affiche des informations détaillées sur un pays spécifique, y compris le nombre total de médailles, d'athlètes, et de participations aux Jeux Olympiques. Un graphique linéaire montre l'évolution des médailles gagnées au fil des années.

# Composants utilisés :

- CardComponent : Affiche des cartes d'information.

- TitleComponent : Affiche le titre de la page.

# Service OlympicService

Le service OlympicService récupère les données des pays et des participations depuis une source locale.

# Dépendances

**chart.js** et **ng2-charts** sont utilisés pour la génération des graphiques.

**rxjs** est utilisé pour gérer les observables.

**@angular/core**, **@angular/router** et d'autres modules Angular pour la gestion des routes et des composants.

# Fichiers principaux

**home.component.ts** : Composant pour la page d'accueil.

**details.component.ts** : Composant pour la page de détails.

**olympic.service.ts** : Service pour récupérer les données des pays et participations.