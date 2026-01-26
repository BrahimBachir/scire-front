import { CommonModule } from '@angular/common';
import { Component, inject, model, OnInit, signal } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
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
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-courses-tags',
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    IconModule,
  ],
  templateUrl: './courses-tags.component.html',
  //styleUrl: './courses-tags.component.scss',
})
export class AppCoursesTagsComponent implements OnInit {
  private service = inject(CourseService)

  selectedTags = model<string[]>([]); // Selected tags
  tags = signal<string[] | null>(null);

  form!: FormGroup;

  control = new FormControl<string>('');

  constructor() { }

  ngOnInit(): void {
    this.getTags();
  }

  getTags() {
    this.service.getTags().subscribe({
      next: (tags) => this.tags.set(tags),
      //error: (err) => console.error(err)
    })
  }

  selectTag(tag: string) {
    const currentTags = this.selectedTags();
    if (!currentTags.includes(tag)) {
      this.selectedTags.set([...currentTags, tag]);
    }
    /*     const tags = this.selectedTags();
        if (!tags.includes(tag)) {
          tags.push(tag);
          this.selectedTags.set(tags);
        } */
  }

  addTagFromInput(event: any) {
    const input = event.input;
    const value = event.value?.trim();
    const tags = this.selectedTags();

    if (value && !tags.includes(value)) {
      tags.push(value);
      this.selectedTags.set(tags);
    }

    if (input) input.value = '';
  }

  removeTag(tag: string) {
    let tags = this.selectedTags();
    tags = tags.filter((t) => t !== tag);
    this.selectedTags.set(tags);
  }
}
