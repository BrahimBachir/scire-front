import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IRule, IArticle } from 'src/app/common/models/interfaces';
import { SchemeService } from 'src/app/services';

@Component({
  selector: 'app-scheme-create-edit',
  imports: [],
  templateUrl: './scheme-create-edit.component.html',
  styleUrl: './scheme-create-edit.component.scss'
})
export class AppSchemeCreateEditComponent implements OnInit, OnChanges {
  private service = inject(SchemeService)
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
