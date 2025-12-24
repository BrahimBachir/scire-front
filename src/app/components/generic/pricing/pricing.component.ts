import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TablerIconsModule } from 'angular-tabler-icons';
import { IPlan, IPlanFeatures } from 'src/app/common/models/interfaces';
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
    imports: [CommonModule,TablerIconsModule, MatCardModule, MatSlideToggleModule, MatButtonModule, MatSlideToggleModule],
    templateUrl: './pricing.component.html',
})
export class AppPricingComponent implements OnInit{
  protected planes = signal<IPlan[]>([]);

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
        console.log("Planes",this.planes())
      },
    })
  }
}
