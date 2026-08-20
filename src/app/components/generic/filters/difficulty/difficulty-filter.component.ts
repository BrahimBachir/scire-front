import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/material.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { DifficultyService } from "src/app/services/difficulty.service";
import { IconModule } from "src/app/icon/icon.module";
import { BaseFilterDirective } from "src/app/common/directives";
import { IDifficulty } from "src/app/common/models/interfaces";
import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-difficulty-filter',
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IconModule,
  ],
  templateUrl: 'difficulty-filter.component.html',
})
export class DifficultyFilterComponent extends BaseFilterDirective<IDifficulty> {
  private service = inject(DifficultyService);

  loadData(): void {
    this.service.getDifficulties().subscribe(data => {
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