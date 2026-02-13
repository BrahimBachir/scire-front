import { Component, Input } from '@angular/core';

import { MaterialModule } from 'src/app/material.module';


import { CommonModule } from '@angular/common';
import { IconModule } from 'src/app/icon/icon.module';
import { IUser } from 'src/app/common/models/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-contributors-list',
  imports: [MaterialModule, CommonModule, IconModule],
  templateUrl: './contributors-content.component.html',
  styleUrl: './contributors-content.component.scss'
})
export class ContributorsContentComponent {
  @Input({ required: true }) contributors: IUser[] = [];

  courseId: number = 0;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.courseId = Number(this.route?.snapshot?.paramMap?.get('courseId')) || 0;
    console.log("Loaded an instructor compoentn!")
  }


  goToContributorDetails(userId: number | undefined) {
    const currentUrl = this.router.url;

    const baseRoleUrl = currentUrl.split('/')[1];
    if (userId)
      this.router.navigate([`${baseRoleUrl}/courses/:courseId/contributors/:userId`.replace(':courseId', this.courseId.toString()).replace(':userId', userId.toString())]);
  }
}

