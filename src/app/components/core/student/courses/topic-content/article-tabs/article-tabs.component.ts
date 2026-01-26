import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { TablerIconsModule } from "angular-tabler-icons";
import { IArticle } from "src/app/common/models/interfaces";
import { ArticleProgressFacade } from "src/app/services";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-article-tabs',
  templateUrl: './article-tabs.component.html',
  imports: [
    MatCardModule,
    TablerIconsModule,
    MatStepperModule,
    CommonModule,
    MatTabsModule,
    MatTooltipModule,
  ],
})
export class ArticleTabsComponent {
  @Input() tabs: IArticle[] | null = [];
  @Input() progress!: ArticleProgressFacade;
  @Input() selectedTabIndex: number = 0;
  @Output() tabSelected = new EventEmitter<IArticle>();

  onTabIndexChanged(index: number) {
    if(!this.tabs) return;
    const tab = this.tabs[index];
    if (!tab) return;

    this.tabSelected.emit(tab);
  }
}
