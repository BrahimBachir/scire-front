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
import { AppDeleteDialogComponent } from '../../../kanban/delete-dialog/delete-dialog.component';


//TODO: 3. Actions (create, edit, delete --> decide logic)
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

  notes: Section[] = [
    { name: 'newest', icon: 'calendar' },
    { name: 'Price: High-Low', icon: 'sort-descending' },
    { name: 'Price: Low-High', icon: 'sort-ascending' },
    { name: 'discounted', icon: 'percentage' },
  ];
  selectedSortBy: string = this.notes[0].name;
  selectedColor: string | null = null;
  isMobileView = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    const media = inject(MediaMatcher);
    this.mobileQuery = media.matchMedia('(max-width: 1199px)');
    this.isMobileView = this.mobileQuery.matches;

    this.mobileQuery.addEventListener('change', (e) => {
      this.isMobileView = e.matches;
    });

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
    this.service.getAll(this.filters).subscribe({
      next: (res) => {
        this.courses.set(res.rows as ICourse[]);
        this.length = res.total;
        this.filteredCourses.set(res.rows as ICourse[]);
      },
      //error: (error) => { console.error('There was an error!', error)}
    });
  }

  openDialog(idOrIds: number | number[]): void {
    const dialogRef = this.dialog.open(AppDeleteDialogComponent, {
      data: {
        ids: Array.isArray(idOrIds) ? idOrIds : [idOrIds], // Always pass as array
      },
      width: '400px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'delete') {
        if (Array.isArray(idOrIds)) {
        } else {
          this.getDeletedById(idOrIds); // ⬅️ Handle single deletion
        }
      }
    });
  }
  getDeletedById(id: number) {
    /*     this.filteredCourses = this.filteredCourses.filter(
          (product) => product.id !== id
        );
    
        this.cdr.detectChanges(); // Optional if view updates correctly
        this.openSnackBar('Product deleted successfully!'); */
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: this.durationInSeconds * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  getCourseDetails(course: ICourse) {
    //this.router.navigate(['apps/product/product-details']);
    this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/details`.replace(':courseId', course.id.toString())]);
  }

  toggleColor(color: string): void {
    this.selectedColor = this.selectedColor === color ? null : color;
  }
  getEditedProduct(course: ICourse) {
    this.router.navigate(['apps/product/edit-product']);
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



}
