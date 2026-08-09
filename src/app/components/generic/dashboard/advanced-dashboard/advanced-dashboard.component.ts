import { Component } from '@angular/core';
import { AppADHeroComponent } from './cards/hero/hero.component';
import { AppADActivityChartComponent } from './cards/activity-chart/activity-chart.component';
import { AppADTopicPerformanceComponent } from './cards/topic-performance/topic-performance.component';
import { AppADWeakSpotsComponent } from './cards/weak-spots/weak-spots.component';
import { AppADSkillsRadarComponent } from './cards/skills-radar/skills-radar.component';
import { AppADStudyPlanComponent } from './cards/study-plan/study-plan.component';

@Component({
  selector: 'app-advanced-dashboard',
  standalone: true,
  imports: [
    AppADHeroComponent,
    AppADActivityChartComponent,
    AppADTopicPerformanceComponent,
    AppADWeakSpotsComponent,
    AppADSkillsRadarComponent,
    AppADStudyPlanComponent,
  ],
  templateUrl: './advanced-dashboard.component.html',
})
export class AppAdvancedDashboardComponent {
  constructor() {}
}
