import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/material.module";
import { LearningService } from "src/app/services";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { IconModule } from "src/app/icon/icon.module";
import { BaseFilterDirective } from "src/app/common/directives";
import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ITopic } from "src/app/common/models/interfaces";

@Component({
  selector: 'app-topic-filter',
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IconModule,
  ],
  templateUrl: 'topic-filter.component.html',
})
export class TopicFilterComponent extends BaseFilterDirective<ITopic> {
  private service = inject(LearningService);

  loadData(): void {
    if (this.parentId === null && this.mode !== 'FILTERING') {
      this.items = [];
      this.filteredItems = [];
      return;
    }

    this.service.getTopics({parentId: this.parentId ?? 0}).subscribe(data => {
      this.items = data.rows as ITopic[];
      this.filteredItems = data.rows as ITopic[];
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