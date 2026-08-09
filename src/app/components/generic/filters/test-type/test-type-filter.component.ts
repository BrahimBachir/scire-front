import { CommonModule } from "@angular/common";
import { MaterialModule } from "src/app/material.module";
import { TestService } from "src/app/services";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { IconModule } from "src/app/icon/icon.module";
import { BaseFilterDirective } from "src/app/common/directives";
import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ITestType } from "src/app/common/models/interfaces";

@Component({
  selector: 'app-test-type-filter',
  imports: [
    MatSlideToggleModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    IconModule,
  ],
  templateUrl: 'test-type-filter.component.html',
})
export class TestTypeFilterComponent extends BaseFilterDirective<ITestType> {
  private service = inject(TestService);

  loadData(): void {
    this.service.getTypes().subscribe(data => {
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