import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, of, Subject, takeUntil } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

import { graphColors } from 'src/utils/colors';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { CardComponent } from 'src/app/components/card/card.component';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { TitleComponent } from 'src/app/components/title/title.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, TitleComponent, BaseChartDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<OlympicCountry[] | null> = of(null);

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(private router: Router, private olympicService: OlympicService) {}

  countryIds: number[] = [];
  numberOfJos: number = 0;
  numberOfCountries: number = 0;

  public pieChartType: ChartType = 'pie';
  private destroy$ = new Subject<void>();

  onChartClick(event: any): void {
    const activePoints = event.active;

    if (activePoints.length > 0) {
      const chartElement = activePoints[0];
      const countryIndex = chartElement.index;

      const countryId = this.countryIds[countryIndex];

      if (countryId) {
        this.router.navigate(['/country', countryId]);
      }
    }
  }

  /* J’utilise subscribe() ici pour traiter les données, sinon l’async pipe aurait été préférable */
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data) {
        const labels = this.getLabels(data);
        const jos = this.getParticipations(data);

        this.numberOfJos = Array.from(jos).length;
        this.numberOfCountries = labels.length;

        const ids = this.getIds(data);
        this.countryIds = ids;

        const medals = this.getMedals(data);

        this.pieChartData = {
          labels: labels,
          datasets: [
            {
              data: medals,
              backgroundColor: graphColors,
            },
          ],
        };
      }
    });
  }

  ngOnDestroy() {
    if (this.chart?.chart) {
      this.chart.chart.destroy();
    }
  }

  getLabels(data: OlympicCountry[]) {
    const labels = data.map((country: OlympicCountry) => country.country);
    return labels;
  }

  getParticipations(data: OlympicCountry[]) {
    const jos = new Set();

    data.map((country: OlympicCountry) =>
      country.participations.map((participation: Participation) => {
        jos.add(participation.year);
      })
    );

    return jos;
  }

  getIds(data: OlympicCountry[]) {
    const ids = data.map((country: OlympicCountry) => country.id);
    return ids;
  }

  getMedals(data: OlympicCountry[]) {
    const medals = data.map((country: OlympicCountry) => {
      return country.participations.reduce(
        (sum: number, participation: Participation) =>
          sum + participation.medalsCount,
        0
      );
    });

    return medals;
  }
}
