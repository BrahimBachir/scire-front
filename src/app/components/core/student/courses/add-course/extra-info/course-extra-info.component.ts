import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

import { CoursesTagsComponent } from '../courses-tags/courses-tags.component';
import { CallerFilterComponent } from 'src/app/components/generic/filters/calling-org/calling-org-filter.component';
import { CourseTypeFilterComponent } from 'src/app/components/generic/filters/course-type/course-type-filter.component';
import { CourseCategryFilterComponent } from 'src/app/components/generic/filters/course-category/course-category-filter.component';
import { IFieldMode } from 'src/app/common/models/interfaces';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YearPickerComponent } from 'src/app/components/generic/reusable/year-picker/year-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { IconModule } from 'src/app/icon/icon.module';

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

  constructor() {
  }

  ngOnInit(): void {
    this.modeToSend = this.isEditMode ? 'EDITING' : 'CREATING';
  }

  populateFields(){
    
  }
}