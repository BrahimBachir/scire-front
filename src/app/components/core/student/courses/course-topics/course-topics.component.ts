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
import { CourseService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { CourseProgressService } from 'src/app/services/course-progress.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { FeatureType, ITopic, ICourse, ICourseProgress } from 'src/app/common/models/interfaces';
import { trigger, animate, style, transition, state } from '@angular/animations';
import { MaterialModule } from 'src/app/material.module';

export const detailExpand = trigger('detailExpand', [
  state('collapsed', style({ height: '0px', minHeight: '0' })),
  state('expanded', style({ height: '*' })),
  transition('expanded <=> collapsed', [
    animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  ]),
]);

@Component({
  selector: 'app-course-topics',
  templateUrl: './course-topics.component.html',
  imports: [
    CommonModule,
    MatCardModule,
    TablerIconsModule,
    MaterialModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatDividerModule,
  ],
  styleUrl: './course-topics.component.scss',
  animations: [detailExpand],

})
export class AppCourseTopicsComponent implements OnInit {
  featureType: FeatureType = 'COURSE';
  @ViewChild(MatAccordion) accordion: MatAccordion;

  panelOpenState = false;
  topics: ITopic[] = [];
  courseId: number = 0;
  course!: ICourse;
  favorite: boolean = false;
  joined: boolean = false;
  favorite_class: string = 'star';
  user_class: string = 'user-x';
  courseProgress = signal<ICourseProgress | null>(null);

  //columnsToDisplay = ['id', 'description', 'category', 'section', 'progress', 'actions'];
  columnsToDisplay = ['description', 'section', 'category'];
  dataSource: MatTableDataSource<ITopic>;
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: ITopic | null = null;
  
  
  constructor(
    activatedRouter: ActivatedRoute,
    public courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastrService,
    private courseProgressService: CourseProgressService,    
    private store: Store<AppState>,
  ) {
    this.courseId = Number(activatedRouter?.snapshot?.paramMap?.get('courseId')) || 0;
    
  }
  
  ngOnInit(): void {
    this.getCourseTopics();
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  getCourseProgress() {
    this.courseProgressService.getCourseProgress({courseId: this.courseId}).subscribe((res) => {
      this.topics.forEach((t) => t.progress = res.topics.filter((top) => top.topicId === t.id)[0].topicProgress);
      this.dataSource = new MatTableDataSource(this.topics);
      this.courseProgress.set(res);
      
    })
  }

  goToTopicContent(courseId: number, topicId: number) {
    this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/topic/:topicId/content`.replace(':courseId', courseId.toString()).replace(':topicId', topicId.toString())]);
  }

  getCourseTopics(): void {
    this.courseService.getTopics(this.courseId).subscribe({
      next: (data) => {
        this.topics = data.rows as ITopic[];
        this.getCourseProgress();
      },
      error: (error) => {
        //console.error('There was an error!', error);
      }
    });
  }
}

export interface PeriodicElement {
  name: string;
  position: string;
  id: number;
  project: string;
  symbol: string;
  description: string;
}