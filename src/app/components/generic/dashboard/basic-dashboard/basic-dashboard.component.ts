import { Component } from '@angular/core';
import { AppBDOverviewComponent } from './cards/overview/overview.component';
import { AppBDTopicsProgressComponent } from "./cards/topics-progress/topics-progress.component";
import { AppBDActivityComponent } from './cards/activity/activity.component';
import { AppBDReadinessComponent } from './cards/readiness/readiness.component';
import { AppBDNextUpComponent } from './cards/next-up/next-up.component';
import { AppBDUpgradeCtaComponent } from './cards/upgrade-cta/upgrade-cta.component';

@Component({
  selector: 'app-basic-dashboard',
  standalone: true,
  imports: [
    AppBDOverviewComponent,
    AppBDNextUpComponent,
    AppBDTopicsProgressComponent,
    AppBDActivityComponent,
    AppBDReadinessComponent,
    AppBDUpgradeCtaComponent,
],
  templateUrl: './basic-dashboard.component.html',
})
export class AppBasicDashboardComponent {
  constructor() { }
}
