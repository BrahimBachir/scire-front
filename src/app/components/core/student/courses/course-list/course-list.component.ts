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
import { ICallingOrg, ICourse, ICourseType } from 'src/app/common/models/interfaces';
import { ControlAccessPipe } from 'src/app/common/pipe/actions-access.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { distinctUntilChanged, Observable } from 'rxjs';
import { AppBannersNotFoundComponent } from 'src/app/components/generic/banners/not-found/banner-not-found.component';
import { DeleteDialogComponent } from 'src/app/components/generic/dialogs/confirm-dialog/delete-dialog.component';


export interface Section {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-course-list',
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    FormsModule,
    NgScrollbarModule,
    //ControlAccessPipe,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AppBannersNotFoundComponent,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class AppCourseListComponent implements OnInit {
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private _snackBar = inject(MatSnackBar);

    protected courses = signal<ICourse[]>([]);
    protected filteredCourses = signal<ICourse[]>([]);
    protected selectedCourse = signal<ICourse | null>(null);


  mobileQuery: MediaQueryList;
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: 1199px)`);
  durationInSeconds = 1;
  searchText: string = '';
  loading: boolean = false;

  callingOrgControl = new FormControl('');
  filteredCallingOrgs: ICallingOrg[];
  filtersForm!: FormGroup;


  courseTypes: ICourseType[] = [];
  selectedCourseType: ICourseType | null = null;
  callingOrgs: ICallingOrg[] = [];
  selectedCallingOrg: ICallingOrg | null = null;

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
    private courseService: CourseService,
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
      callingOrg: [''],
      description: [''],
    }); 
  }

  ngOnInit(): void {
    this.getCourseTypes();
    this.getCallingOrgs()
    this.getCourseList();

      this.filtersForm.get('topic')?.valueChanges
      .pipe(
        distinctUntilChanged() // Optional: Only emit when the value is truly different
      )
      .subscribe((value) => {
        this.filteredCallingOrgs = this._filter(value);
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredCourses.set(this.filter(filterValue));
  }

  filter(value: string): ICourse[] {
    return this.courses()
      .filter(
        (r) => r.description.toLowerCase().indexOf(value.toLowerCase()) !== -1 || r.code.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
  }

  getCallingOrgs() {
    this.courseService.getCallingOrgs().subscribe({
      next: (data) => {
        this.callingOrgs = data;
        this.filteredCallingOrgs = data;
        this.selectedCallingOrg = this.callingOrgs.filter(org => org.code.toLowerCase() === 'all')[0];
      },
      error: (error) => {
        console.error('There was an error!', error); 
      }
    });
  }
  getCourseTypes() {
    this.courseService.getTypes().subscribe({
      next: (data) => {
        this.courseTypes = data;
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }
  
  getCourseList() {
    this.loading = true;
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.loading = false;
        this.courses.set(data.rows as ICourse[]);
        this.filteredCourses.set(data.rows as ICourse[]);
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }

  
/*   getCallingOrg(callingOrg: ICallingOrg): void {
    this.selectedCallingOrg = callingOrg;
    if (callingOrg.code.toLowerCase() === 'all') {
      this.filteredCourses = [...this.courses];
    } else {
      this.filteredCourses = this.courses.filter((course) =>
        course.calling_org?.id === callingOrg.id
      );
    }
  } */
  

/*   getSorted(name: string): void {
    this.selectedSortBy = name; // ✅ Add this line to track selection

    const nameLower = name.toLowerCase();

    switch (nameLower) {
      case 'newest':
        this.filteredCourses = [...this.courses].sort((a, b) => {
          const dateA = new Date(a.calling_year);
          const dateB = new Date(b.calling_year);
          return dateB.getTime() - dateA.getTime(); // Newest first
        });
        break;
      default:
        this.filteredCourses = [...this.courses];
    }
  } */

/*   filterByCourseType(courseType: ICourseType): void {
    if (courseType.code.toLowerCase() === 'all') {
      this.filteredCourses = [...this.courses];
    } else {
      this.filteredCourses = this.courses.filter(
        (course) => course.type?.code === courseType.code
      );
    }
  } */
  
  private _filter(value: string): ICallingOrg[] {
    return this.callingOrgs.filter((option) =>
      option.description.toLowerCase().includes(value.toLowerCase())
    );
  }

  getProductList() {
    this.searchText = '';
  }

  isOver(): boolean {
    return this.mediaMatcher.matches;
  }

  getAddProductRoute() {
    this.router.navigate(['apps/product/add-product']);
  }
  openDialog(idOrIds: number | number[]): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
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
    const safeRating = rating ?? 0 ; // Fallback if undefined
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
