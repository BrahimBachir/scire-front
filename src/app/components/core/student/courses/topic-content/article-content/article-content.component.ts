import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { IArticle, IParagraph } from "src/app/common/models/interfaces";
import { SafeHtmlPipe } from "../../../../../../common/pipe/safe-html.pipe";
import { IconModule } from "src/app/icon/icon.module";

interface IArticleHierarchyLevel {
  icon: string;
  value: string;
}

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  imports: [
    CommonModule,
    SafeHtmlPipe,
    IconModule
],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleContentComponent {
  @Input() article: IArticle | null = null;
  @Input() paragraphs: IParagraph[] | null = null;
  @Input() content: string | null = null;

  get hierarchy(): IArticleHierarchyLevel[] {
    if (!this.article) return [];

    const levels: { icon: string; value?: string | null }[] = [
      { icon: 'book', value: this.article.book },
      { icon: 'certificate', value: this.article.title },
      { icon: 'file-text', value: this.article.chapter },
      { icon: 'list-search', value: this.article.section },
      { icon: 'point', value: this.article.subsection },
    ];

    return levels.filter(
      (level): level is IArticleHierarchyLevel => !!level.value,
    );
  }
}
