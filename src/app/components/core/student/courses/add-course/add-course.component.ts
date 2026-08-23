import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxDropzoneModule } from "ngx-dropzone";
import { IconModule } from "src/app/icon/icon.module";
import { MaterialModule } from "src/app/material.module";
import { CourseService } from "src/app/services";
import { CourseExercisesComponent } from "./exercises/course-exercises.component";
import { AddCourseExtraInfoComponent } from "./extra-info/course-extra-info.component";
import { CourseGeneralInfoComponent } from "./general-info/course-general-info.component";
import { AddCoursePricingComponent } from "./pricing/course-pricing.component";
import { CourseTopicsComponent } from "./topics/course-topics.component";
import { CourseUploadComponent } from "./upload/course-upload.component";
import { CourseCategoriesComponent } from "./categories/course-categories.component";
import { CourseSectionsComponent } from "./sections/course-sections.component";
import { ICourse } from "src/app/common/models/interfaces";

@Component({
  selector: 'app-add-course',
  imports: [
    MaterialModule,
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    CourseGeneralInfoComponent,
    AddCourseExtraInfoComponent,
    CourseExercisesComponent,
    CourseTopicsComponent,
    CourseUploadComponent,
    CourseCategoriesComponent,
    CourseSectionsComponent,
    AddCoursePricingComponent
  ],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss',
})
export class AddCourseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseId = Number(this.route.snapshot.paramMap.get('courseId')) || null;
  isEditMode = !!this.courseId;

  course: ICourse | null = null;

  form = this.fb.group({
    general: this.fb.group({
      id: this.fb.control<number | null>(null),
      code: this.fb.control<string>('', { nonNullable: true, validators: Validators.required }),
      description: this.fb.control<string>('', { nonNullable: true, validators: Validators.required }),
      details: this.fb.control<string | null>(null),
      imgSrc: this.fb.control<string | null>(null),
      statusId: this.fb.control<number | null>(null, Validators.required),
    }),

    extra: this.fb.group({
      calling_year: this.fb.control<number | null>(null, Validators.required),
      examDate: this.fb.control<Date | null>(null),
      vacancies: this.fb.control<number | null>(null),
      official_call_url: this.fb.control<string | null>(null),
      tags: this.fb.control<string[]>([]),
      callerId: this.fb.control<number | null>(null, Validators.required),
      typeId: this.fb.control<number | null>(null, Validators.required),
      categoryId: this.fb.control<number | null>(null, Validators.required),
      // ORG course types only — see course-extra-info.component.ts. Left
      // undefined for any other type; the backend ignores it in that case.
      isPublic: this.fb.control<boolean | null>(null),
    }),
  });



  ngOnInit(): void {
    if (this.isEditMode) {
      this.loadCourse();
    }

    this.form.valueChanges.subscribe(value => console.log(value))
  }

  save(): void {
    if (this.form.invalid) return;
    const course = this.mapFormToCourse();
    const request$ = this.isEditMode
      ? this.service.update(course)
      : this.service.create(course);

    request$.subscribe(saved => {
      if (!this.isEditMode && saved.id)
        this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/edit`.replace(':courseId', saved.id.toString())]);
    });
  }


  private loadCourse(): void {
    if (this.courseId)
      this.service.getOne(this.courseId).subscribe(course => {
        this.course = course;
        this.form.patchValue({
          general: {
            id: course.id,
            code: course.code,
            description: course.description,
            details: course.details,
            imgSrc: course.imgSrc,
            statusId: course.statusId,
          },
          extra: {
            calling_year: course.calling_year,
            examDate: course.examDate,
            vacancies: course.vacancies,
            official_call_url: course.official_call_url,
            tags: course.tags ?? [],
            callerId: course.callerId,
            typeId: course.typeId,
            categoryId: course.categoryId,
            isPublic: course.isPublic ?? null,
          },
        });
      });
  }


  private mapFormToCourse(): ICourse {
    const { general, extra } = this.form.getRawValue();

    return {
      id: general.id,
      code: general.code || '',
      description: general.description || '',
      details: general.details || '',
      imgSrc: general.imgSrc || '',
      statusId: general.statusId || 0,
      calling_year: extra.calling_year || 0,
      examDate: extra.examDate || null,
      vacancies: extra.vacancies || 0,
      official_call_url: extra.official_call_url || '',
      tags: extra.tags || [],
      callerId: extra.callerId || 0,
      typeId: extra.typeId || 0,
      categoryId: extra.categoryId || 0,
      isPublic: extra.isPublic ?? undefined,
    };
  }

}


/* import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {
  Editor,
  Toolbar,
} from 'ngx-editor';
import { ProductService } from 'src/app/services/apps/product.service';
import { CourseGeneralInfoComponent } from './general-information/course-general-info.component';
import { AddCourseExtraInfoComponent } from './extra-info/course-extra-info.component';
import { CourseExercisesComponent } from './exercises/course-exercises.component';
import { CourseTopicsComponent } from './topics/course-topics.component';
import { AddCoursePricingComponent } from './pricing/course-pricing.component';
import { ICourse, ICourseExtraInfo, ICourseGeneralInfo } from 'src/app/common/models/interfaces';
import { CourseService } from 'src/app/services';

@Component({
  selector: 'app-add-course',
  imports: [
    MaterialModule,
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    CourseGeneralInfoComponent,
    AddCourseExtraInfoComponent,
    CourseExercisesComponent,
    CourseTopicsComponent,
    AddCoursePricingComponent
  ],
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss',
})
export class AppAddCourseComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private service = inject(CourseService);

  generalInfo = signal<ICourseGeneralInfo | null>(null);
  extraInfo = signal<ICourseExtraInfo | null>(null);

  course!: ICourse;

  image: string = '';


  isEditMode = computed(() => !!this.courseId);
  courseId: number;
  constructor() {
    this.courseId = Number(this.activatedRoute?.snapshot?.paramMap?.get('courseId')) || 0;

    const navigation = this.router.currentNavigation();
    const state = navigation?.extras.state as { course: ICourse };

    if (state) {
      this.course = state.course;
    }

    effect(() => {
      const genInfo = this.generalInfo();
      if (genInfo)
        this.course = {
          ...this.course,
          code: genInfo.code,
          description: genInfo.description,
          details: genInfo.details,
          imgSrc: genInfo.imgSrc,
          statusId: genInfo.statusId,
        }
    })

    effect(() => {
      const extraInfo = this.extraInfo();
      if (extraInfo)
        this.course = {
          ...this.course,
          tags: [...extraInfo.tags],
          callerId: extraInfo.callerId,
          typeId: extraInfo.typeId,
          categoryId: extraInfo.categoryId,
          vacancies: extraInfo.vacancies,
          calling_year: extraInfo.calling_year,
          examDate: extraInfo.examDate
        }
    })
  }
  ngOnInit(): void {
    if (!this.course)
      this.getCourse();
  }

  isSaveDisabled = computed(() => {

    return !this.extraInfo()?.callerId ||
      !this.extraInfo()?.categoryId ||
      !this.extraInfo()?.typeId ||
      !this.extraInfo()?.vacancies ||
      !this.generalInfo()?.code ||
      !this.generalInfo()?.description ||
      !this.generalInfo()?.statusId;
  });

  save() {
    this.service.create(this.course).subscribe((created) => {
      this.router.navigate([`${this.activatedRoute?.snapshot.data['role'].toLowerCase()}/courses/:courseId/edit`.replace(':courseId', created.id.toString())], {
        state: {
          course: this.course,
        }
      });
    })
  }

  getCourse() {
    this.service.getOne(this.courseId).subscribe((course) => {
      this.course = course;
      this.setExtraInfo();
      this.setGeneralInfo();
    })
  }

  setExtraInfo() {
    const info: ICourseExtraInfo = {
      tags: this.course?.tags || [],
      callerId: this.course?.callerId,
      typeId: this.course?.typeId,
      categoryId: this.course?.categoryId,
      official_call_url: this.course?.official_call_url,
      vacancies: this.course?.vacancies,
      calling_year: this.course?.calling_year,
      examDate: this.course?.examDate
    }

    this.extraInfo.set(info);
  }

  setGeneralInfo() {
    const info: ICourseGeneralInfo = {
      code: this.course?.code,
      description: this.course?.description,
      details: this.course?.details,
      imgSrc: this.course?.imgSrc,
      statusId: this.course.statusId
    }

    this.generalInfo.set(info);
  }
}
 */