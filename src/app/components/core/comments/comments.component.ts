import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { IconModule } from 'src/app/icon/icon.module';
import { CommonModule } from '@angular/common';
import { FeatureType, IComment, ICourseCategory, IUser, IQueryingDto } from 'src/app/common/models/interfaces';
import { CommentsService } from 'src/app/services';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { selectLogedUser } from 'src/app/common/store/selectors';

@Component({
  selector: 'app-comments',
  imports: [
    MaterialModule,
    CarouselModule,
    IconModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class AppCommentsComponent implements OnInit {

  private service = inject(CommentsService)
  private store = inject(Store<AppState>)
  @Input() featureId: number;
  @Input() featureType: FeatureType;
  length: number = 0;
  pageSize: number = 10;
  currentPageIndex: number = 0;
  dto!: IQueryingDto;
  isReplying = signal<boolean>(false);
  isCommenting = signal<boolean>(false);
  repliesDisplayed = signal<boolean>(false);
  loggedUser = signal<IUser | null>(null);

  form = new FormGroup({
    control: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]),
  });

  comments = signal<IComment[]>([]);
  selectedComment = signal<IComment | null>(null);

  ngOnInit(): void {
    this.getItems();
    this.store.select(selectLogedUser).subscribe((user) => this.loggedUser.set(user))
  }

  create(): void {
    let newComment: IComment = {
      content: this.form.get('control')?.value || '',
      featureId: this.featureId,
      featureType: this.featureType,
    }

    if (this.isReplying()) newComment.parentId = this.selectedComment()?.id;

    this.service.create(newComment).subscribe({
      next: () => {
        this.getItems();
        this.isReplying.set(false);
        this.isCommenting.set(false);
      },
      //error: (err) => { console.error(err)}
    });
  }

  getItems() {
    this.service.getAll(
      {
        take: this.pageSize,
        skip: this.pageSize * this.currentPageIndex,
        featureId: this.featureId,
        featureType: this.featureType
      }
    ).subscribe({
      next: (res) => {
        this.length = res.total || 0;
        this.comments.set(res.rows as IComment[])
      },
      //error: (error) => console.error(error)
    });
  }

  toggleActios(action: string) {
    this.f.control.setValue(null);
    if (action === 'comment') {
      this.isCommenting.set(true);
      this.isReplying.set(false);
    } else {
      this.isCommenting.set(false);
      this.isReplying.set(true);
    }
  }

  toggleComment() {
    this.f.control.setValue(null);
    this.isReplying.set(false);
    this.isCommenting.set(!this.isCommenting());
  }

  toggleReply(comment: IComment) {
    this.f.control.setValue(null);
    if (!this.selectedComment()) {
      this.isReplying.set(!this.isReplying());
      this.selectedComment.set(comment);
      this.isCommenting.set(false);
      return;
    }
    if (this.selectedComment() && this.selectedComment()?.id! == comment.id) {
      this.isReplying.set(!this.isReplying());
      this.isCommenting.set(false)
      return;
    }
    this.selectedComment.set(comment);
    this.isCommenting.set(false)
  }

  toggleRrepliesDisplayed(comment: IComment) {
    if(this.repliesDisplayed()) {
      if (this.selectedComment() && this.selectedComment()?.id !== comment.id) {
        this.selectedComment.set(comment);
        this.repliesDisplayed.set(true);
        return;
      } else {
        this.repliesDisplayed.set(!this.repliesDisplayed())
      }
    } else {
      this.selectedComment.set(comment);
      this.repliesDisplayed.set(!this.repliesDisplayed());
    }
  }

  get f() {
    return this.form.controls;
  }
}
