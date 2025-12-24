import { Component, Input, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from 'src/environments/environment';
import { CourseService } from 'src/app/services';
import { ICourse, ITopic } from 'src/app/common/models/interfaces';
import { ToastrService } from 'ngx-toastr';
import { ERROR, SUCCESS, WARNING } from 'src/app/common/config/constants';
@Component({
  selector: 'app-course-header',
  templateUrl: './course-header.component.html',
  imports: [
    MatCardModule,
    TablerIconsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  styleUrl: './course-header.component.scss'

})
export class AppCourseHeaderComponent implements OnInit {
  @Input() course!: ICourse;
  favourite: boolean = false;
  joined: boolean = false;


  constructor(
    public activatedRouter: ActivatedRoute,
    public courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastrService,
    
  ) {
    
  }
  ngOnInit(): void {
    this.isFavorite();
    this.isUserJoined();
  }

  isFavorite() {
     this.courseService.isFavourite(this.course.id).subscribe({
      next: (favourite) => this.favourite = favourite,
      error: (error) => {
        this.toastService.error(`${error.error.message}`, ERROR, {
          timeOut: 3000,
        });
      }
     })
  }

  isUserJoined() {
         this.courseService.isJoined(this.course.id).subscribe({
      next: (joined) => this.joined = joined,
      error: (error) => {
        this.toastService.error(`${error.error.message}`, ERROR, {
          timeOut: 3000,
        });
      }
     })
  }

    goToCourseContent() {
    //console.log('Navigating to course content...', this.id());
    //this.router.navigate(['/apps/courses/:id/content'.replace(':id', this.id())]);
  }

  addToFavorites() {
    this.favourite = !this.favourite;
    this.courseService.manageCourseFavourite(this.course.id, this.favourite).subscribe({
      next: () => {
        this.toastService.success('Curso actualizado correctamente!', SUCCESS, {
          timeOut: 3000,
        });
      },
      error: (error) => {
        this.toastService.error(`${error.error.message}`, ERROR, {
          timeOut: 3000,
        });
      }
    })
  }

  shareCourse() {
    throw new Error(`Method not implemented. ${environment.front_base_url}/${this.router.url}`);
  }

  joinUnjoinCourse() {
    // TODO: Lounch a joinedCourses update action so whenmy corses is droped down, 
    // the recently joined or unjoind will be aded o substracted
    if(this.joined) this.unJoinCourse();
    else this.joinCourse();
  }

  joinCourse(){
    this.joined = true;
    this.courseService.joinCourse(this.course.id).subscribe({
      next: () => {
        this.toastService.success('Te has unido al curso!', SUCCESS, {
          timeOut: 3000,
        });
      },
      error: (error) => {
        this.toastService.error(`${error.error.message}`, ERROR, {
          timeOut: 3000,
        });
      }
    })    
  }
  
  unJoinCourse(){
    this.joined = false;
    this.courseService.unJoinCourse(this.course.id).subscribe({
      next: () => {
        this.toastService.warning('Has salido!', WARNING, {
          timeOut: 3000,
        });
      },
      error: (error) => {
        this.toastService.error(`${error.error.message}`, ERROR, {
          timeOut: 3000,
        });
      }
    })
  }
  

  goBack(): void {
    this.router.navigate([this.route?.snapshot.data['role'].toLowerCase()]);
  }
}
