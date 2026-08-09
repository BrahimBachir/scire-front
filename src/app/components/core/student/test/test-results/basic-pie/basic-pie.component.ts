import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { IBasicDataItem } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

export interface BasicChart {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  tooltip: ApexTooltip | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  stroke: any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
}

@Component({
  selector: 'app-test-results-basic-pie',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, IconModule],
  templateUrl: './basic-pie.component.html',
})
export class AppTestResultsBasicPieComponent implements OnInit{
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  @Input({ required: true }) data_items: IBasicDataItem[];

  public basicChart!: Partial<BasicChart> | any;

  constructor() {
  }

  ngOnInit(): void {
    const series: number[] = [];
    const labels: string[] = [];
    const colors: string[] = [];

    this.data_items.forEach((element: IBasicDataItem) => {
      if (element.code !== 'TQ') {
        series.push(Number(element.title));
        labels.push(element.subtitle)
        colors.push(element.char_color)
      }
    });

    this.basicChart = {
      series: series,
      labels: labels,
      chart: {
        type: 'donut',
        height: 215,
        fontFamily: 'inherit',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
          donut: {
            size: '83',
            labels: {
              show: true,
              name: {
                show: true,
                offsetY: 7,
              },
              value: {
                show: true,
              },
              total: {
                show: true,
                color: '#a1aab2',
                fontSize: '13px',
                label: 'Preguntas',
              },
            },
          },
        },
      },
      colors: colors,
      tooltip: {
        show: true,
        fillSeriesColor: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 1025,
          options: {
            chart: {
              height: 270,
            },
          },
        },
        {
          breakpoint: 426,
          options: {
            chart: {
              height: 250,
            },
          },
        },
      ],
    };
  }
}
