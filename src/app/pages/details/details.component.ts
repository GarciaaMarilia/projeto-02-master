import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, of, Subject, takeUntil } from 'rxjs';

import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CardComponent } from 'src/app/components/card/card.component';
import { TitleComponent } from 'src/app/components/title/title.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [TitleComponent, CardComponent, BaseChartDirective],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  public olympics$: Observable<OlympicCountry[]> = of([]);

  countryId!: number;
  countryName!: string;
  numberOfMedals!: number;
  numberOfAthletes!: number;
  numberOfParticipations!: number;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  private destroy$ = new Subject<void>();

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

    /* J’utilise subscribe() ici pour traiter les données, sinon l’async pipe (HTML) aurait été préférable */
    this.olympics$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data) {
        const country = data.find(
          (country: OlympicCountry) => country.id === this.countryId
        );

        this.countryName = country?.country ?? '';
        const participations = country?.participations ?? [];

        this.numberOfParticipations = participations.length;

        this.numberOfMedals = this.getNumberOfMedals(participations);

        this.numberOfAthletes = this.getNumberOfAthletes(participations);

        const labels = this.getLabels(participations);

        const graphData = this.getGraphData(participations);

        new Chart('medalsChart', {
          type: 'line',
          data: this.getDataChart(labels, graphData),
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        this.chart?.update();
      }
    });

    if (this.chart?.chart) {
      this.chart.chart.destroy();
    }
    this.chart?.update();
  }

  ngOnDestroy() {
    if (this.chart?.chart) {
      this.chart.chart.destroy();
    }
  }

  getNumberOfMedals(participations: Participation[]) {
    return participations.reduce(
      (acc: number, participationList: Participation) => {
        return acc + participationList.medalsCount;
      },
      0
    );
  }

  getNumberOfAthletes(participations: Participation[]) {
    return participations.reduce(
      (acc: number, participationList: Participation) => {
        return acc + participationList.athleteCount;
      },
      0
    );
  }

  getLabels(participations: Participation[]) {
    return participations.map(
      (participation: Participation) => participation.year
    );
  }

  getGraphData(participations: Participation[]) {
    return participations.map(
      (participation: Participation) => participation.medalsCount
    );
  }

  getDataChart(labels: Number[], graphData: Number[]) {
    return {
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
    };
  }
}
