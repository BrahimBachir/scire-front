import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { IBurnChart } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { AdvancedMetricsService } from 'src/app/services';

type BurnChartView = 'burndown' | 'burnup';

interface BurnApexChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  colors: string[];
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  grid: ApexGrid;
}

@Component({
  selector: 'app-burn-chart',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressBarModule,
    NgApexchartsModule,
  ],
  templateUrl: './burn-chart.component.html',
  styleUrl: './burn-chart.component.scss',
})
export class AppBurnChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  private service = inject(AdvancedMetricsService);
  private route = inject(ActivatedRoute);

  loading = false;
  error: string | null = null;

  courseId: number | null =
    Number(this.route.snapshot.paramMap.get('courseId')) || null;

  burnChart: IBurnChart | null = null;
  view: BurnChartView = 'burndown';

  chartData!: Partial<BurnApexChart>;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service
      .getBurnChart(this.courseId ?? 0)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.burnChart = data;
          this.buildChart();
        },
        error: (error) => console.error(error),
      });
  }

  setView(view: BurnChartView) {
    if (this.view === view) return;
    this.view = view;
    this.buildChart();
  }

  get onTrackStatus(): 'ok' | 'low' | null {
    if (this.burnChart?.onTrack == null) return null;
    return this.burnChart.onTrack ? 'ok' : 'low';
  }

  private buildChart() {
    if (!this.burnChart) return;
    const burnChart = this.burnChart;
    const categories = burnChart.points.map((p) => p.date);

    const series: ApexAxisChartSeries =
      this.view === 'burndown'
        ? [
            {
              name: 'Restante ideal',
              data: burnChart.points.map((p) => p.idealRemaining),
            },
            {
              name: 'Restante real',
              data: burnChart.points.map((p) => p.actualRemaining),
            },
          ]
        : [
            {
              name: 'Alcance total',
              data: burnChart.points.map(() => burnChart.totalScope),
            },
            {
              name: 'Completado',
              data: burnChart.points.map((p) => p.completedCumulative),
            },
          ];

    this.chartData = {
      series,
      chart: {
        type: 'area',
        height: 320,
        fontFamily: 'inherit',
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      xaxis: {
        categories,
        type: 'datetime',
        labels: { format: 'dd/MM' },
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        title: { text: 'Artículos' },
      },
      stroke: { curve: 'straight', width: [2, 3], dashArray: [6, 0] },
      dataLabels: { enabled: false },
      colors: this.view === 'burndown' ? ['#a1aab2', '#5D87FF'] : ['#a1aab2', '#2CD07E'],
      fill: { type: 'solid', opacity: [0, 0.15] },
      tooltip: { x: { format: 'dd/MM/yyyy' } },
      legend: { show: true, position: 'top' },
      grid: { strokeDashArray: 4 },
    };
  }
}
