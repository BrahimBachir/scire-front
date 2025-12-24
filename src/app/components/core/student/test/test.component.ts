import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddTestComponent } from './add/add-test.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Test } from './test';
import { ITest, QueryingDto } from 'src/app/common/models/interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { TestService } from 'src/app/services';
import { AppTestDialogContentComponent } from './test-dialog/test-dialog-content';
@Component({
  templateUrl: './test.component.html',
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
  ],
})
export class AppTestComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);

  searchText: any;

  displayedColumns: string[] = ['id', 'type', 'numQuestions', 'correct','wrong','notAnswered','score', 'date', 'status','category','section','topic', 'actions'];


  dataSource = new MatTableDataSource<ITest>([]);  
  paginationDTO: QueryingDto = {
    skip: 0,
    take: 5,
    searchTerm: '',
    parentId: 0,
    sortedBy: '',
    totalCount: 0,
  };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    private testService: TestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(): void {
    this.testService.getAllTests(this.paginationDTO).subscribe({
      next: (tests) =>  {
        //this.dataSource = tests.rows;
        this.dataSource.data = tests.rows;
        this.dataSource = new MatTableDataSource(tests.rows);
        this.paginationDTO.totalCount = tests.total; 

      },
      error: (error) => console.error(error)
    })
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, test: Test | any): void {
    const dialogRef = this.dialog.open(AppTestDialogContentComponent, {
      data: { action, test }, autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      //this.dataSource.data = this.testService.getTests();
      if (result && result.event === 'Refresh') {
        this.loadTests(); // Refresh the test list if necessary
      }
    });
  }
}

interface DialogData {
  action: string;
  test: Test;
}