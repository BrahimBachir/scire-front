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
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { FeatureType, ITopic, ICourse, ICourseProgress } from 'src/app/common/models/interfaces';
import { trigger, animate, style, transition, state } from '@angular/animations';
import { MaterialModule } from 'src/app/material.module';
import { IconModule } from 'src/app/icon/icon.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize } from 'rxjs';
import { TopicService } from 'src/app/services';

export const detailExpand = trigger('detailExpand', [
  state('collapsed', style({ height: '0px', minHeight: '0' })),
  state('expanded', style({ height: '*' })),
  transition('expanded <=> collapsed', [
    animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  ]),
]);

@Component({
  selector: 'app-course-syllabus',
  templateUrl: './course-syllabus.component.html',
  imports: [
    CommonModule,
    MatCardModule,
    IconModule,
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
    TranslateModule,
    MatProgressBarModule
  ],
  styleUrl: './course-syllabus.component.scss',
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
  loading: boolean = false;
  favorite_class: string = 'star';
  user_class: string = 'user-x';
  courseProgress = signal<ICourseProgress | null>(null);

  displayedColumns = ['name', 'description', 'category', 'section', 'progress'];

  dataSource: MatTableDataSource<ITopic>;
  expandedElement: ITopic | null = null;
  
  
  constructor(
    activatedRouter: ActivatedRoute,
    public service: TopicService,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastrService,
  ) {
    this.courseId = Number(activatedRouter?.snapshot?.paramMap?.get('courseId')) || 0;
    
  }
  
  ngOnInit(): void {
    this.getSyllabus();
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToTopicContent(courseId: number, topicId: number) {
    this.router.navigate([`${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/topic/:topicId/content`.replace(':courseId', courseId.toString()).replace(':topicId', topicId.toString())]);
  }

  getSyllabus(): void {
    this.loading = true;
    this.service.getSyllabus(this.courseId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          console.log(data)
          this.topics = data.rows as ITopic[];
        },
        error: (error) => {
          //console.error('There was an error!', error);
        }
      });
  }

  getProgress(topic: ITopic): string {
    return topic.progress ? `percentage-${topic.progress.topicProgress}` : 'percentage-0'
  }
}