import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from 'src/app/services';
import { ICourse } from 'src/app/common/models/interfaces';

@Component({
  selector: 'app-course-pricing',
  imports: [
    MaterialModule,
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './course-pricing.component.html',
  styleUrl: './course-pricing.component.scss',
})
export class AddCoursePricingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(CourseService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  courseId: number | null = Number(this.route.snapshot.paramMap.get('courseId')) || null;
  course: ICourse | null = null;
  saving = false;

  form = this.fb.group({
    isPaid: [false],
    price: [null as number | null, [Validators.min(0)]],
    discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
    vatPercentage: [21, [Validators.min(0)]],
  });

  ngOnInit(): void {
    if (!this.courseId) return;
    this.service.getOne(this.courseId).subscribe((course) => {
      this.course = course;
      this.form.patchValue({
        isPaid: !!course.isPaid,
        price: course.price ?? null,
        discountPercentage: course.discountPercentage ?? 0,
        vatPercentage: course.vatPercentage ?? 21,
      });
    });
  }

  get finalPrice(): number | null {
    const { price, discountPercentage, vatPercentage } = this.form.getRawValue();
    if (!price) return null;
    const discounted = price * (1 - (discountPercentage || 0) / 100);
    return Math.round(discounted * (1 + (vatPercentage || 0) / 100) * 100) / 100;
  }

  save(): void {
    if (!this.course || !this.courseId || this.form.invalid) return;

    const { isPaid, price, discountPercentage, vatPercentage } = this.form.getRawValue();
    this.saving = true;
    this.service
      .update({
        ...this.course,
        isPaid: !!isPaid,
        price: isPaid ? (price ?? undefined) : undefined,
        discountPercentage: isPaid ? (discountPercentage ?? 0) : undefined,
        vatPercentage: isPaid ? (vatPercentage ?? 0) : undefined,
      })
      .subscribe({
        next: (updated) => {
          this.course = updated;
          this.saving = false;
          this.showSnackbar('Precio del curso actualizado correctamente!');
        },
        error: () => {
          this.saving = false;
          this.showSnackbar('No se ha podido actualizar el precio del curso.');
        },
      });
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
