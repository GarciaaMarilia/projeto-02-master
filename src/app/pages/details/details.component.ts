import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Chart } from 'chart.js';
import { Observable, of } from 'rxjs';

import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CardComponent } from 'src/app/components/card/card.component';
import { TitleComponent } from 'src/app/components/title/title.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [TitleComponent, CardComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[]> = of([]);

  countryId!: number;
  countryName!: string;
  numberOfMedals!: number;
  numberOfAthletes!: number;
  numberOfParticipations!: number;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private olympicService: OlympicService
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.countryId = Number(this.route.snapshot.paramMap.get('id'));
    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.subscribe((data) => {
      if (data) {
        const country = data.find(
          (country: OlympicCountry) => country.id === this.countryId
        );
        this.countryName = country?.country ?? '';
        const participations = country?.participations ?? [];

        this.numberOfParticipations = participations.length;

        this.numberOfMedals = participations.reduce(
          (acc: number, participationList: Participation) => {
            return acc + participationList.medalsCount;
          },
          0
        );

        this.numberOfAthletes = participations.reduce(
          (acc: number, participationList: Participation) => {
            return acc + participationList.athleteCount;
          },
          0
        );

        const labels = participations.map(
          (participation: Participation) => participation.year
        );
        const graphData = participations.map(
          (participation: Participation) => participation.medalsCount
        );

        new Chart('medalsChart', {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Number of medals',
                data: graphData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    });
  }
}
