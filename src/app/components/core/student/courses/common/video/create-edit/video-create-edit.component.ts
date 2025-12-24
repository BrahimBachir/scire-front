import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IRule, IArticle } from 'src/app/common/models/interfaces';
import { VideoService } from 'src/app/services';

@Component({
  selector: 'app-video-create-edit',
  imports: [],
  templateUrl: './video-create-edit.component.html',
  styleUrl: './video-create-edit.component.scss'
})
export class AppVideoCreateEditComponent implements OnInit, OnChanges {
  private service = inject(VideoService)
  @Input() rule!: IRule;
  @Input() article!: IArticle;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();


  ngOnInit(): void {
/*     this.service.getByRule(this.ruleCode, this.artiCode).subscribe({
      next: (data) => {
        console.log("Video from the server: ",data)
      },
      error: (error) => console.error(error) 
    }) */
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("CHANGED:", changes);
  }
}
