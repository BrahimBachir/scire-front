import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { IExercise } from 'src/app/common/models/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseDialogComponent } from './exercise-dialog/exercise-dialog.component';
import { ExerciseService } from 'src/app/services/exercise.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-course-exercises',
  imports: [
    MaterialModule,
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
  ],
  templateUrl: './course-exercises.component.html',
  styleUrl: './course-exercises.component.scss',
})
export class CourseExercisesComponent implements OnInit {
  form!: FormGroup;
  private router = inject(Router);
  private service = inject(ExerciseService);
  private dialog = inject(MatDialog)
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  exercises: IExercise[];

  isEditMode: boolean = false;
  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;


  constructor() {
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    if (this.courseId)
      this.service.getAllByCourse(this.courseId)
        .subscribe(res => {
          this.exercises = res;
        })
  }

  update(exercise?: IExercise) {
    this.isEditMode = true;
    const action = 'EDITAR';
    this.openDialog(action, exercise);
  }

  create() {
    this.isEditMode = false;
    const action = 'CREAR';
    this.openDialog(action);
  }

  openDialog(action: string, exercise?: IExercise) {
    const dialogRef = this.dialog.open(ExerciseDialogComponent, {
      width: '900px',
      data: {
        action: action,
        mode: this.isEditMode ? 'EDITING' : 'CREATING',
        element: exercise,
        courseId: this.courseId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getItems();
    });
  }

  remove(id: number) {
    const dialogRef = this.dialog.open(AppDeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.service.delete(id).subscribe({
          next: (res) => {
            this.getItems();
            this.showSnackbar(res.message);
          },
          //error: (error) => console.error(error)
        })
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
