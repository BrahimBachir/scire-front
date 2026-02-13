import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { CourseService } from 'src/app/services';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ICourse } from 'src/app/common/models/interfaces';
import { loadCourse } from 'src/app/common/store/actions/learning.actions';
import { AppState } from 'src/app/common/store/app.store';
import { selectChoosenCourse } from 'src/app/common/store/selectors/learning.selectors';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, IconModule, MaterialModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  private activatedRouter = inject(ActivatedRoute);
  courses: ICourse[] = [];
  course: ICourse | null;
  
  constructor(
      private courseService: CourseService,
      private store: Store<AppState>,
      private route: ActivatedRoute
  ){}


  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  ngOnInit(): void {
    this.store.select(selectChoosenCourse).subscribe({
      next: (course) => this.course = course,
    })
    this.getCourseTypes();
  }

  getCourseTypes() {
    this.courseService.getMyCourses().subscribe({
      next: (data) => {
        this.courses = data;
        //this.store.dispatch(loadCourse(this.courses[0]));
      },
      error: (error) => {
        //console.error('There was an error!', error);
      }
    });
  }

  setSelectedCourse(course: ICourse){
    this.store.dispatch(loadCourse(course))
  }

  goToCourseDetails(course: ICourse) {
    console.log(this.activatedRouter?.snapshot)
        const currentUrl = this.router.url;

    const baseRoleUrl = currentUrl.split('/')[1];
    if (course.id) 
      this.router.navigate([`${baseRoleUrl}/courses/:courseId/details`.replace(':courseId', course.id.toString())]);
  }
}
