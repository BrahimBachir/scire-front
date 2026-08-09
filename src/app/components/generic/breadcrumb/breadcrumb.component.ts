import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, Data, RouterModule } from '@angular/router';
import { Observable, Subscription, of, switchMap } from 'rxjs';
import { CoreService } from 'src/app/services/core.service';
import { Store } from '@ngrx/store';
import { Breadcrumb, BreadcrumbService, BasicMetricsService } from 'src/app/services';
import { CommonModule } from '@angular/common';
import { ICourse, IExamReadiness } from 'src/app/common/models/interfaces';
import { AppState } from 'src/app/common/store/app.store';
import { selectChoosenCourse } from 'src/app/common/store/selectors/learning.selectors';
import { selectUserActivePlan } from 'src/app/common/store/selectors';
import { IconModule } from 'src/app/icon/icon.module';
import { Planes } from 'src/app/common/enums';

type ReadinessStatus = 'ok' | 'mid' | 'low' | 'none';

const READINESS_LABEL: Record<ReadinessStatus, string> = {
  ok: '¡Listo!',
  mid: 'Vas bien',
  low: 'Lejos',
  none: 'Sin datos',
};

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule, IconModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class AppBreadcrumbComponent implements OnInit, OnDestroy {
  course: ICourse | null = null;

  breadcrumbs$: Observable<Breadcrumb[]>;
  pageInfo: Data | any = Object.create(null);

  activePlan$ = this.store.select(selectUserActivePlan);
  readonly Planes = Planes;

  readiness: IExamReadiness[] = [];
  loadingReadiness = false;

  options = this.settings.getOptions();

  private sub = new Subscription();

  constructor(
    private settings: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private store: Store<AppState>,
    private bcService: BreadcrumbService,
    private metricsService: BasicMetricsService
  ) {
    this.breadcrumbs$ = this.bcService.breadcrumbs$;
    this.breadcrumbs$.subscribe((bcs) => (this.pageInfo = bcs[bcs.length - 1]));
  }

  ngOnInit(): void {
    this.sub.add(
      this.store
        .select(selectChoosenCourse)
        .pipe(
          switchMap((course) => {
            this.course = course;
            if (!course?.id) {
              this.readiness = [];
              return of(null);
            }
            this.loadingReadiness = true;
            return this.metricsService.getReadiness(course.id);
          })
        )
        .subscribe({
          next: (res) => {
            this.readiness = res ?? [];
            this.loadingReadiness = false;
          },
          error: () => {
            this.readiness = [];
            this.loadingReadiness = false;
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get readyCount(): number {
    return this.readiness.filter((r) => r.isReady).length;
  }

  get readinessStatus(): ReadinessStatus {
    if (!this.course?.id || this.loadingReadiness || !this.readiness.length) return 'none';
    if (this.readyCount === this.readiness.length) return 'ok';
    if (this.readyCount === 0) return 'low';
    return 'mid';
  }

  get readinessLabel(): string {
    return READINESS_LABEL[this.readinessStatus];
  }

  get readinessDetail(): string {
    if (!this.course?.id) return 'Selecciona un curso para ver tu preparación';
    if (this.loadingReadiness) return 'Calculando...';
    if (!this.readiness.length) return 'Todavía no hay datos de preparación';
    return `${this.readyCount} de ${this.readiness.length} pruebas superadas`;
  }

  goToPricing(): void {
    const baseRoleUrl = this.router.url.split('/')[1];
    this.router.navigate([`${baseRoleUrl}/pricing`]);
  }
}
