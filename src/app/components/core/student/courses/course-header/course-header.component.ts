import { Component, input, Input, OnInit } from '@angular/core';
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
import { BasicMetricsService, CourseService, PaymentsService } from 'src/app/services';
import { ICourse } from 'src/app/common/models/interfaces';
import { ToastrService } from 'ngx-toastr';
import { ERROR, SUCCESS, WARNING } from 'src/app/common/config/constants';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'app-course-header',
  templateUrl: './course-header.component.html',
  imports: [
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
    ClipboardModule
  ],
  styleUrl: './course-header.component.scss'

})
export class AppCourseHeaderComponent implements OnInit {
  @Input() course!: ICourse;
  favourite: boolean = false;
  joined: boolean = false;
  percentage = input<number>(0)
  url: string = `${environment.front_base_url}${this.router.url}`;

  constructor(
    public activatedRouter: ActivatedRoute,
    public courseService: CourseService,
    private paymentsService: PaymentsService,
    private basicMetricsService: BasicMetricsService,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastrService,
    private snackBar: MatSnackBar

  ) {
    
  }
  ngOnInit(): void {
    this.isFavorite();
    this.isUserJoined();
    this.handleCourseCheckoutReturn();
    console.log('course-header.component.ts', this.course);
    console.log('course-header.component.ts', this.course.id);
  }

  // After a paid-course Stripe redirect back (success or cancelled), refresh
  // the joined state (the webhook may have already granted access) and
  // strip the query param so a page refresh doesn't re-trigger this.
  private handleCourseCheckoutReturn(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['checkout'] === 'success') {
        this.isUserJoined();
        this.toastService.success('¡Pago recibido! Ya tienes acceso al curso.', SUCCESS, { timeOut: 4000 });
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      } else if (params['checkout'] === 'cancelled') {
        this.toastService.warning('Pago cancelado.', WARNING, { timeOut: 3000 });
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      }
    });
  }

  isFavorite() {
    if(this.course.id) this.courseService.isFavourite(this.course.id).subscribe({
      next: (favourite) => this.favourite = favourite,
      error: (error) => {
        this.toastService.error(`${error.error.message}`, ERROR, {
          timeOut: 3000,
        });
      }
     })
  }

  isUserJoined() {
    if(this.course.id) this.courseService.isJoined(this.course.id).subscribe({
      next: (joined) => this.joined = joined,
      error: (error) => {
        this.toastService.error(`${error.error.message}`, ERROR, {
          timeOut: 3000,
        });
      }
     })
  }

  goToCourseDetails() {
    if (!this.course.id) return;
    this.basicMetricsService.getActivity(this.course.id).subscribe({
      next: (activity) => {
        const topicId = activity?.upcoming_activity?.topic_id ?? activity?.previous_activity?.topic_id;
        console.log('goToCourseDetails', topicId);
        if (topicId) this.goToTopicContent(topicId);
        else this.goToCourseSillabus();
      },
      error: (error) => {
        this.toastService.error(`${error.error.message}`, ERROR, {
          timeOut: 3000,
        });
      }
    })
  }

  private goToTopicContent(topicId: number) {
    this.router.navigate([
      `${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/topic/:topicId/content`
        .replace(':courseId', this.course.id!.toString())
        .replace(':topicId', topicId.toString()),
    ]);
  }

  goToCourseSillabus() {
    if (!this.course.id) return;
    this.router.navigate([
      `${this.route?.snapshot.data['role'].toLowerCase()}/courses/:courseId/topics`
        .replace(':courseId', this.course.id.toString()),
    ]);
  }

  addToFavorites() {
    this.favourite = !this.favourite;
    if(this.course.id) this.courseService.manageCourseFavourite(this.course.id, this.favourite).subscribe({
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
    this.showSnackbar('Elemento copiado en el portapapeles!');
  }

  joinUnjoinCourse() {
    // TODO: Lounch a joinedCourses update action so whenmy corses is droped down, 
    // the recently joined or unjoind will be aded o substracted
    if(this.joined) this.unJoinCourse();
    else this.joinCourse();
  }

  joinCourse(){
    if (!this.course.id) return;

    // Paid courses go through Stripe first — enrollment only happens once
    // the webhook confirms payment, so don't flip `joined` optimistically.
    if (this.course.isPaid) {
      this.paymentsService.createCourseCheckoutSession(this.course.id).subscribe({
        next: ({ url }) => {
          window.location.href = url;
        },
        error: (error) => {
          this.toastService.error(`${error.error.message}`, ERROR, {
            timeOut: 3000,
          });
        }
      });
      return;
    }

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
    if(this.course.id)this.courseService.unJoinCourse(this.course.id).subscribe({
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

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
