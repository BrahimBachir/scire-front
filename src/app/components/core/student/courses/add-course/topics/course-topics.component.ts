import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from 'src/app/services/apps/product.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TopicService } from 'src/app/services';
import { ITopic } from 'src/app/common/models/interfaces';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppDeleteDialogComponent } from 'src/app/components/generic/dialogs/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TopicDialogComponent } from './topic-dialog/topic-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-course-topics',
  imports: [
    MaterialModule,
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    TranslateModule,
    MatTooltipModule
  ],
  templateUrl: './course-topics.component.html',
  styleUrl: './course-topics.component.scss',
})
export class CourseTopicsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(TopicService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  topics: ITopic[];

  displayedColumns = ['name', 'description', 'category', 'section', 'actions'];

  isEditMode: boolean = false;
  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;

  constructor() {
  }


  ngOnInit(): void {
    this.getItems();
  }


  getItems() {
    if (this.courseId)
      this.service.getByCourse(this.courseId)
        .subscribe(res => {
          this.topics = res.rows as ITopic[];
        })
  }

  update(topic: ITopic) {
    this.router.navigate([
      `${this.route?.snapshot.data['role']
        .toLowerCase()}/topics/:topicId/edit`
        .replace(':topicId', topic.id.toString())
      ]);
  }

  create() {
    this.isEditMode = false;
    const action = 'SELECCIONAR';
    this.openDialog(action);
  }

  openDialog(action: string, topic?: ITopic) {
    const dialogRef = this.dialog.open(TopicDialogComponent, {
      //width: '80vw',
      data: {
        action: action,
        mode: this.isEditMode ? 'EDITING' : 'SELECTING',
        element: topic,
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
            this.showSnackbar(this.translate.instant(res.message));
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
