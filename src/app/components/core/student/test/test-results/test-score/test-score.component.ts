import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexGrid,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ITestResults } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

export interface predictionChart {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  tooltip: ApexTooltip | any;
  legend: ApexLegend | any;
  grid: ApexGrid | any;
  fill: ApexFill | any;
  colors: string[] | any;
  stroke: any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
}

@Component({
  selector: 'app-test-results-score',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, IconModule],
  templateUrl: './test-score.component.html',
  styleUrl: './test-score.component.scss',
})
export class AppSalesPredictionComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  @Input({ required: true }) test: ITestResults;

  public predictionChart!: Partial<predictionChart> | any;

  constructor() {}

  ngOnInit(): void {
    const score = Number(this.test.score) || 0;
    const maxScore = Number(this.test.max_score) || 0;
    const percentage = maxScore ? ((score / maxScore) * 100).toFixed(2) : '0';

    this.predictionChart = {
      chart: {
        height: 120,
        type: 'radialBar',
        fontFamily: 'inherit',
        sparkline: {
          enabled: true,
        },
      },
      series: [percentage],
      colors: ['var(--mat-sys-primary)'],
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          track: {
            background: '#f2f4f8',
            startAngle: -135,
            endAngle: 135,
          },
          hollow: {
            size: '30%',
            background: 'transparent',
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: false,
            },
            total: {
              show: true,
              fontSize: '20px',
              color: '#000',
              label: `${score} / ${maxScore}`,
            },
          },
        },
      },
      grid: {
        padding: {
          top: 20,
        },
      },
      fill: {
        type: 'solid',
      },
      stroke: {
        lineCap: 'butt',
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
        theme: 'dark',
      },
      labels: ['Porcentaje de la nota'],
    };
  }
}
