import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { AppState } from 'src/app/common/store/app.store';
import { changeUserPlan, startCheckout, checkoutSessionFailed, loadLogedUser } from 'src/app/common/store/actions';
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
  private actions$ = inject(Actions);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

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

    this.actions$.pipe(ofType(checkoutSessionFailed)).subscribe(() => {
      this.showSnackbar('No se ha podido iniciar el pago. Inténtalo de nuevo.');
    });

    this.route.queryParams.subscribe((params) => {
      if (params['checkout'] === 'success') {
        this.store.dispatch(loadLogedUser());
        this.showSnackbar('¡Pago completado! Tu plan se ha actualizado.');
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      } else if (params['checkout'] === 'cancelled') {
        this.showSnackbar('Pago cancelado.');
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      }
    });
  }

  choosePlan(plan: IPlan): void {
    if (Number(plan.price) === 0) {
      this.store.dispatch(changeUserPlan({ planCode: plan.code }));
      return;
    }

    this.store.dispatch(
      startCheckout({ planCode: plan.code, interval: this.show ? 'year' : 'month' })
    );
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
