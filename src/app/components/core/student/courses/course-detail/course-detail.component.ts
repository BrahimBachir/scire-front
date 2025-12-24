import { Component, OnInit, signal, ViewChild } from '@angular/core';
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
import { FeatureType, ICourse, ITopic } from 'src/app/common/models/interfaces';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription, MatExpansionPanelActionRow } from '@angular/material/expansion';
import { MatList, MatListItem } from "@angular/material/list";
import { ToastrService } from 'ngx-toastr';
import { ERROR, SUCCESS } from 'src/app/common/config/constants';
import { AppCourseHeaderComponent } from "../course-header/course-header.component";
import { switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { selectChoosenCourse } from 'src/app/common/store/selectors/learning.selectors';
import { AppReviewsComponent } from '../../../reviews/reviews.component';
@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
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
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelActionRow,
    MatList,
    MatListItem,
    AppCourseHeaderComponent,
    AppReviewsComponent
  ],
  styleUrl: './course-detail.component.scss'

})
export class AppCourseDetailComponent implements OnInit {
  featureType: FeatureType = 'COURSE';
  goToTopicContent(courseId: number, topicId: number) {
    this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/topic/:topicId/content`.replace(':courseId', courseId.toString()).replace(':topicId', topicId.toString())]);
  }
  getTopicBlocks(id: number) {
    console.log('Fetching blocks for topic ID:', id);
  }
  @ViewChild(MatAccordion) accordion: MatAccordion;

  panelOpenState = false;
  courseGeneralPartTopics: ITopic[] = [];
  courseSpecificPartTopics: ITopic[] = [];


  // 3 accordian
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

  goToCourseContent() {
    //console.log('Navigating to course content...', this.id());
    //this.router.navigate(['/apps/courses/:id/content'.replace(':id', this.id())]);
  }

  addToFavorites() {
    this.favorite = !this.favorite;
    this.courseService.manageCourseFavourite(this.id, this.favorite).subscribe({
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

  id: number = 0;
  course!: ICourse;
  favorite: boolean = false;
  joined: boolean = false;
  favorite_class: string = 'star';
  user_class: string = 'user-x';


  constructor(
    public courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastrService,
    private store: Store<AppState>,
  ) {

  }
  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          this.id = Number(params.get('courseId')) || 0; // or 'id', depending on your route config
          return this.store.select(selectChoosenCourse);
        })
      )
      .subscribe(() => {
        this.getCourseDetail();
        this.getCourseTopics();
      });
  }

  getCourseDetail() {
    this.courseService.getOne(this.id).subscribe({
      next: (res) => {
        this.course = res;
        this.setCourseColour();
        //this.updateBreadcrumbTitle();
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate([this.route?.snapshot.data['role'].toLowerCase()]);
  }

  getCourseTopics(): void {
    this.courseService.getTopics(this.id).subscribe({
      next: (data) => {
        let rows = data.rows as ITopic[];
        this.courseGeneralPartTopics = rows.filter(topic => topic.section?.category?.code === 'GEN');
        this.courseSpecificPartTopics = rows.filter(topic => topic.section?.category?.code === 'SPEC');
      },
      error: (error) => {
        console.error('There was an error!', error);
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
