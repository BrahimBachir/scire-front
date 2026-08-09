import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NgScrollbarModule } from "ngx-scrollbar";
import { IAnnouncement } from "src/app/common/models/interfaces";
import { SafeHtmlPipe } from "src/app/common/pipe/safe-html.pipe";
import { IconModule } from "src/app/icon/icon.module";
import { MaterialModule } from "src/app/material.module";
import { AnnouncementsService } from "src/app/services";

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  imports: [
    CommonModule,
    MatCardModule,
    IconModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    TranslateModule,
    SafeHtmlPipe,
  ],
  styleUrl: './announcements.component.scss',
})
export class AppAnnouncementsComponent implements OnInit {
  public service = inject(AnnouncementsService);
  private route = inject(ActivatedRoute);
  selectedId: number = 0;

  items = signal<IAnnouncement[] | null>(null);

  courseId: number = 0;

  constructor() {
    this.courseId =
      Number(this.route?.snapshot?.paramMap?.get('courseId')) || 0;
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    this.service.getAll(this.courseId).subscribe((announs) => {
      console.log(announs);
      this.items.set(announs);
    });
  }

  toggleExpand(item: any) {
    if (this.selectedId === item.id) {
      this.selectedId = 0;
    } else {
      this.selectedId = item.id;
      this.increaseViewCount(item.id);
    }
  }

  increaseViewCount(id: number) {
    this.service.increaseViews(id).subscribe();
  }
}