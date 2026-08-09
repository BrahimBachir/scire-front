import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import {
  ITest,
  IQueryingDto,
  FilterConfig,
  FiltersOptions,
} from 'src/app/common/models/interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { TestService } from 'src/app/services';
import { IconModule } from 'src/app/icon/icon.module';
import { AppFiltersOrchestratorComponent } from 'src/app/components/generic/filters/orchestrator/filters-orchestrator.component';
import { TestFiltersData } from 'src/app/common/data';
import { TranslateModule } from '@ngx-translate/core';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestDialogComponent } from './test-dialog/test-dialog.component';
@Component({
  templateUrl: './test.component.html',
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    CommonModule,
    AppFiltersOrchestratorComponent,
    TranslateModule,
  ],
  styleUrl: './test.component.scss',
})
export class AppTestComponent implements AfterViewInit {
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);

  courseId: number = 0;

  filtersConfig: FilterConfig[] = TestFiltersData;
  length!: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  currentPageIndex: number = 0;
  lastId: number = 0;

  filters!: IQueryingDto;

  filterOptions: FiltersOptions = {
    applyMode: 'auto',
    maxVisbleFields: 4,
  };

  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  displayedColumns: string[] = [
    'id',
    'type',
    'num_questions',
    'correct',
    'wrong',
    'not_answered',
    'score',
    'date',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<ITest>([]);

  constructor(
    public dialog: MatDialog,
    private service: TestService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
  ) {
    this.courseId =
      Number(this.route?.snapshot?.paramMap?.get('courseId')) || 0;
  }

  ngOnInit(): void {
    this.filters = {
      take: this.pageSize,
      skip: this.pageSize * this.currentPageIndex,
    };
    this.loadItems();
  }

  loadItems(): void {
    this.service.getAllTests(this.filters).subscribe({
      next: (res) => {
        this.length = res.total;
        this.dataSource.data = res.rows;
        this.lastId = res.rows[0].id;
        this.dataSource = new MatTableDataSource(res.rows);
      },
      //error: (error) => console.error(error)
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  goToSimulator(): void {
    this.router.navigate([
      `${this.route?.snapshot.data['role'].toLowerCase()}/courses/${this.courseId}/tests/${this.lastId}/simulator`,
    ]);
  }

  create() {
    const dialogRef = this.dialog.open(TestDialogComponent, {
      data: { courseId: this.courseId },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadItems();
      }
    });
  }

  edit(test: ITest) {
    const dialogRef = this.dialog.open(TestDialogComponent, {
      data: { element: test, courseId: this.courseId },
      //autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadItems();
      }
    });
  }

  resume(id: number) {
    this.router.navigate([
      `${this.route?.snapshot.data['role'].toLowerCase()}/courses/${this.courseId}/tests/${id}/simulator`,
    ]);
  }

  goToDetails(id: number) {
    this.router.navigate([
      `${this.route?.snapshot.data['role'].toLowerCase()}/courses/${this.courseId}/tests/${id}/results`,
    ]);
  }

  onFiltersChanged(filters: IQueryingDto) {
    this.filters = {
      ...filters,
      take: this.pageSize,
      skip: this.pageSize * this.currentPageIndex,
    };
    this.loadItems();
  }

  onPageChange(event: PageEvent) {
    this.filters = {
      ...this.filters,
      take: event.pageSize,
      skip: event.pageSize * event.pageIndex,
    };
    this.loadItems();
  }

  remove(id: number) {
    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.service.delete(id).subscribe({
          next: (res) => {
            this.loadItems();
            this.showSnackbar(res.message);
          },
          //error: (error) => console.error(error)
        });
      }
    });
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
