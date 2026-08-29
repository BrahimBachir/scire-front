import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT, NgSwitch } from '@angular/common';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarFormDialogComponent } from './calendar-form-dialog/calendar-form-dialog.component';
import {
  startOfDay,
  endOfDay,
  isSameDay,
  isSameMonth,
  subMonths,
  addMonths,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarModule,
  CalendarView,
} from 'angular-calendar';
import { MaterialModule } from 'src/app/material.module';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IconModule } from 'src/app/icon/icon.module';
import { StudyPlanService } from 'src/app/services';
import {
  ICourseStudySchedule,
  IScheduleEventStatus,
  ITest,
} from 'src/app/common/models/interfaces';
import { TestDialogComponent } from '../student/test/test-dialog/test-dialog.component';

const STATUS_LABELS: Record<IScheduleEventStatus, string> = {
  completed: 'Completado',
  missed: 'No completado',
  today: 'Hoy',
  pending: 'Pendiente',
};

const colors: any = {
  red: {
    primary: '#fa896b',
    secondary: '#fdede8',
  },
  blue: {
    primary: '#5d87ff',
    secondary: '#ecf2ff',
  },
  yellow: {
    primary: '#ffae1f',
    secondary: '#fef5e5',
  },
  green: {
    primary: '#13deb9',
    secondary: '#e6fffa',
  },
  purple: {
    primary: '#763ebd',
    secondary: '#f2e7fe',
  },
};

const TEST_COLOR = colors.red;
const TOPIC_COLORS = [colors.blue, colors.green, colors.purple, colors.yellow];

@Component({
    selector: 'app-calendar-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatNativeDateModule,
        MatDialogModule,
        MatDatepickerModule,
        IconModule
    ],
    providers: [provideNativeDateAdapter()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarDialogComponent {
  options!: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dialog: MatDialog
  ) {}

  statusLabel(status: IScheduleEventStatus | undefined): string {
    return status ? STATUS_LABELS[status] : '';
  }

  goToTopic(): void {
    const courseId = this.data?.event?.meta?.courseId;
    const topicId = this.data?.event?.meta?.topicId;
    if (!courseId || !topicId) return;
    this.dialogRef.close();
    this.router.navigate([`student/courses/${courseId}/topic/${topicId}/content`]);
  }

  viewTestResult(): void {
    const courseId = this.data?.event?.meta?.courseId;
    const testId = this.data?.event?.meta?.testId;
    if (!courseId || !testId) return;
    this.dialogRef.close();
    this.router.navigate([`student/courses/${courseId}/tests/${testId}/results`]);
  }

  createTopicTest(): void {
    const courseId = this.data?.event?.meta?.courseId;
    const topicId = this.data?.event?.meta?.topicId;
    if (!courseId || !topicId) return;
    this.dialogRef.close();

    const testDialogRef = this.dialog.open(TestDialogComponent, {
      data: {
        courseId,
        mode: 'CREATING',
        element: { topicsIds: [topicId] },
      } as any,
      autoFocus: false,
    });

    testDialogRef.afterClosed().subscribe((result: ITest) => {
      if (!result?.id) return;
      this.router.navigate([`student/courses/${courseId}/tests/${result.id}/simulator`]);
    });
  }
}

@Component({
    selector: 'app-fullcalendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './fullcalendar.component.html',
    styleUrl: './fullcalendar.component.scss',
    imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgSwitch,
        CalendarModule,
        CommonModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
    ],
    providers: [provideNativeDateAdapter(), CalendarDateFormatter]
})
export class AppFullcalendarComponent implements OnInit {
  dialogRef = signal<MatDialogRef<CalendarDialogComponent> | any>(null);
  dialogRef2 = signal<MatDialogRef<CalendarFormDialogComponent> | any>(null);
  lastCloseResult = signal<string>('');
  actionsAlignment = signal<string>('');
  view = signal<any>('month');
  viewDate = signal<Date>(new Date());
  activeDayIsOpen = signal<boolean>(true);

  courseId = 0;
  loading = signal<boolean>(false);
  noExamDate = signal<boolean>(false);
  examDate = signal<Date | null>(null);
  articlesPerDayAvg = signal<number>(0);
  insufficientTime = signal<boolean>(false);
  shortfallDays = signal<number>(0);

  config: MatDialogConfig = {
    disableClose: false,
    width: '',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
    data: {
      action: '',
      event: [],
    },
  };
  numTemplateOpens = 0;

  actions: CalendarEventAction[] = [
    {
      label: '<span class="text-white link m-l-5">: Edit</span>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edit', event);
      },
    },
    {
      label: '<span class="text-danger m-l-5">Delete</span>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events.set(
          this.events().filter((iEvent: CalendarEvent<any>) => iEvent !== event)
        );
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events = signal<CalendarEvent[] | any>([]);

  constructor(
    public dialog: MatDialog,
    @Inject(DOCUMENT) doc: any,
    private route: ActivatedRoute,
    private studyPlanService: StudyPlanService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId')) || 0;
    if (!this.courseId) return;
    this.loadSchedule();
  }

  private loadSchedule(): void {
    this.loading.set(true);

    this.studyPlanService.getSchedule(this.courseId).subscribe({
      next: (schedule) => {
        this.loading.set(false);

        if (schedule.noExamDate) {
          this.noExamDate.set(true);
          this.events.set([]);
          return;
        }

        this.noExamDate.set(false);
        this.applySchedule(schedule);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private applySchedule(schedule: ICourseStudySchedule): void {
    this.examDate.set(schedule.examDate);
    this.articlesPerDayAvg.set(schedule.articlesPerDayAvg);
    this.insufficientTime.set(schedule.insufficientTime);
    this.shortfallDays.set(schedule.shortfallDays);
    this.events.set(this.mapScheduleToCalendarEvents(schedule));
  }

  private mapScheduleToCalendarEvents(schedule: ICourseStudySchedule): any[] {
    const articleDayBuckets = new Map<
      string,
      {
        topicId: number;
        topicName: string;
        date: Date;
        articles: { id: number; title: string; status: IScheduleEventStatus }[];
      }
    >();
    const result: any[] = [];

    for (const evt of schedule.events) {
      if (evt.type === 'topicTest') {
        result.push({
          start: startOfDay(evt.date),
          end: endOfDay(evt.date),
          title: `Examen: ${evt.topicName}`,
          color: TEST_COLOR,
          cssClass: `sp-event sp-${evt.status}`,
          allDay: true,
          draggable: false,
          resizable: { beforeStart: false, afterEnd: false },
          meta: {
            readonly: true,
            kind: 'test',
            topicId: evt.topicId,
            topicName: evt.topicName,
            courseId: this.courseId,
            status: evt.status,
            testId: evt.testId,
          },
        });
        continue;
      }

      const key = `${evt.topicId}_${evt.date.toDateString()}`;
      let bucket = articleDayBuckets.get(key);
      if (!bucket) {
        bucket = {
          topicId: evt.topicId,
          topicName: evt.topicName,
          date: evt.date,
          articles: [],
        };
        articleDayBuckets.set(key, bucket);
      }
      bucket.articles.push({ id: evt.articleId, title: evt.articleTitle, status: evt.status });
    }

    for (const bucket of articleDayBuckets.values()) {
      const articleCount = bucket.articles.length;
      const bucketStatus = this.bucketStatus(bucket.articles.map((a) => a.status));
      result.push({
        start: startOfDay(bucket.date),
        end: endOfDay(bucket.date),
        title: `${bucket.topicName} · ${articleCount} artículo${articleCount > 1 ? 's' : ''}`,
        color: TOPIC_COLORS[bucket.topicId % TOPIC_COLORS.length],
        cssClass: `sp-event sp-${bucketStatus}`,
        allDay: true,
        draggable: false,
        resizable: { beforeStart: false, afterEnd: false },
        meta: {
          readonly: true,
          kind: 'articles',
          topicId: bucket.topicId,
          topicName: bucket.topicName,
          courseId: this.courseId,
          status: bucketStatus,
          articles: bucket.articles,
        },
      });
    }

    return result;
  }

  // A day can bucket several articles from the same topic with different
  // statuses (e.g. some completed, some not yet due) — the bucket only
  // shows as fully "completed" once every article in it is.
  private bucketStatus(statuses: IScheduleEventStatus[]): IScheduleEventStatus {
    if (statuses.every((s) => s === 'completed')) return 'completed';
    if (statuses.some((s) => s === 'missed')) return 'missed';
    if (statuses.some((s) => s === 'today')) return 'today';
    return 'pending';
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate())) {
      if (
        (isSameDay(this.viewDate(), date) && this.activeDayIsOpen() === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen.set(false);
      } else {
        this.activeDayIsOpen.set(true);
        this.viewDate.set(date);
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events.set(
      this.events().map((iEvent: CalendarEvent<any>) => {
        if (iEvent === event) {
          return {
            ...event,
            start: newStart,
            end: newEnd,
          };
        }
        return iEvent;
      })
    );

    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.config.data = { event, action };
    this.dialogRef.set(this.dialog.open(CalendarDialogComponent, this.config));

    this.dialogRef()
      .afterClosed()
      .subscribe((result: string) => {
        this.lastCloseResult.set(result);
        this.dialogRef.set(null);
        this.refresh.next(result);
      });
  }

  addEvent(): void {
    this.dialogRef2.set(
      this.dialog.open(CalendarFormDialogComponent, {
        panelClass: 'calendar-form-dialog',
        autoFocus: false, 
        data: {
          action: 'add',
          date: new Date(),
        },
      })
    );
    this.dialogRef2()
      .afterClosed()
      .subscribe((res: { action: any; event: any }) => {
        if (!res) {
          return;
        }
        const dialogAction = res.action;
        const responseEvent = res.event;
        responseEvent.actions = this.actions;
        this.events.set([...this.events(), responseEvent]);
        this.dialogRef2.set(null);
        this.refresh.next(res);
      });
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.events.set(
      this.events().filter(
        (event: CalendarEvent<any>) => event !== eventToDelete
      )
    );
  }

  setView(view: CalendarView | any): void {
    this.view.set(view);
  }

  goToPreviousMonth(): void {
    this.viewDate.set(subMonths(this.viewDate(), 1));
  }

  goToNextMonth(): void {
    this.viewDate.set(addMonths(this.viewDate(), 1));
  }

  goToToday() {
    this.viewDate.set(new Date());
  }
}
