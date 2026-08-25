import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar, toHTML } from 'ngx-editor';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { FeedbackService } from 'src/app/services';
import { FEEDBACK_FEATURE_TYPES, IFeedbackSearchItem, IFeedbackType } from 'src/app/common/models/interfaces';
import { FeatureType } from 'src/app/common/models/interfaces/feature-types';

const MAX_SCREENSHOTS = 5;

@Component({
  selector: 'app-feedback-submit',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, IconModule, NgxDropzoneModule, NgxEditorComponent, NgxEditorMenuComponent],
  templateUrl: './feedback-submit.component.html',
  styleUrl: './feedback-submit.component.scss',
})
export class AppFeedbackSubmitComponent implements OnInit, OnDestroy {
  private service = inject(FeedbackService);
  private _snackBar = inject(MatSnackBar);

  // The autocomplete panel decides whether to (re)open at the moment the
  // user types, using whatever options exist at that instant. Since our
  // options arrive ~250ms later (debounced HTTP search), the panel never
  // opens on its own once results land - it has to be told to reopen.
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger?: MatAutocompleteTrigger;

  featureTypes = FEEDBACK_FEATURE_TYPES;
  feedbackTypes = signal<IFeedbackType[]>([]);
  itemOptions = signal<IFeedbackSearchItem[]>([]);
  selectedItem = signal<IFeedbackSearchItem | null>(null);
  screenshots = signal<File[]>([]);
  submitting = signal(false);

  editor!: Editor;
  toolbar: Toolbar = [['bold', 'italic'], ['underline'], ['ordered_list', 'bullet_list'], ['link'], ['undo', 'redo']];

  itemControl = new FormControl<IFeedbackSearchItem | string | null>('');

  form = new FormGroup({
    featureType: new FormControl<FeatureType | null>(null, Validators.required),
    feedbackTypeId: new FormControl<number | null>(null, Validators.required),
    content: new FormControl<any>(null, Validators.required),
  });

  ngOnInit(): void {
    this.editor = new Editor();

    this.service.getTypes().subscribe((types) => this.feedbackTypes.set(types));

    this.form.get('featureType')?.valueChanges.subscribe(() => {
      this.selectedItem.set(null);
      this.itemControl.setValue('', { emitEvent: false });
      this.itemOptions.set([]);
    });

    this.itemControl.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((term) => {
          const featureType = this.form.get('featureType')?.value;
          if (!featureType || typeof term !== 'string') return of([] as IFeedbackSearchItem[]);
          return this.service.searchItems(featureType, term);
        }),
      )
      .subscribe((items) => {
        this.itemOptions.set(items);
        if (items.length) this.autocompleteTrigger?.openPanel();
      });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  onItemSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedItem.set(event.option.value as IFeedbackSearchItem);
  }

  displayItem = (item: IFeedbackSearchItem | string | null): string => {
    return item && typeof item === 'object' ? item.description : '';
  };

  // The field only counts as filled once an option was actually clicked in
  // the autocomplete panel (that's what sets `selectedItem`) - free-typed
  // text that never got selected leaves the button disabled with no visible
  // reason otherwise, so surface it explicitly.
  itemNeedsSelection(): boolean {
    return !!this.itemControl.value && !this.selectedItem();
  }

  onFilesAdded(event: NgxDropzoneChangeEvent): void {
    const incoming = event.addedFiles.filter((f) => f.type.startsWith('image/'));
    this.screenshots.set([...this.screenshots(), ...incoming].slice(0, MAX_SCREENSHOTS));
  }

  removeFile(file: File): void {
    this.screenshots.set(this.screenshots().filter((f) => f !== file));
  }

  canSubmit(): boolean {
    return this.form.valid && !!this.selectedItem() && !this.submitting();
  }

  submit(): void {
    const item = this.selectedItem();
    const { featureType, feedbackTypeId, content } = this.form.value;
    if (!item || !featureType || !feedbackTypeId || !content) return;

    const text = typeof content === 'string' ? content : toHTML(content);

    this.submitting.set(true);
    this.service.submit(item.id, featureType, feedbackTypeId, text, this.screenshots()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.showSnackbar('¡Gracias! Hemos recibido tu feedback.');
        this.resetForm();
      },
      error: () => this.submitting.set(false),
    });
  }

  private resetForm(): void {
    this.form.reset();
    this.itemControl.setValue('', { emitEvent: false });
    this.selectedItem.set(null);
    this.itemOptions.set([]);
    this.screenshots.set([]);
  }

  private showSnackbar(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
