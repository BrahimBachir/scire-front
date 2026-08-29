import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/material.module";
import { LearningService } from "src/app/services";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { IconModule } from "src/app/icon/icon.module";
import { BaseFilterDirective } from "src/app/common/directives";
import { Component, inject, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ISection } from "src/app/common/models/interfaces";

// Like TopicSectionFilterComponent, but scoped to the sections already
// associated with a course (courseId), further narrowed to the selected
// category (parentId), instead of every section in that category globally.
@Component({
  selector: 'app-associated-section-filter',
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IconModule,
  ],
  templateUrl: 'associated-section-filter.component.html',
})
export class AssociatedSectionFilterComponent extends BaseFilterDirective<ISection> {
  private service = inject(LearningService);

  @Input() courseId: number | null = null;

  loadData(): void {
    if (!this.courseId || !this.parentId) {
      this.items = [];
      this.filteredItems = [];
      return;
    }

    this.service.getSectionsByCourse(this.courseId).subscribe(data => {
      this.items = data.filter(section => section.category?.id === this.parentId);
      this.filteredItems = this.items;
      this.applyCurrentValue();
    });
  }

  private applyCurrentValue(): void {
    if (this.value != null) {
      this.syncInternalControl();
      return;
    }
  }
}
