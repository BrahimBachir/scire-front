import { Component, inject, OnInit } from '@angular/core';
import { StudentsComponent } from './students/students.component';
import { UserCoursesComponent } from './user-courses/user-courses.component';
import { AnnouncementComponent } from './announcements/announcement.component';
import { MaterialModule } from 'src/app/material.module';


import { CommonModule } from '@angular/common';
import { IconModule } from 'src/app/icon/icon.module';
import { ISocialMedia, IUser } from 'src/app/common/models/interfaces';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services';

@Component({
  selector: 'app-profile-content',
  imports: [MaterialModule, StudentsComponent, UserCoursesComponent, AnnouncementComponent, CommonModule, IconModule],
  templateUrl: './profile-content.component.html',
  styleUrl: './profile-content.component.scss'
})
export class ProfileContentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(UsersService);


  pageTitle = 'UserProfile';
  selectedTab = 0;

  user: IUser;
  email: string;
  phone: string;
  socialMedias: ISocialMedia[] = [];

  courseId: number = 0;
  userId: number = 0;

  constructor() {
    this.courseId = Number(this.route?.snapshot?.paramMap?.get('courseId')) || 0;
    this.userId = Number(this.route?.snapshot?.paramMap?.get('userId')) || 0;
    console.log("ID: ", this.courseId, this.userId)
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.service.getInstructor(this.userId).subscribe((user) => {
      this.user = user;
      this.email = this.user.emails?.find(e => e.by_default === true)?.value ?? '';
      this.phone = this.user.phones?.find(e => e.has_whatsapp === true)?.number ?? '';
      this.socialMedias = this.user.social_medias ?? [];
    });
  }
}