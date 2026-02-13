import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
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
import { FeatureType, ICourse, ICourseProgress, ITopic } from 'src/app/common/models/interfaces';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription, MatExpansionPanelActionRow } from '@angular/material/expansion';
import { MatList, MatListItem } from "@angular/material/list";
import { ToastrService } from 'ngx-toastr';
import { ERROR, SUCCESS } from 'src/app/common/config/constants';
import { AppCourseHeaderComponent } from "../course-header/course-header.component";
import { AppReviewsComponent } from '../../../reviews/reviews.component';
import { AppCommentsComponent } from '../../../comments/comments.component';
import { IconModule } from 'src/app/icon/icon.module';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CourseTopicsComponent } from '../add-course/topics/course-topics.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { ContributorsContentComponent } from '../course-contributors/contributors-content.component';
import { AppAnnouncementsComponent } from '../announcements/announcements.component';
@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  imports: [
    CommonModule,
    MatCardModule,
    IconModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTooltipModule,
    AppCourseHeaderComponent,
    AppReviewsComponent,
    AppCommentsComponent,
    ContributorsContentComponent,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    TranslateModule,
    AppAnnouncementsComponent,
  ],
  styleUrl: './course-detail.component.scss'

})
export class AppCourseDetailComponent implements OnInit {
  featureType: FeatureType = 'COURSE';
  @ViewChild(MatAccordion) accordion: MatAccordion;

  panelOpenState = false;
  topics: ITopic[] = [];
  courseGeneralPartTopics: ITopic[] = [];
  courseSpecificPartTopics: ITopic[] = [];
  courseId: number = 0;
  course!: ICourse;
  favorite: boolean = false;
  joined: boolean = false;
  favorite_class: string = 'star';
  user_class: string = 'user-x';
  courseProgress = signal<ICourseProgress | null>(null);
  displayedColumns = ['name', 'description', 'category', 'section'];

  safeHtml: SafeHtml = '';

  constructor(
    activatedRouter: ActivatedRoute,
    public courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    this.courseId = Number(activatedRouter?.snapshot?.paramMap?.get('courseId')) || 0;

  }
  ngOnInit(): void {
    this.getCourseDetail();
    this.getCourseTopics();
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  goToTopicContent(courseId: number, topicId: number) {
    this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/topic/:topicId/content`.replace(':courseId', courseId.toString()).replace(':topicId', topicId.toString())]);
  }

  addToFavorites() {
    this.favorite = !this.favorite;
    this.courseService.manageCourseFavourite(this.courseId, this.favorite).subscribe({
      next: () => {
        this.toastService.success('Curso actualizado correctamente!', SUCCESS, {
          timeOut: 3000,
        });
        if (this.favorite) {
          this.favorite_class = 'star-filled';
        } else {
          this.favorite_class = 'star';
        }
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

  joinCourse() {
    this.joined = !this.joined;
    if (this.joined) {
      this.user_class = 'user-check';
    } else {
      this.user_class = 'user-x';
    }
  }

  getCourseDetail() {
    this.courseService.getOne(this.courseId).subscribe({
      next: (res) => {
        this.course = res;
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.course?.details ?? '');
        this.setCourseColour();
        //this.updateBreadcrumbTitle();
      },
      error: (error) => {
        //console.error('There was an error!', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate([this.route?.snapshot.data['role'].toLowerCase()]);
  }

  getCourseTopics(): void {
    this.courseService.getTopics(this.courseId).subscribe({
      next: (data) => {
        this.topics = data.rows as ITopic[];
        //this.getCourseProgress();
      },
      error: (error) => {
        //console.error('There was an error!', error);
      }
    });
  }

  private updateBreadcrumbTitle(): void {
    const currentRoute = this.route.snapshot.data;
    if (currentRoute && currentRoute['urls'] && Array.isArray(currentRoute['urls'])) {
      this.route.snapshot.data['urls'][this.route.snapshot.data['urls'].length - 1].title = this.course.description;
    }
  }

  private setCourseColour(): void {
    if (this.course.type?.code === 'PROP') {
      this.course.colour = 'primary';
    } else if (this.course.type?.code === 'COM') {
      this.course.colour = 'accent';
    } else {
      this.course.colour = 'warn';
    }
  }
}
