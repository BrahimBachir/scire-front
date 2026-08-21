import {
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { CourseService } from 'src/app/services';
import { ICourse, ICourseStatus } from 'src/app/common/models/interfaces';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { IconModule } from 'src/app/icon/icon.module';
import { BaseFilterDirective } from 'src/app/common/directives';
import { AppState } from 'src/app/common/store/app.store';
import { Store } from '@ngrx/store';
import { selectLogedUser, selectUserRole } from 'src/app/common/store/selectors';

@Component({
  selector: 'course-status-filter',
  templateUrl: './course-status-filter.component.html',
  imports: [
    CommonModule,
    MaterialModule,
    MatCardModule,
    IconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    RouterModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class CourseStatusFilterComponent extends BaseFilterDirective<ICourseStatus> {
  // The course being edited. Required in EDITING mode so the workflow
  // action buttons (submit for review / publish / archive) know what to act on.
  @Input() courseId: number | null = null;
  // The course's creator. Only the creator (not other contributors) may submit it for review.
  @Input() creatorId: number | null = null;

  roleCode: string = '';
  userId: number | null = null;
  processing = false;

  private service = inject(CourseService);
  private store = inject(Store<AppState>)
    .select(selectUserRole)
    .subscribe(role => this.roleCode = role.code || '');
  private userStore = inject(Store<AppState>)
    .select(selectLogedUser)
    .subscribe(user => this.userId = user?.id ?? null);

  loadData(): void {
    this.service.getStatuses().subscribe(data => {
      this.items = data;
      this.filteredItems = data;
      this.applyCurrentValue();
    });
  }

  get currentStatus(): ICourseStatus | null {
    return this.items.find(s => s.id === this.value) || null;
  }

  get isSuper(): boolean {
    return this.roleCode === 'SUPER';
  }

  get isCreator(): boolean {
    return this.creatorId != null && this.userId != null && this.creatorId === this.userId;
  }

  get canSubmitForReview(): boolean {
    return this.mode === 'EDITING' && this.currentStatus?.code === 'DRAFT' && this.isCreator;
  }

  get canPublish(): boolean {
    return this.mode === 'EDITING' && this.currentStatus?.code === 'APROVED';
  }

  get canArchive(): boolean {
    return (
      this.mode === 'EDITING' &&
      this.isSuper &&
      !!this.currentStatus &&
      this.currentStatus.code !== 'ARCHIVED'
    );
  }

  submitForReview(): void {
    if (!this.courseId) return;
    this.runTransition(this.service.submitForReview(this.courseId));
  }

  publish(): void {
    if (!this.courseId) return;
    this.runTransition(this.service.publish(this.courseId));
  }

  archive(): void {
    if (!this.courseId) return;
    this.runTransition(this.service.archive(this.courseId));
  }

  private runTransition(request$: Observable<ICourse>): void {
    if (this.processing) return;
    this.processing = true;
    request$.subscribe({
      next: (updated) => {
        this.processing = false;
        if (updated.statusId != null) {
          this.writeValue(updated.statusId);
          this.onChange(updated.statusId);
          this.valueChange.emit(updated.statusId);
        }
      },
      error: () => this.processing = false,
    });
  }

  private applyCurrentValue(): void {
    if (this.value != null) {
      this.syncInternalControl();
      return;
    }

    if (this.mode === 'CREATING') {
      const draft = this.items.find(s => s.code === 'DRAFT');
      if (!draft) return;
      this.writeValue(draft.id);
      this.onChange(draft.id);
      this.control.disable({ emitEvent: false });
    }
  }
}