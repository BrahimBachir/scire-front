import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { LearningService } from 'src/app/services';
import { ITopicCategory } from 'src/app/common/models/interfaces';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-course-categories',
  imports: [
    MaterialModule,
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './course-categories.component.html',
})
export class CourseCategoriesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(LearningService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  categories: ITopicCategory[] = [];

  displayedColumns = ['name', 'actions'];

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    if (this.courseId)
      this.service.getCategoriesByCourse(this.courseId).subscribe(res => {
        this.categories = res;
      });
  }

  create(): void {
    if (!this.courseId) return;

    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: { courseId: this.courseId },
    });

    dialogRef.afterClosed().subscribe(() => this.getItems());
  }

  remove(categoryId: number): void {
    if (!this.courseId) return;

    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.service.removeCategoryFromCourse(this.courseId!, categoryId).subscribe({
          next: (res) => {
            this.getItems();
            this.showSnackbar(res.message ?? 'Categoría desasociada');
          },
        });
      }
    });
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}