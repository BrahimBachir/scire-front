import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { ProductService } from 'src/app/services/apps/product.service';

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
export class AddCourseExercisesComponent implements OnInit {
  private router = inject(Router);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  isEditMode: boolean = false;
  courseId: number;
  constructor() {
  }

  ngOnInit(): void {
    

  }
}
