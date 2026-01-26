import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, input, model, OnInit, signal } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import { AppCoursesTagsComponent } from '../courses-tags/courses-tags.component';
import { CallerFilterComponent } from 'src/app/components/generic/filters/calling-org/calling-org-filter.component';
import { CourseTypeFilterComponent } from 'src/app/components/generic/filters/course-type/course-type-filter.component';
import { AppCourseCategryFilterComponent } from 'src/app/components/generic/filters/course-category/course-category-filter.component';
import { ICaller, ICourseCategory, ICourseExtraInfo, ICourseType, IFieldMode } from 'src/app/common/models/interfaces';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { YearPickerComponent } from 'src/app/components/generic/reusable/year-picker/year-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-course-extra-info',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    IconModule,
    AppCoursesTagsComponent,
    CallerFilterComponent,
    CourseTypeFilterComponent,
    AppCourseCategryFilterComponent,
    YearPickerComponent,
    MatDatepickerModule
  ],
  templateUrl: './course-extra-info.component.html',
  styleUrl: './course-extra-info.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class AddCourseExtraInfoComponent implements OnInit {
  selectedType = signal<ICourseType | null>(null);
  selectedCategory = signal<ICourseCategory | null>(null);
  selectedCallOrg = signal<ICaller | null>(null);
  selectedTags = signal<string[]>([]);
  callingYear = signal<number>(0);
  @Input() isEditMode = false;
  modeToSend!: IFieldMode;

  extraInfo = model<ICourseExtraInfo | null>(null);

  protected vacanciesControl = new FormControl<string>('');
  protected urlControl = new FormControl<string>('');
  protected examDateControl = new FormControl();

  form!: FormGroup;

  items: ICourseExtraInfo = {
    tags: [],
    callerId: 0,
    typeId: 0,
    categoryId: 0,
    official_call_url: '',
    vacancies: 0,
    calling_year: 0,
    examDate: null//''
  };

  constructor() {
    effect(() => {
      const incoming = this.extraInfo();

      this.populateFields();
    })
    effect(() => {
      const type = this.selectedType()
      const category = this.selectedCategory()
      const callOrg = this.selectedCallOrg()
      const tags = this.selectedTags()
      const year = this.callingYear();

      if(type) this.items = {
        ...this.items,
        typeId: type.id,
      }

      if(category) this.items = {
        ...this.items,
        categoryId: category.id,
      }

      if(callOrg) this.items = {
        ...this.items,
        callerId: callOrg.id,
      }

      if(tags) this.items = {
        ...this.items,
        tags: [...tags]
      }

      if(year) this.items = {
        ...this.items,
        calling_year: year
      }

      this.extraInfo.set(this.items);
    })

    this.vacanciesControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      if(!value || value === '') return;
      this.items = {
        ...this.items,
        vacancies: Number(value),
      }
      this.extraInfo.set(this.items);
    });

    this.urlControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      if(!value || value === '') return;
      this.items = {
        ...this.items,
        official_call_url: value,
      }
      this.extraInfo.set(this.items);
    });

    this.examDateControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      if(!value || value === '') return;
      this.items = {
        ...this.items,
        examDate: new Date(value)//.toISOString(),
        //examDate: value,
      }
      this.extraInfo.set(this.items);
    });
  }

  ngOnInit(): void {
    this.modeToSend = this.isEditMode ? 'EDITING' : 'CREATING';
  }

  populateFields(){
    
  }
}
