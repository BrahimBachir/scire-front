import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICourse } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';
import { AppBannersNotFoundComponent } from '../../../banners/not-found/banner-not-found.component';

interface socialcards {
  id: number;
  imgSrc: string;
  username: string;
  post: string;
}
@Component({
  selector: 'app-user-courses',
  imports: [MaterialModule, IconModule, CommonModule, FormsModule,
      AppBannersNotFoundComponent,],
  templateUrl: './user-courses.component.html',
  styleUrl: './user-courses.component.scss',
})
export class UserCoursesComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  @Input({ required: true }) courses: ICourse[] = []

  searchText: string = '';
  filteredCount = signal<number>(0);

  ngOnInit() {
    this.filteredCount.set(this.courses.length);
    this.filteredCourses();
  }
  filteredCourses(): ICourse[] {
    let result = this.courses;
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      result = this.courses.filter(student =>
        student?.code?.toLowerCase().includes(searchLower) ||
        student?.description?.toLowerCase().includes(searchLower)
      );
    }
    return result;
  }

  clean() {
    this.searchText = '';
    this.filteredCount.set(this.courses.length);
  }

  goToCourseDetails(course: ICourse) {
    if (course.id) this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/details`.replace(':courseId', course.id.toString())]);
  }
}
