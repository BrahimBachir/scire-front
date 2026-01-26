import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from "ngx-editor";
import { Subscription } from "rxjs";
import { IFieldMode } from "src/app/common/models/interfaces";
import { CourseStatusFilterComponent } from "src/app/components/generic/filters/course-status/course-status-filter.component";
import { IconModule } from "src/app/icon/icon.module";
import { MaterialModule } from "src/app/material.module";

@Component({
  selector: 'app-course-general-info',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    IconModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
    CourseStatusFilterComponent,
  ],
  templateUrl: './course-general-info.component.html',
  styleUrl: './course-general-info.component.scss',
})
export class CourseGeneralInfoComponent implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  modeToSend!: IFieldMode;
  @Input() isEditMode = false;

  editor = new Editor();
  html = '';
  htmlContent1 = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  get defaultImage() {
    let image = 'assets/images/products/s:id.jpg';
    return image.replace(':id', (Math.floor(Math.random() * 20) + 1).toString());
  }

  imgSrc = this.defaultImage;

  private sub?: Subscription;

  ngOnInit(): void {
    this.modeToSend = this.isEditMode ? 'EDITING' : 'CREATING';

    const control = this.form.get('imgSrc');

    this.imgSrc = control?.value || this.defaultImage;

    this.sub = control?.valueChanges.subscribe(value => {
      this.imgSrc = value || this.defaultImage;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  setImage(src: string): void {
    this.form.get('imgSrc')?.setValue(src);
  }

  removeImage(): void {
    this.form.get('imgSrc')?.setValue(null);
  }
}


/* import { CommonModule } from "@angular/common";
import { Component, effect, inject, input, model, OnInit, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, Toolbar, Validators } from "ngx-editor";
import { debounceTime, startWith } from "rxjs";
import { ICourseGeneralInfo, ICourseStatus } from "src/app/common/models/interfaces";
import { AppCourseStatusFilterComponent } from "src/app/components/generic/filters/course-status/course-status-filter.component";
import { IconModule } from "src/app/icon/icon.module";
import { MaterialModule } from "src/app/material.module";

@Component({
  selector: 'app-course-general-info',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    IconModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
    AppCourseStatusFilterComponent,
  ],
  templateUrl: './course-general-info.component.html',
  styleUrl: './course-general-info.component.scss',
})
export class AddCourseGeneralInfoComponent implements OnInit {
  private router = inject(Router);
  isEditMode = input<boolean>(false);
  imgSrc = signal<string>('');

  generalInfo = model<ICourseGeneralInfo | null>(null);
  incomingGeneralInfo = model<ICourseGeneralInfo | null>(null);
  selectedStatus = signal<ICourseStatus | null>(null);
  toStatusComponent = signal<number | null>(null);
  
  items: ICourseGeneralInfo = {
    code: '',
    description: '',
    details: '',
    imgSrc: '',
    statusId: 0
  };


  editor: Editor;
  html = '';
  htmlContent1 = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];


  protected descriptionControl = new FormControl<string>('');
  protected codeControl = new FormControl<string>('');
  protected detailsControl = new FormControl<string>('');

  form!: FormGroup;

  courseId: number = 0;
  constructor() {
    effect(() => {
      const incoming = this.generalInfo();

      this.populateForm();
    })

    effect(() => {
      //console.log("General info object when status has changed: ", this.generalInfo())
      const status = this.selectedStatus();

      if(status)
      this.items = {
        ...this.items,
        statusId: status.id,
      }
      this.generalInfo.set(this.items);
    })

    this.descriptionControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      if(!value || value === '') return;
      this.items = {
        ...this.items,
        description: value,
      }
      if(!this.isEditMode())
        this.generalInfo.set(this.items);
    });

    this.codeControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      if(!value || value === '') return;
      this.items = {
        ...this.items,
        code: value,
      }
      if(!this.isEditMode())
        this.generalInfo.set(this.items);
    });

    this.detailsControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      if(!value || value === '') return;
      this.items = {
        ...this.items,
        details: value,
      }
      if(!this.isEditMode())
        this.generalInfo.set(this.items);
    });
  }

  get isFormValid() {
    return this.form.valid;
  }

  get formControls() {
    return this.form.controls;
  }



  get tagsArray(): FormArray {
    return this.form.get('tags') as FormArray;
  }
  ngOnInit(): void {
    this.editor = new Editor();
    const currentUrl = this.router.url;

    if (currentUrl.includes('new')) {
      this.setDefaultImage();
    } else {
      this.populateForm()
    }

  }
  ngOnDestroy() {
    if(this.editor)
      this.editor.destroy();
  }

  populateForm() {
    const data = this.generalInfo();

    if (data) {
      this.descriptionControl.setValue(this.generalInfo()?.description || '')
      this.codeControl.setValue(this.generalInfo()?.code || '')
      this.detailsControl.setValue(this.generalInfo()?.details || '')
      this.imgSrc.set(this.generalInfo()?.imgSrc || '');
      //this.toStatusComponent.set(this.generalInfo()?.statusId || 0)
    }
  }


  setDefaultImage() {
    let image = 'assets/images/products/s:id.jpg';

    if (image && image !== '') {
      this.imgSrc.set(image.replace(':id', (Math.floor(Math.random() * 20) + 1).toString()))
      this.items.imgSrc = this.imgSrc() || '';
      this.generalInfo.set(this.items);
    }
  }
}
 */