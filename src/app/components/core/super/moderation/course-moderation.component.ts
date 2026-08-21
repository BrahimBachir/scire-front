import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { CourseService } from 'src/app/services';
import { ICourse } from 'src/app/common/models/interfaces';
import { AppBannersNotFoundComponent } from 'src/app/components/generic/banners/not-found/banner-not-found.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-course-moderation',
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatProgressSpinnerModule,
    AppBannersNotFoundComponent,
  ],
  templateUrl: './course-moderation.component.html',
  styleUrl: './course-moderation.component.scss',
})
export class AppCourseModerationComponent implements OnInit {
  private service = inject(CourseService);
  private _snackBar = inject(MatSnackBar);

  protected courses: ICourse[] | null = null;
  protected processingId: number | null = null;

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.courses = null;
    this.service.getAll({ statusCode: 'PENDING' }).subscribe(res => {
      this.courses = res.rows as ICourse[];
    });
  }

  approve(course: ICourse): void {
    if (!course.id) return;
    this.processingId = course.id;
    this.service.approve(course.id).subscribe({
      next: () => {
        this.processingId = null;
        this.showSnackbar('Curso aprobado.');
        this.getItems();
      },
      error: () => this.processingId = null,
    });
  }

  reject(course: ICourse): void {
    if (!course.id) return;
    this.processingId = course.id;
    this.service.reject(course.id).subscribe({
      next: () => {
        this.processingId = null;
        this.showSnackbar('Curso rechazado, vuelve a borrador.');
        this.getItems();
      },
      error: () => this.processingId = null,
    });
  }

  showSnackbar(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
