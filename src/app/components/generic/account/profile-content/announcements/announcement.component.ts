import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { IAnnouncement } from 'src/app/common/models/interfaces';
import { SafeHtmlPipe } from 'src/app/common/pipe/safe-html.pipe';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

interface productcards {
  id: number;
  imgSrc: string;
  title: string;
  price: string;
  rprice: string;
  date:string;
}

@Component({
  selector: 'app-course-announcements',
  imports: [MaterialModule, IconModule, CommonModule, FormsModule, SafeHtmlPipe],
  templateUrl: './announcement.component.html',
})
export class AnnouncementComponent {
  @Input({ required: true }) announcements: IAnnouncement[] = [];
 
  searchText: string = '';
  filteredCount = signal<number>(0);
  
  filteredAnnouns(): IAnnouncement[] {
    if (!this.searchText) {
      return this.announcements;
    }

    const searchLower = this.searchText.toLowerCase();
    return this.announcements.filter(announ =>
      announ.content?.toLowerCase().includes(searchLower)
    );
  }

  clean() {
    this.searchText = '';
    this.filteredCount.set(this.announcements.length);
  }
}
