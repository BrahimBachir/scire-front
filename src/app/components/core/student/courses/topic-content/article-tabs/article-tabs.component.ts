import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, effect, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { IArticle, IArticleProgress } from "src/app/common/models/interfaces";
import { ArticleProgressFacade } from "src/app/services";
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconModule } from "src/app/icon/icon.module";

@Component({
  selector: 'app-article-tabs',
  templateUrl: './article-tabs.component.html',
  imports: [
    MatCardModule,
    IconModule,
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
  articleProgress = signal<IArticleProgress | null>(null);

  constructor() {

    effect(() => {
      const pro = this.progress.selectedArticleProgress();
      if (pro) {
        this.articleProgress.set(pro);
      }
    });

  }

  onTabIndexChanged(index: number) {
    if (!this.tabs) return;
    const tab = this.tabs[index];
    if (!tab) return;

    this.tabSelected.emit(tab);
  }
}
