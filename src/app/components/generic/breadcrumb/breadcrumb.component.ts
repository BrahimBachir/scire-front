import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  Data,
  RouterModule,
} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { CoreService } from 'src/app/services/core.service';

import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { Store } from '@ngrx/store';
import { Breadcrumb, BreadcrumbService } from 'src/app/services';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ICourse } from 'src/app/common/models/interfaces';
import { AppState } from 'src/app/common/store/app.store';

export interface breadcrumbOption {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, NgApexchartsModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: [],
})
export class AppBreadcrumbComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  course: ICourse | null;

  breadcrumbs$: Observable<Breadcrumb[]>;
  
  public breadcrumbOption!: Partial<breadcrumbOption> | any;
  public breadcrumb2Option!: Partial<breadcrumbOption> | any;

  // @Input() layout;
  pageInfo: Data | any = Object.create(null);

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private store: Store<AppState>,
    private bcService: BreadcrumbService
  ) {
    this.breadcrumbs$ = this.bcService.breadcrumbs$;
    this.breadcrumbs$.subscribe(bcs => this.pageInfo = bcs[bcs.length-1])
    this.breadcrumbOption = {
      series: [
        {
          name: '',
          data: [5, 8, 7, 12, 6, 7, 15, 20],
        },
      ],
      chart: {
        type: 'bar',
        width: 70,
        height: 40,
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: 'var(--mat-sys-primary)',
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 2,
          columnWidth: '50%',
          barHeight: '100%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 0,
        colors: ['transparent'],
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      axisBorder: {
        show: false,
      },
      fill: {
        colors: ['var(--mat-sys-primary)'],
        opacity: 1,
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontFamily: 'inherit',
        },
        x: {
          show: false,
        },
        y: {
          formatter: undefined,
        },
      },
    };

    this.breadcrumb2Option = {
      series: [
        {
          name: '',
          data: [5, 8, 7, 12, 6, 7, 15, 20],
        },
      ],
      chart: {
        type: 'bar',
        width: 70,
        height: 40,
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: 'var(--mat-sys-secondary)',
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 2,
          columnWidth: '50%',
          barHeight: '100%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 0,
        colors: ['transparent'],
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      axisBorder: {
        show: false,
      },
      fill: {
        colors: ['var(--mat-sys-secondary)'],
        opacity: 1,
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontFamily: 'inherit',
        },
        x: {
          show: false,
        },
        y: {
          formatter: undefined,
        },
      },
    };

    // for breadcrumb
/*     this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.route))
      .pipe(
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(filter((route) => route.outlet === 'primary'))
      .pipe(mergeMap((route) => route.data))
      // tslint:disable-next-line - Disables all
      .subscribe((event) => {
        // tslint:disable-next-line - Disables all
        this.titleService.setTitle(event['title'] + ' - Angular 20');
        this.pageInfo = event;
      }); */
  }

  ngOnInit(): void {
    /* this.store.select(selectChoosenCourse).subscribe({
      next: (course) => {
        this.course = course
        //this.setRouteTitle();
      }
    }) */
  }
  
  setRouteTitle(){
    /* this.route.data.subscribe(data => {
      console.log(data['urls'])
    });
    const currentRoute = this.route.snapshot.data;
    console.log ("Esto no ",this.route.snapshot.data['urls'])
    if (currentRoute && currentRoute['urls'] && Array.isArray(currentRoute['urls'])) {
      this.route.snapshot.data['urls'][this.route.snapshot.data['urls'].length - 1].title = this.course?.description;
      console.log ("Esto no ",this.route.snapshot.data['urls'][this.route.snapshot.data['urls'].length - 1])
    }   */  
  }
}
