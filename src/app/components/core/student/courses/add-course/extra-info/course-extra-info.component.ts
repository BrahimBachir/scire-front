import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

import { CoursesTagsComponent } from '../courses-tags/courses-tags.component';
import { CallerFilterComponent } from 'src/app/components/generic/filters/calling-org/calling-org-filter.component';
import { CourseTypeFilterComponent } from 'src/app/components/generic/filters/course-type/course-type-filter.component';
import { CourseCategryFilterComponent } from 'src/app/components/generic/filters/course-category/course-category-filter.component';
import { ICourseType, IFieldMode } from 'src/app/common/models/interfaces';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YearPickerComponent } from 'src/app/components/generic/reusable/year-picker/year-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { IconModule } from 'src/app/icon/icon.module';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { selectUserRole } from 'src/app/common/store/selectors';
import { CourseService } from 'src/app/services';

@Component({
  selector: 'app-course-extra-info',
  imports: [
    CommonModule,
    FormsModule,
    IconModule,
    ReactiveFormsModule,
    MaterialModule,
    CoursesTagsComponent,
    CallerFilterComponent,
    CourseTypeFilterComponent,
    CourseCategryFilterComponent,
    YearPickerComponent,
    MatDatepickerModule
  ],
  templateUrl: './course-extra-info.component.html',
  styleUrl: './course-extra-info.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class AddCourseExtraInfoComponent implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  modeToSend!: IFieldMode;
  @Input() isEditMode = false;

  private store = inject(Store<AppState>);
  private courseService = inject(CourseService);

  protected roleCode = '';
  private orgTypeId: number | null = null;

  constructor() {
  }

  ngOnInit(): void {
    this.modeToSend = this.isEditMode ? 'EDITING' : 'CREATING';

    this.store.select(selectUserRole).subscribe(role => this.roleCode = role?.code ?? '');

    // Only the ORG course type carries the public/private distinction — see
    // course-permissions.helper.ts (backend) and CourseService.create().
    this.courseService.getTypes().subscribe((types: ICourseType[]) => {
      this.orgTypeId = types.find(t => t.code === 'ORG')?.id ?? null;
    });
  }

  get isOrgCourseType(): boolean {
    return this.orgTypeId != null && this.form.get('typeId')?.value === this.orgTypeId;
  }

  // Only an ADMIN may decide whether an org course is public or private —
  // mirrors CourseService.create()/update() on the backend, which is the
  // real boundary; this only gates the UI control.
  get canEditVisibility(): boolean {
    return this.roleCode === 'ADMIN';
  }

  populateFields(){

  }
}