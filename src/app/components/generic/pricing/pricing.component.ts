import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/common/store/app.store';
import { changeUserPlan } from 'src/app/common/store/actions';
import { selectUserActivePlan } from 'src/app/common/store/selectors';
import { IPlan, IPlanFeatures } from 'src/app/common/models/interfaces';
import { IconModule } from 'src/app/icon/icon.module';
import { ConfigService } from 'src/app/services/config.service';

// card 1
interface rules {
  title: string;
  limit: boolean;
}

interface pricecards {
  id: number;
  imgSrc: string;
  plan: string;
  btnText: string;
  free: boolean;
  planPrice?: Number;
  popular?: boolean;
  rules: rules[];
}

@Component({
    selector: 'app-pricing',
    imports: [CommonModule,IconModule, MatCardModule, MatSlideToggleModule, MatButtonModule, MatSlideToggleModule],
    templateUrl: './pricing.component.html',
})
export class AppPricingComponent implements OnInit{
  private store = inject(Store<AppState>);

  protected planes = signal<IPlan[]>([]);
  activePlan$ = this.store.select(selectUserActivePlan);

  show = false;

  yearlyPrice(a: any) {
    return a * 12 * 0.9;
  }

  constructor(
    private pricingService: ConfigService
  ) {}
  ngOnInit(): void {
    this.pricingService.getPlanes().subscribe({
      next: (planes) => {
        this.planes.set(planes);
      },
    })
  }

  choosePlan(planCode: string): void {
    this.store.dispatch(changeUserPlan({ planCode }));
  }
}
