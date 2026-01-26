import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-course-topics',
  imports: [
    MaterialModule,
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './course-topics.component.html',
  styleUrl: './course-topics.component.scss',
})
export class AddCourseTopicsComponent  {
  private router = inject(Router);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  isEditMode: boolean = false;
  courseId: number;
  constructor() {
  }
}
