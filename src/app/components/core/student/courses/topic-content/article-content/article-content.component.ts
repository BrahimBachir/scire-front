import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { IParagraph } from "src/app/common/models/interfaces";
import { SafeHtmlPipe } from "../../../../../../common/pipe/safe-html.pipe";

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  imports: [
    CommonModule,
    SafeHtmlPipe
],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleContentComponent {
  @Input() paragraphs: IParagraph[] | null = null;
  @Input() content: string | null = null;
}
