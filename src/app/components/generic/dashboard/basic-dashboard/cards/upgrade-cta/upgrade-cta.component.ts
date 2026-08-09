import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconModule } from 'src/app/icon/icon.module';

@Component({
  selector: 'app-bd-upgrade-cta',
  standalone: true,
  imports: [
    CommonModule,
    IconModule,
  ],
  templateUrl: './upgrade-cta.component.html',
  styleUrl: './upgrade-cta.component.scss',
})
export class AppBDUpgradeCtaComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  goToPricing() {
    const role = this.route.snapshot.data['role']?.toLowerCase();
    this.router.navigate([`${role}/pricing`]);
  }
}
