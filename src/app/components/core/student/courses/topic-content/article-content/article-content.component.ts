import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { IParagraph } from "src/app/common/models/interfaces";

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  imports:[
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleContentComponent {
  @Input() paragraphs: IParagraph[] | null = null;
}
