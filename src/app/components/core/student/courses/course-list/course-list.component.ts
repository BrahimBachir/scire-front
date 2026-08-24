import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from 'src/app/services/courses.service';
import { FilterConfig, FiltersOptions, ICaller, ICourse, ICourseType, IFilters, IQueryingDto } from 'src/app/common/models/interfaces';
import { ControlAccessPipe } from 'src/app/common/pipe/actions-access.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { distinctUntilChanged, Observable } from 'rxjs';
import { AppBannersNotFoundComponent } from 'src/app/components/generic/banners/not-found/banner-not-found.component';
import { CourseFiltersData } from 'src/app/common/data/filters/course-filter-items';
import { TranslateModule } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
import { AppFiltersOrchestratorComponent } from 'src/app/components/generic/filters/orchestrator/filters-orchestrator.component';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { selectLogedUser, selectUserRole } from 'src/app/common/store/selectors';
import { FRONT_ROUTE_TOKEN_SUPER } from 'src/app/common/config';
import { canDeleteCourse, canEditCourse } from 'src/app/common/models/interfaces';


//TODO: 6. OrderBy functionality

export interface Section {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-course-list',
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    IconModule,
    FormsModule,
    NgScrollbarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AppBannersNotFoundComponent,
    AppFiltersOrchestratorComponent,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class AppCourseListComponent implements OnInit {
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private _snackBar = inject(MatSnackBar);
  private service = inject(CourseService);
  private activatedRouter = inject(ActivatedRoute);


  protected courses = signal<ICourse[]>([]);
  protected filteredCourses = signal<ICourse[] | null>(null);
  protected selectedCourse = signal<ICourse | null>(null);

  filtersConfig: FilterConfig[] = CourseFiltersData;
  length!: number;
  pageSize: number = 10;
  currentPageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100]

  filters!: IQueryingDto;

  mobileQuery: MediaQueryList;
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: 1199px)`);
  durationInSeconds = 1;
  searchText: string = '';
  loading: boolean = false;

  callingOrgControl = new FormControl('');
  filteredCallingOrgs: ICaller[];
  filtersForm!: FormGroup;


  courseTypes: ICourseType[] = [];
  selectedCourseType: ICourseType | null = null;
  callingOrgs: ICaller[] = [];
  selectedCallingOrg: ICaller | null = null;

  isMobileView = false;

  private showOnlyMyCourses: boolean = false;
  private showOnlyInstructorCourses: boolean = false;
  protected isSuper: boolean = false;
  private currentUserId: number | null = null;
  private currentUserRoleCode: string | null = null;
  private currentUserOrganizationId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    const media = inject(MediaMatcher);
    this.mobileQuery = media.matchMedia('(max-width: 1199px)');
    this.isMobileView = this.mobileQuery.matches;

    this.mobileQuery.addEventListener('change', (e) => {
      this.isMobileView = e.matches;
    });

    this.store.select(selectUserRole).subscribe(role => {
      this.isSuper = role.code === 'SUPER';
      this.currentUserRoleCode = role.code ?? null;
    });
    this.store.select(selectLogedUser).subscribe(user => {
      this.currentUserId = user?.id ?? null;
      this.currentUserOrganizationId = user?.organizationId ?? null;
    });

    this.showOnlyMyCourses = !!this.route.snapshot.data['myCourses'];
    this.showOnlyInstructorCourses = !!this.route.snapshot.data['instructorCourses'];

    this.filtersForm = this.fb.group({
      caller: [''],
      description: [''],
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getItems();
  }

  onFiltersChanged(filters: IQueryingDto) {
    this.filters = filters;
    this.getItems();
  }

  create() {
    this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/courses/new`]);

  }

  goToModeration() {
    this.router.navigate([`${FRONT_ROUTE_TOKEN_SUPER}/moderation`]);
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    this.filters = {
      ...this.filters,
      take: this.pageSize,
      skip: this.pageSize * this.currentPageIndex
    }
    this.filteredCourses.set(null);
    const request$ = this.showOnlyInstructorCourses
      ? this.service.getInstructorCourses(this.filters)
      : this.showOnlyMyCourses
        ? this.service.getMyCourses(this.filters)
        : this.service.getAll(this.filters);
    request$.subscribe({
      next: (res) => {
        this.courses.set(res.rows as ICourse[]);
        this.length = res.total;
        this.filteredCourses.set(res.rows as ICourse[]);
      },
      //error: (error) => { console.error('There was an error!', error)}
    });
  }

  goToCourseDetails(course: ICourse) {
    if (course.id) this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/details`.replace(':courseId', course.id.toString())]);
  }

  getStarClass(index: number, rating?: number): string {
    const safeRating = rating ?? 0; // Fallback if undefined
    const fullStars = Math.floor(safeRating); // Full stars
    const partialStars = safeRating % 1 !== 0; // Whether there is a partial star

    if (index < fullStars) {
      return 'fill-warning'; // full star
    } else if (index === fullStars && partialStars) {
      return 'text-warning'; // partial star
    } else {
      return ''; // empty star, no class
    }
  }

  canEdit(course: ICourse): boolean {
    return canEditCourse(
      course.typeCode,
      course.creatorId,
      this.currentUserRoleCode ?? undefined,
      this.currentUserId ?? undefined,
      course.organizationId,
      this.currentUserOrganizationId ?? undefined,
    );
  }

  canDelete(course: ICourse): boolean {
    return canDeleteCourse(
      course.typeCode,
      course.creatorId,
      this.currentUserRoleCode ?? undefined,
      this.currentUserId ?? undefined,
      course.organizationId,
      this.currentUserOrganizationId ?? undefined,
    );
  }

  remove(id: number) {
    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.service.delete(id || 0).subscribe({
          next: (res) => {
            this.getItems();
            this.showSnackbar(res.message);
          },
          //error: (error) => console.error(error)
        })
      }
    });
  }

  update(id: number) {
    const courseId: string = id.toString() || '';
    this.router.navigate([`${this.activatedRouter?.snapshot.data['role'].toLowerCase()}/courses/:courseId/edit`.replace(':courseId', courseId)]);
  }

  showSnackbar(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
