import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit, Optional, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TablerIconsModule } from "angular-tabler-icons";
import { ICategory, IDifficulty, IQuestion, ISection, ITest, ITestType, ITopic, IUser, QueryingDto } from "src/app/common/models/interfaces";
import { createDefaultTest } from "src/app/common/models/states";
import { MaterialModule } from "src/app/material.module";
import { LearningService, TestService } from "src/app/services";
import { AppAddTestComponent } from "../add/add-test.component";
import { TestDialogData } from "src/app/common/models/interfaces/test-data.interface";
import { debounceTime, startWith } from "rxjs";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: 'app-dialog-content',
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TablerIconsModule,
  ],
  templateUrl: 'test-dialog-content.html',
})
export class AppTestDialogContentComponent implements OnInit {
  protected testTypes = signal<ITestType[]>([]);
  protected filteredTestTypes = signal<ITestType[]>([]);
  protected selectedTestTypes = signal<ITestType | null>(null);

  protected difficulties = signal<IDifficulty[]>([]);
  protected filteredDifficulties = signal<IDifficulty[]>([]);
  protected selectedDifficulty = signal<IDifficulty | null>(null);

  protected categories = signal<ICategory[]>([]);
  protected filteredCategories = signal<ICategory[]>([]);
  protected selectedCategory = signal<ICategory | null>(null);

  protected sections = signal<ISection[]>([]);
  protected filteredSections = signal<ISection[]>([]);
  protected selectedSection = signal<ISection | null>(null);

  protected topics = signal<ITopic[]>([]);
  protected filteredTopics = signal<ITopic[]>([]);
  protected selectedTopic = signal<ITopic | null>(null);

  protected testTypeControl = new FormControl<IDifficulty | string>('');
  protected difficultyControl = new FormControl<IDifficulty | string>('');
  protected categoryControl = new FormControl<ICategory | string>('');
  protected sectionControl = new FormControl<ISection | string>('');
  protected topicControl = new FormControl<ITopic | string>('');
  protected numQuestions = new FormControl<number>(0);
  protected timed = new FormControl<boolean>(false);

  filterForm!: FormGroup;
  minDifficulty: number = 6;
  testUser!: IUser;
  test: ITest = createDefaultTest();
  queryingDTO!: QueryingDto;

  showFilters: boolean = true;
  protected questions!: IQuestion[];

  action: string | any;
  local_data: ITest;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppTestDialogContentComponent>,
    private testService: TestService,
    private snackBar: MatSnackBar,
    private learningService: LearningService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: TestDialogData
  ) {
    this.action = data.action;
    this.local_data = { ...data.test };
  }
  ngOnInit(): void {
    this.getDifficulties();
    this.getTypes();
    this.getCategories();
    this.getSections();
    this.getTopics();

    this.difficultyControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      this.filteredDifficulties.set(this._filterDifficulties(value || ''));
    });

    this.testTypeControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      this.filteredTestTypes.set(this._filterTestTypes(value || ''));
    });

    this.categoryControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      this.filteredCategories.set(this._filterCategories(value || ''));
    });

    this.sectionControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      this.filteredSections.set(this._filterSections(value || ''));
    });

    this.topicControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
    ).subscribe(value => {
      this.filteredTopics.set(this._filterTopics(value || ''));
    });
  }

  doAction(): void {
    if (this.action === 'Add') {
      this.saveTest();
      this.dialogRef.close();
      // Open success dialog
      const successDialogRef = this.dialog.open(AppAddTestComponent);
      successDialogRef.afterClosed().subscribe(() => {
        this.dialogRef.close({ event: 'Refresh' });
        this.openSnackBar('Test Added successfully!', 'Close');
      });
    } else if (this.action === 'Update') {
      this.testService.updateTest(this.local_data);
      this.dialogRef.close({ event: 'Update' });
      this.openSnackBar('Test Updated successfully!', 'Close');
    } else if (this.action === 'Delete') {
      this.testService.deleteTest(this.local_data.id);
      this.dialogRef.close({ event: 'Delete' });
      this.openSnackBar('Test Deleted successfully!', 'Close');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  saveTest() {
    console.log("Topic", this.topicControl.value);
    console.log("Timed?", this.timed.value);
    console.log("Number of questions?", this.numQuestions.value);
  }

  getCategories(): void {
    this.learningService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.filteredCategories.set(data);
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  getSections(): void {
    this.learningService.getSections().subscribe({
      next: (data) => {
        this.sections.set(data);
        this.filteredSections.set(data);
      },
      error: (err) => console.error('Error fetching sections:', err),
    });
  }

  getDifficulties(): void {
    this.testService.getDifficulties().subscribe({
      next: (data) => {
        this.difficulties.set(data);
        this.filteredDifficulties.set(data);
      },
      error: (err) => console.error('Error fetching difficulties:', err),
    });
  }

  getTypes(): void {
    this.testService.getTypes().subscribe({
      next: (data) => {
        this.testTypes.set(data);
        this.filteredTestTypes.set(data);
      },
      error: (err) => console.error('Error fetching types:', err),
    });
  }

  getTopics(): void {
    if (this.local_data.section && this.local_data.section.id) this.learningService.getTopics({ parentId: this.local_data.section?.id }).subscribe({
      next: (data) => {
        this.topics.set(data.rows);
        this.filteredTopics.set(data.rows);
      },
      error: (err) => console.error('Error fetching topics:', err),
    });
    else this.learningService.getTopics().subscribe({
      next: (data) => {
        this.topics.set(data.rows);
        this.filteredTopics.set(data.rows);
        console.log('Topics loaded:', data);
      },
      error: (err) => console.error('Error fetching topics:', err),
    });
  }

  private _getFilterValue(value: ICategory | ISection | ITopic | IDifficulty | ITestType | string | null): string {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    if (value && value.name) {
      return value.name.toLowerCase();
    }
    return '';
  }

  private _filterCategories(value: ICategory | string | null): ICategory[] {
    const filterValue = this._getFilterValue(value);

    return this.categories().filter((c) => c.name.toLowerCase().includes(filterValue));
  }

  private _filterSections(value: ICategory | string | null): ISection[] {
    const filterValue = this._getFilterValue(value);

    return this.sections().filter((s) => s.name.toLowerCase().includes(filterValue));
  }

  private _filterTopics(value: ICategory | string | null): ITopic[] {
    const filterValue = this._getFilterValue(value);

    return this.topics().filter((t) => t.name.toLowerCase().includes(filterValue));
  }

  private _filterDifficulties(value: IDifficulty | string | null): IDifficulty[] {
    const filterValue = this._getFilterValue(value);

    return this.difficulties().filter((t) => t.name.toLowerCase().includes(filterValue));
  }

  private _filterTestTypes(value: ITestType | string | null): ITestType[] {
    const filterValue = this._getFilterValue(value);

    return this.testTypes().filter((t) => t.name.toLowerCase().includes(filterValue));
  }

  displayEntityName = (entity: ICategory | ISection | ITopic | string | null): string => {
    return (entity && typeof entity !== 'string' && entity.name) ? entity.name : (entity as string || '');
  };

  onTestTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as ITestType;
    this.selectedTestTypes.set(selected);
    console.log('Selected testType:', selected);
  }

  onDifficultySelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as IDifficulty;
    this.selectedDifficulty.set(selected);
    console.log('Selected difficulty:', selected);
  }

  onCategorySelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as ICategory;
    this.selectedCategory.set(selected);
    console.log('Selected Category:', selected);
  }

  onSectionSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as ISection;
    this.selectedSection.set(selected);
    console.log('Selected section:', selected);
  }

  onTopicSelected(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value as ITopic;
    this.selectedTopic.set(selected);
    console.log('Selected topic:', selected);
  }
}
