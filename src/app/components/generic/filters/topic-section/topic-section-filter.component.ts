import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/material.module";
import { LearningService } from "src/app/services";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { IconModule } from "src/app/icon/icon.module";
import { BaseFilterDirective } from "src/app/common/directives";
import { Component, inject, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IQueryingDto, ISection } from "src/app/common/models/interfaces";

@Component({
  selector: 'app-topic-section-filter',
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IconModule,
  ],
  templateUrl: 'topic-section-filter.component.html',
})
export class TopicSectionFilterComponent extends BaseFilterDirective<ISection> {
  private service = inject(LearningService);

  loadData(): void {
    if (this.parentId === null && this.mode !== 'FILTERING') {
      this.items = [];
      this.filteredItems = [];
      return;
    }

    this.service.getSections({parentId: this.parentId ?? null}).subscribe(data => {
      this.items = data;
      this.filteredItems = data;
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