import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-faq',
    imports: [MatCardModule, MatExpansionModule, MatButtonModule, TranslateModule],
    templateUrl: './faq.component.html'
})
export class AppFaqComponent {
  readonly faqItems: { key: string }[] = [
    { key: 'CREATE_COURSE' },
    { key: 'JOIN_COURSE' },
    { key: 'SHARE_COURSE' },
    { key: 'FAVORITE_COURSE' },
    { key: 'CHANGE_ROLE' },
    { key: 'UPGRADE_PLAN' },
    { key: 'COURSE_STATS' },
    { key: 'CREATE_TEST' },
    { key: 'TEST_STATS' },
    { key: 'RESET_PASSWORD' },
    { key: 'FREE_PLAN_VOUCHER' },
    { key: 'EXAM_READINESS' },
  ];

  readonly contactUrl = 'https://kaptya.com/contact/';
}
