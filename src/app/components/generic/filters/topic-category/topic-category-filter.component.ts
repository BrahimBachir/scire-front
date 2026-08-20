import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/material.module";
import { LearningService } from "src/app/services";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { IconModule } from "src/app/icon/icon.module";
import { BaseFilterDirective } from "src/app/common/directives";
import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ITopicCategory } from "src/app/common/models/interfaces";

@Component({
  selector: 'app-topic-category-filter',
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IconModule,
  ],
  templateUrl: 'topic-category-filter.component.html',
})
export class TopicCategoryFilterComponent extends BaseFilterDirective<ITopicCategory> {
  private service = inject(LearningService);

  loadData(): void {
    this.service.getCategories().subscribe(data => {
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
    this.autoSelectIfSingleOption();
  }
}