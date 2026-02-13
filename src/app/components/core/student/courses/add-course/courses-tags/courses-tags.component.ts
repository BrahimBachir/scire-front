import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, model, OnInit, signal } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {
  NgxEditorComponent,
  NgxEditorMenuComponent,
  Editor,
  Toolbar,
} from 'ngx-editor';
import { ProductService } from 'src/app/services/apps/product.service';
import { PRODUCT_DATA } from 'src/app/services/apps/ecommerceData';
import { CourseService } from 'src/app/services';

@Component({
  selector: 'app-courses-tags',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CoursesTagsComponent),
    multi: true,
  }],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    IconModule,
  ],
  templateUrl: './courses-tags.component.html',
  //styleUrl: './courses-tags.component.scss',
})
export class CoursesTagsComponent
  implements ControlValueAccessor, OnInit {

  private service = inject(CourseService);

  /** Available tags */
  tags = signal<string[]>([]);

  /** Internal value (CVA) */
  private value: string[] = [];

  /** Input control */
  control = new FormControl<string>('');

  /** CVA callbacks */
  private onChange: (value: string[]) => void = () => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.getTags();
  }

  writeValue(value: string[] | null): void {
    this.value = value ?? [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  /** ---- domain logic ---- */

  private updateValue(tags: string[]) {
    this.value = tags;
    this.onChange(tags);
    this.onTouched();
  }

  get selectedTags(): string[] {
    return this.value;
  }

  selectTag(tag: string) {
    if (!this.value.includes(tag)) {
      this.updateValue([...this.value, tag]);
    }
  }

  addTagFromInput(event: any) {
    const value = event.value?.trim();
    if (value && !this.value.includes(value)) {
      this.updateValue([...this.value, value]);
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  removeTag(tag: string) {
    this.updateValue(this.value.filter(t => t !== tag));
  }

  private getTags() {
    this.service.getTags().subscribe({
      next: tags => this.tags.set(tags),
    });
  }
}